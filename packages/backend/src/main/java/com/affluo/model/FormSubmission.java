package com.affluo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "form_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormSubmission {
    
    @Id
    private String id;
    
    @Indexed
    private String companyId;
    
    @Indexed
    private String formId;
    
    // Submission data
    private Map<String, Object> data;
    private String status; // DRAFT, SUBMITTED, PROCESSED, REJECTED
    
    // User information
    private String submittedBy;
    private String submittedByEmail;
    private LocalDateTime submittedAt;
    
    // Processing information
    private String processedBy;
    private LocalDateTime processedAt;
    private String processingNotes;
    
    // Inventory tracking
    private Boolean affectsInventory; // Whether this submission affects inventory
    private List<InventoryAdjustment> inventoryAdjustments; // List of inventory changes
    private String inventoryStatus; // PENDING, PROCESSED, FAILED
    
    // Audit trail
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String lastModifiedBy;
    
    // Additional metadata
    private Map<String, Object> metadata;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InventoryAdjustment {
        private String inventoryItemId;
        private String sku;
        private String itemName;
        private Integer quantity;
        private String adjustmentType; // IN, OUT, ADJUSTMENT
        private String reason; // SALE, PURCHASE, DAMAGE, etc.
        private Map<String, Object> formData; // Relevant form field data
        private Boolean processed;
        private String processingError;
    }
}
