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

@Document(collection = "inventory_movements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryMovement {
    
    @Id
    private String id;
    
    @Indexed
    private String companyId;
    
    @Indexed
    private String inventoryItemId;
    
    @Indexed
    private String formId; // Reference to the form that triggered this movement
    
    @Indexed
    private String formSubmissionId; // Reference to the specific form submission
    
    // Movement details
    private String movementType; // IN, OUT, ADJUSTMENT, TRANSFER, DAMAGE, RETURN
    private Integer quantity;
    private BigDecimal unitPrice; // Price at time of movement
    private BigDecimal totalValue; // quantity * unitPrice
    
    // Stock levels before and after
    private Integer stockBefore;
    private Integer stockAfter;
    
    // Reference information
    private String referenceNumber; // PO number, invoice number, etc.
    private String referenceType; // PURCHASE_ORDER, SALE, ADJUSTMENT, etc.
    private String notes;
    
    // Location tracking
    private String fromLocation;
    private String toLocation;
    
    // User and timestamp
    private String performedBy;
    private LocalDateTime performedAt;
    
    // Additional metadata
    private Map<String, Object> metadata; // Form-specific data, custom fields, etc.
    
    // Audit trail
    private String createdBy;
    private LocalDateTime createdAt;
    
    // Calculated fields
    private BigDecimal averageCost; // For FIFO/LIFO calculations
    private String movementReason; // Derived from form type and data
}
