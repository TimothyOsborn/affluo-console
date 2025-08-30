package com.affluo.service;

import com.affluo.model.Form;
import com.affluo.model.FormSubmission;
import com.affluo.model.InventoryItem;
import com.affluo.dto.InventoryAdjustmentRequest;
import com.affluo.repository.mongo.FormRepository;
import com.affluo.repository.mongo.InventoryItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FormSubmissionProcessor {
    
    private final InventoryService inventoryService;
    private final FormRepository formRepository;
    private final InventoryItemRepository inventoryItemRepository;
    
    /**
     * Process a form submission and automatically detect inventory adjustments
     */
    public void processFormSubmission(FormSubmission submission) {
        log.info("Processing form submission: {}", submission.getId());
        
        try {
            // Get the form to understand its structure
            Optional<Form> formOpt = formRepository.findById(submission.getFormId());
            if (formOpt.isEmpty()) {
                log.error("Form not found for submission: {}", submission.getId());
                return;
            }
            
            Form form = formOpt.get();
            
            // Check if this form affects inventory
            if (!isInventoryForm(form)) {
                log.info("Form {} does not affect inventory, skipping processing", form.getId());
                return;
            }
            
            // Determine adjustment type based on form type
            String adjustmentType = determineAdjustmentType(form, submission);
            
            // Extract inventory adjustments from form data
            List<InventoryAdjustmentRequest.ItemAdjustment> adjustments = extractInventoryAdjustments(form, submission);
            
            if (adjustments.isEmpty()) {
                log.info("No inventory adjustments found in submission: {}", submission.getId());
                return;
            }
            
            // Create and process inventory adjustment request
            InventoryAdjustmentRequest request = createInventoryAdjustmentRequest(submission, adjustmentType, adjustments);
            inventoryService.processInventoryAdjustment(request);
            
            log.info("Successfully processed inventory adjustments for submission: {}", submission.getId());
            
        } catch (Exception e) {
            log.error("Failed to process form submission {}: {}", submission.getId(), e.getMessage());
            throw e;
        }
    }
    
    /**
     * Check if a form affects inventory
     */
    private boolean isInventoryForm(Form form) {
        // Check form name/keywords for inventory-related forms
        String formName = form.getName().toLowerCase();
        return formName.contains("inventory") || 
               formName.contains("stock") || 
               formName.contains("purchase") || 
               formName.contains("sale") ||
               formName.contains("receiving") ||
               formName.contains("shipping");
    }
    
    /**
     * Determine adjustment type based on form type and data
     */
    private String determineAdjustmentType(Form form, FormSubmission submission) {
        String formName = form.getName().toLowerCase();
        Map<String, Object> data = submission.getData();
        
        // Check form name for keywords
        if (formName.contains("purchase") || formName.contains("receiving") || formName.contains("in")) {
            return "IN";
        } else if (formName.contains("sale") || formName.contains("shipping") || formName.contains("out")) {
            return "OUT";
        }
        
        // Check form data for specific fields
        if (data.containsKey("adjustment_type")) {
            return data.get("adjustment_type").toString().toUpperCase();
        }
        
        if (data.containsKey("movement_type")) {
            return data.get("movement_type").toString().toUpperCase();
        }
        
        // Default based on form name
        return formName.contains("sale") ? "OUT" : "IN";
    }
    
    /**
     * Extract inventory adjustments from form submission data
     */
    private List<InventoryAdjustmentRequest.ItemAdjustment> extractInventoryAdjustments(Form form, FormSubmission submission) {
        List<InventoryAdjustmentRequest.ItemAdjustment> adjustments = new ArrayList<>();
        Map<String, Object> data = submission.getData();
        
        // Look for common inventory field patterns
        for (Form.FormField field : form.getFields()) {
            String fieldId = field.getId();
            String fieldName = field.getLabel().toLowerCase();
            
            // Check if this field contains inventory item selection
            if (isInventoryItemField(field, fieldName)) {
                Object itemValue = data.get(fieldId);
                if (itemValue != null) {
                    // Find the corresponding quantity field
                    Integer quantity = findQuantityForItem(form, data, fieldId);
                    if (quantity != null && quantity > 0) {
                        InventoryAdjustmentRequest.ItemAdjustment adjustment = createItemAdjustment(itemValue.toString(), quantity, data);
                        if (adjustment != null) {
                            adjustments.add(adjustment);
                        }
                    }
                }
            }
        }
        
        // Also check for array-based inventory items (multiple items in one submission)
        if (data.containsKey("items") && data.get("items") instanceof List) {
            List<Map<String, Object>> items = (List<Map<String, Object>>) data.get("items");
            for (Map<String, Object> item : items) {
                if (item.containsKey("sku") && item.containsKey("quantity")) {
                    String sku = item.get("sku").toString();
                    Integer quantity = Integer.parseInt(item.get("quantity").toString());
                    if (quantity > 0) {
                        InventoryAdjustmentRequest.ItemAdjustment adjustment = createItemAdjustmentFromSku(sku, quantity, item);
                        if (adjustment != null) {
                            adjustments.add(adjustment);
                        }
                    }
                }
            }
        }
        
        return adjustments;
    }
    
    /**
     * Check if a field represents an inventory item selection
     */
    private boolean isInventoryItemField(Form.FormField field, String fieldName) {
        return fieldName.contains("product") || 
               fieldName.contains("item") || 
               fieldName.contains("sku") ||
               fieldName.contains("inventory") ||
               (field.getDataSource() != null && "list".equals(field.getDataSource().getType()));
    }
    
    /**
     * Find quantity field for a given item field
     */
    private Integer findQuantityForItem(Form form, Map<String, Object> data, String itemFieldId) {
        // Look for quantity field with similar naming pattern
        String quantityFieldId = itemFieldId.replace("item", "quantity")
                                          .replace("product", "quantity")
                                          .replace("sku", "quantity");
        
        if (data.containsKey(quantityFieldId)) {
            Object value = data.get(quantityFieldId);
            return parseQuantity(value);
        }
        
        // Look for any field containing "quantity" in the name
        for (Form.FormField field : form.getFields()) {
            if (field.getLabel().toLowerCase().contains("quantity")) {
                Object value = data.get(field.getId());
                Integer quantity = parseQuantity(value);
                if (quantity != null) {
                    return quantity;
                }
            }
        }
        
        return null;
    }
    
    /**
     * Parse quantity value from form data
     */
    private Integer parseQuantity(Object value) {
        if (value == null) return null;
        
        try {
            if (value instanceof Number) {
                return ((Number) value).intValue();
            } else {
                return Integer.parseInt(value.toString());
            }
        } catch (NumberFormatException e) {
            log.warn("Could not parse quantity value: {}", value);
            return null;
        }
    }
    
    /**
     * Create item adjustment from inventory item ID or SKU
     */
    private InventoryAdjustmentRequest.ItemAdjustment createItemAdjustment(String itemIdentifier, Integer quantity, Map<String, Object> data) {
        // Try to find inventory item by ID first, then by SKU
        Optional<InventoryItem> itemOpt = inventoryItemRepository.findById(itemIdentifier);
        
        if (itemOpt.isEmpty()) {
            // Try to find by SKU
            itemOpt = inventoryItemRepository.findByCompanyIdAndSku(submission.getCompanyId(), itemIdentifier);
        }
        
        if (itemOpt.isEmpty()) {
            log.warn("Inventory item not found for identifier: {}", itemIdentifier);
            return null;
        }
        
        InventoryItem item = itemOpt.get();
        
        InventoryAdjustmentRequest.ItemAdjustment adjustment = new InventoryAdjustmentRequest.ItemAdjustment();
        adjustment.setInventoryItemId(item.getId());
        adjustment.setSku(item.getSku());
        adjustment.setQuantity(quantity);
        adjustment.setUnitPrice(item.getUnitPrice());
        adjustment.setItemMetadata(data);
        
        return adjustment;
    }
    
    /**
     * Create item adjustment from SKU
     */
    private InventoryAdjustmentRequest.ItemAdjustment createItemAdjustmentFromSku(String sku, Integer quantity, Map<String, Object> itemData) {
        Optional<InventoryItem> itemOpt = inventoryItemRepository.findByCompanyIdAndSku(submission.getCompanyId(), sku);
        
        if (itemOpt.isEmpty()) {
            log.warn("Inventory item not found for SKU: {}", sku);
            return null;
        }
        
        InventoryItem item = itemOpt.get();
        
        InventoryAdjustmentRequest.ItemAdjustment adjustment = new InventoryAdjustmentRequest.ItemAdjustment();
        adjustment.setInventoryItemId(item.getId());
        adjustment.setSku(item.getSku());
        adjustment.setQuantity(quantity);
        adjustment.setUnitPrice(item.getUnitPrice());
        adjustment.setItemMetadata(itemData);
        
        return adjustment;
    }
    
    /**
     * Create inventory adjustment request
     */
    private InventoryAdjustmentRequest createInventoryAdjustmentRequest(FormSubmission submission, 
                                                                       String adjustmentType,
                                                                       List<InventoryAdjustmentRequest.ItemAdjustment> adjustments) {
        
        InventoryAdjustmentRequest request = new InventoryAdjustmentRequest();
        request.setFormSubmissionId(submission.getId());
        request.setFormId(submission.getFormId());
        request.setCompanyId(submission.getCompanyId());
        request.setPerformedBy(submission.getSubmittedBy());
        request.setAdjustmentType(adjustmentType);
        request.setReason(determineReason(adjustmentType, submission));
        request.setReferenceNumber(generateReferenceNumber(submission));
        request.setNotes("Auto-processed from form submission");
        request.setMetadata(submission.getData());
        request.setItems(adjustments);
        
        return request;
    }
    
    /**
     * Determine reason for adjustment
     */
    private String determineReason(String adjustmentType, FormSubmission submission) {
        String formName = submission.getFormId(); // You might want to get the actual form name
        
        if ("IN".equals(adjustmentType)) {
            return "PURCHASE_RECEIVING";
        } else if ("OUT".equals(adjustmentType)) {
            return "SALE_SHIPPING";
        } else {
            return "ADJUSTMENT";
        }
    }
    
    /**
     * Generate reference number for the adjustment
     */
    private String generateReferenceNumber(FormSubmission submission) {
        return "FS-" + submission.getId().substring(0, 8).toUpperCase();
    }
}
