package com.affluo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "inventory_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {
    
    @Id
    private String id;
    
    @Indexed
    private String companyId;
    
    @Indexed
    private String listId; // Reference to the list this item belongs to
    
    @Indexed
    private String listItemId; // Reference to the specific list item
    
    // Core inventory data
    private String sku;
    private String name;
    private String category;
    private BigDecimal unitPrice;
    private BigDecimal costPrice;
    private String supplier;
    
    // Stock tracking
    private Integer currentStock;
    private Integer minimumStock;
    private Integer maximumStock;
    private String unitOfMeasure; // pieces, kg, liters, etc.
    
    // Location tracking
    private String warehouse;
    private String location; // shelf, bin, etc.
    
    // Status and metadata
    private String status; // ACTIVE, DISCONTINUED, OUT_OF_STOCK
    private Map<String, Object> customFields; // Additional company-specific fields
    
    // Audit fields
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String lastModifiedBy;
    
    // Calculated fields (for performance)
    private BigDecimal totalValue; // currentStock * unitPrice
    private LocalDateTime lastMovementDate;
    private Integer totalMovements; // Count of inventory movements
}
