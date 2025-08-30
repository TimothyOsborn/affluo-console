package com.affluo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryAdjustmentRequest {
    private String formSubmissionId;
    private String formId;
    private String companyId;
    private String performedBy;
    private String adjustmentType; // IN, OUT, ADJUSTMENT
    private String reason; // SALE, PURCHASE, DAMAGE, etc.
    private String referenceNumber;
    private String notes;
    private Map<String, Object> metadata;
    
    private List<ItemAdjustment> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemAdjustment {
        private String inventoryItemId;
        private String sku;
        private Integer quantity;
        private BigDecimal unitPrice;
        private String fromLocation;
        private String toLocation;
        private Map<String, Object> itemMetadata;
    }
}
