package com.affluo.service;

import com.affluo.dto.InventoryAdjustmentRequest;
import com.affluo.model.InventoryItem;
import com.affluo.model.InventoryMovement;
import com.affluo.model.FormSubmission;
import com.affluo.repository.mongo.InventoryItemRepository;
import com.affluo.repository.mongo.InventoryMovementRepository;
import com.affluo.repository.mongo.FormSubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {
    
    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryMovementRepository inventoryMovementRepository;
    private final FormSubmissionRepository formSubmissionRepository;
    
    /**
     * Process inventory adjustments from form submissions
     */
    @Transactional
    public void processInventoryAdjustment(InventoryAdjustmentRequest request) {
        log.info("Processing inventory adjustment for submission: {}", request.getFormSubmissionId());
        
        try {
            // Validate form submission exists
            Optional<FormSubmission> submissionOpt = formSubmissionRepository.findById(request.getFormSubmissionId());
            if (submissionOpt.isEmpty()) {
                throw new IllegalArgumentException("Form submission not found: " + request.getFormSubmissionId());
            }
            
            FormSubmission submission = submissionOpt.get();
            
            // Process each item adjustment
            for (InventoryAdjustmentRequest.ItemAdjustment itemAdjustment : request.getItems()) {
                processItemAdjustment(request, itemAdjustment, submission);
            }
            
            // Update form submission status
            submission.setInventoryStatus("PROCESSED");
            submission.setProcessedAt(LocalDateTime.now());
            submission.setProcessedBy(request.getPerformedBy());
            formSubmissionRepository.save(submission);
            
            log.info("Successfully processed inventory adjustment for submission: {}", request.getFormSubmissionId());
            
        } catch (Exception e) {
            log.error("Failed to process inventory adjustment: {}", e.getMessage());
            
            // Update form submission with error status
            Optional<FormSubmission> submissionOpt = formSubmissionRepository.findById(request.getFormSubmissionId());
            if (submissionOpt.isPresent()) {
                FormSubmission submission = submissionOpt.get();
                submission.setInventoryStatus("FAILED");
                submission.setProcessingNotes("Inventory processing failed: " + e.getMessage());
                formSubmissionRepository.save(submission);
            }
            
            throw e;
        }
    }
    
    /**
     * Process individual item adjustment
     */
    private void processItemAdjustment(InventoryAdjustmentRequest request, 
                                     InventoryAdjustmentRequest.ItemAdjustment itemAdjustment,
                                     FormSubmission submission) {
        
        // Find inventory item
        Optional<InventoryItem> itemOpt = inventoryItemRepository.findById(itemAdjustment.getInventoryItemId());
        if (itemOpt.isEmpty()) {
            throw new IllegalArgumentException("Inventory item not found: " + itemAdjustment.getInventoryItemId());
        }
        
        InventoryItem item = itemOpt.get();
        
        // Validate company ownership
        if (!item.getCompanyId().equals(request.getCompanyId())) {
            throw new IllegalArgumentException("Inventory item does not belong to company");
        }
        
        // Calculate new stock level
        int stockBefore = item.getCurrentStock();
        int stockAfter = calculateNewStockLevel(stockBefore, itemAdjustment.getQuantity(), request.getAdjustmentType());
        
        // Validate stock level
        validateStockLevel(stockAfter, item);
        
        // Create inventory movement record
        InventoryMovement movement = createInventoryMovement(request, itemAdjustment, item, stockBefore, stockAfter);
        inventoryMovementRepository.save(movement);
        
        // Update inventory item
        updateInventoryItem(item, stockAfter, itemAdjustment, movement.getId());
        inventoryItemRepository.save(item);
        
        // Update form submission with adjustment details
        updateFormSubmissionWithAdjustment(submission, item, itemAdjustment, movement);
        
        log.info("Processed inventory adjustment for item {}: {} -> {} ({} {})", 
                item.getSku(), stockBefore, stockAfter, itemAdjustment.getQuantity(), request.getAdjustmentType());
    }
    
    /**
     * Calculate new stock level based on adjustment type
     */
    private int calculateNewStockLevel(int currentStock, int quantity, String adjustmentType) {
        return switch (adjustmentType.toUpperCase()) {
            case "IN" -> currentStock + quantity;
            case "OUT" -> currentStock - quantity;
            case "ADJUSTMENT" -> quantity; // Direct adjustment
            default -> throw new IllegalArgumentException("Invalid adjustment type: " + adjustmentType);
        };
    }
    
    /**
     * Validate stock level constraints
     */
    private void validateStockLevel(int newStock, InventoryItem item) {
        if (newStock < 0) {
            throw new IllegalArgumentException("Stock cannot be negative. Item: " + item.getSku());
        }
        
        if (item.getMaximumStock() != null && newStock > item.getMaximumStock()) {
            log.warn("Stock level {} exceeds maximum {} for item {}", newStock, item.getMaximumStock(), item.getSku());
        }
    }
    
    /**
     * Create inventory movement record
     */
    private InventoryMovement createInventoryMovement(InventoryAdjustmentRequest request,
                                                     InventoryAdjustmentRequest.ItemAdjustment itemAdjustment,
                                                     InventoryItem item,
                                                     int stockBefore,
                                                     int stockAfter) {
        
        InventoryMovement movement = new InventoryMovement();
        movement.setId(UUID.randomUUID().toString());
        movement.setCompanyId(request.getCompanyId());
        movement.setInventoryItemId(item.getId());
        movement.setFormId(request.getFormId());
        movement.setFormSubmissionId(request.getFormSubmissionId());
        
        movement.setMovementType(request.getAdjustmentType());
        movement.setQuantity(itemAdjustment.getQuantity());
        movement.setUnitPrice(itemAdjustment.getUnitPrice() != null ? itemAdjustment.getUnitPrice() : item.getUnitPrice());
        movement.setTotalValue(movement.getUnitPrice().multiply(BigDecimal.valueOf(itemAdjustment.getQuantity())));
        
        movement.setStockBefore(stockBefore);
        movement.setStockAfter(stockAfter);
        
        movement.setReferenceNumber(request.getReferenceNumber());
        movement.setReferenceType(request.getReason());
        movement.setNotes(request.getNotes());
        
        movement.setFromLocation(itemAdjustment.getFromLocation());
        movement.setToLocation(itemAdjustment.getToLocation());
        
        movement.setPerformedBy(request.getPerformedBy());
        movement.setPerformedAt(LocalDateTime.now());
        
        movement.setMetadata(request.getMetadata());
        movement.setCreatedBy(request.getPerformedBy());
        movement.setCreatedAt(LocalDateTime.now());
        
        movement.setMovementReason(request.getReason());
        
        return movement;
    }
    
    /**
     * Update inventory item with new stock level
     */
    private void updateInventoryItem(InventoryItem item,
                                   int newStock,
                                   InventoryAdjustmentRequest.ItemAdjustment itemAdjustment,
                                   String movementId) {
        
        item.setCurrentStock(newStock);
        item.setLastMovementDate(LocalDateTime.now());
        item.setTotalMovements(item.getTotalMovements() != null ? item.getTotalMovements() + 1 : 1);
        item.setUpdatedAt(LocalDateTime.now());
        
        // Update total value
        if (item.getUnitPrice() != null) {
            item.setTotalValue(item.getUnitPrice().multiply(BigDecimal.valueOf(newStock)));
        }
        
        // Update status based on stock level
        if (newStock == 0) {
            item.setStatus("OUT_OF_STOCK");
        } else if (newStock <= item.getMinimumStock()) {
            item.setStatus("LOW_STOCK");
        } else {
            item.setStatus("ACTIVE");
        }
    }
    
    /**
     * Update form submission with adjustment details
     */
    private void updateFormSubmissionWithAdjustment(FormSubmission submission,
                                                   InventoryItem item,
                                                   InventoryAdjustmentRequest.ItemAdjustment itemAdjustment,
                                                   InventoryMovement movement) {
        
        FormSubmission.InventoryAdjustment adjustment = new FormSubmission.InventoryAdjustment();
        adjustment.setInventoryItemId(item.getId());
        adjustment.setSku(item.getSku());
        adjustment.setItemName(item.getName());
        adjustment.setQuantity(itemAdjustment.getQuantity());
        adjustment.setAdjustmentType(movement.getMovementType());
        adjustment.setReason(movement.getMovementReason());
        adjustment.setFormData(itemAdjustment.getItemMetadata());
        adjustment.setProcessed(true);
        
        submission.getInventoryAdjustments().add(adjustment);
    }
    
    /**
     * Get inventory movements for an item
     */
    public List<InventoryMovement> getItemMovements(String companyId, String inventoryItemId) {
        return inventoryMovementRepository.findByCompanyIdAndInventoryItemIdOrderByPerformedAtDesc(companyId, inventoryItemId);
    }
    
    /**
     * Get inventory movements for a form submission
     */
    public List<InventoryMovement> getSubmissionMovements(String companyId, String formSubmissionId) {
        return inventoryMovementRepository.findByCompanyIdAndFormSubmissionId(companyId, formSubmissionId);
    }
    
    /**
     * Get low stock items
     */
    public List<InventoryItem> getLowStockItems(String companyId) {
        return inventoryItemRepository.findLowStockItems(companyId);
    }
    
    /**
     * Get out of stock items
     */
    public List<InventoryItem> getOutOfStockItems(String companyId) {
        return inventoryItemRepository.findOutOfStockItems(companyId);
    }
    
    /**
     * Get inventory movements by date range
     */
    public List<InventoryMovement> getMovementsByDateRange(String companyId, LocalDateTime startDate, LocalDateTime endDate) {
        return inventoryMovementRepository.findByCompanyIdAndPerformedAtBetween(companyId, startDate, endDate);
    }
    
    /**
     * Get inventory movements by reference number
     */
    public List<InventoryMovement> getMovementsByReference(String companyId, String referenceNumber) {
        return inventoryMovementRepository.findByCompanyIdAndReferenceNumber(companyId, referenceNumber);
    }
}
