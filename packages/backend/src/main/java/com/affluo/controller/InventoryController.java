package com.affluo.controller;

import com.affluo.dto.InventoryAdjustmentRequest;
import com.affluo.model.InventoryItem;
import com.affluo.model.InventoryMovement;
import com.affluo.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/companies/{companyId}/inventory")
@RequiredArgsConstructor
@Slf4j
public class InventoryController {
    
    private final InventoryService inventoryService;
    
    // Inventory Items
    
    @GetMapping("/items")
    public ResponseEntity<List<InventoryItem>> getInventoryItems(@PathVariable String companyId) {
        log.info("GET /api/companies/{}/inventory/items", companyId);
        List<InventoryItem> items = inventoryService.getInventoryItems(companyId);
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/items/low-stock")
    public ResponseEntity<List<InventoryItem>> getLowStockItems(@PathVariable String companyId) {
        log.info("GET /api/companies/{}/inventory/items/low-stock", companyId);
        List<InventoryItem> items = inventoryService.getLowStockItems(companyId);
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/items/out-of-stock")
    public ResponseEntity<List<InventoryItem>> getOutOfStockItems(@PathVariable String companyId) {
        log.info("GET /api/companies/{}/inventory/items/out-of-stock", companyId);
        List<InventoryItem> items = inventoryService.getOutOfStockItems(companyId);
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/items/{itemId}")
    public ResponseEntity<InventoryItem> getInventoryItem(@PathVariable String companyId, @PathVariable String itemId) {
        log.info("GET /api/companies/{}/inventory/items/{}", companyId, itemId);
        return inventoryService.getInventoryItem(companyId, itemId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Inventory Movements
    
    @GetMapping("/movements")
    public ResponseEntity<List<InventoryMovement>> getInventoryMovements(
            @PathVariable String companyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String movementType,
            @RequestParam(required = false) String referenceNumber) {
        
        log.info("GET /api/companies/{}/inventory/movements", companyId);
        
        if (startDate != null && endDate != null) {
            List<InventoryMovement> movements = inventoryService.getMovementsByDateRange(companyId, startDate, endDate);
            return ResponseEntity.ok(movements);
        } else if (referenceNumber != null) {
            List<InventoryMovement> movements = inventoryService.getMovementsByReference(companyId, referenceNumber);
            return ResponseEntity.ok(movements);
        } else if (movementType != null) {
            List<InventoryMovement> movements = inventoryService.getMovementsByType(companyId, movementType);
            return ResponseEntity.ok(movements);
        } else {
            List<InventoryMovement> movements = inventoryService.getAllMovements(companyId);
            return ResponseEntity.ok(movements);
        }
    }
    
    @GetMapping("/items/{itemId}/movements")
    public ResponseEntity<List<InventoryMovement>> getItemMovements(@PathVariable String companyId, @PathVariable String itemId) {
        log.info("GET /api/companies/{}/inventory/items/{}/movements", companyId, itemId);
        List<InventoryMovement> movements = inventoryService.getItemMovements(companyId, itemId);
        return ResponseEntity.ok(movements);
    }
    
    @GetMapping("/submissions/{submissionId}/movements")
    public ResponseEntity<List<InventoryMovement>> getSubmissionMovements(@PathVariable String companyId, @PathVariable String submissionId) {
        log.info("GET /api/companies/{}/inventory/submissions/{}/movements", companyId, submissionId);
        List<InventoryMovement> movements = inventoryService.getSubmissionMovements(companyId, submissionId);
        return ResponseEntity.ok(movements);
    }
    
    // Manual Inventory Adjustments
    
    @PostMapping("/adjustments")
    public ResponseEntity<Void> processInventoryAdjustment(@PathVariable String companyId, @RequestBody InventoryAdjustmentRequest request) {
        log.info("POST /api/companies/{}/inventory/adjustments", companyId);
        
        // Ensure the request is for the correct company
        request.setCompanyId(companyId);
        
        try {
            inventoryService.processInventoryAdjustment(request);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            log.error("Invalid inventory adjustment request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Failed to process inventory adjustment: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Inventory Reports
    
    @GetMapping("/reports/stock-summary")
    public ResponseEntity<Map<String, Object>> getStockSummary(@PathVariable String companyId) {
        log.info("GET /api/companies/{}/inventory/reports/stock-summary", companyId);
        Map<String, Object> summary = inventoryService.getStockSummary(companyId);
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/reports/movement-summary")
    public ResponseEntity<Map<String, Object>> getMovementSummary(
            @PathVariable String companyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        log.info("GET /api/companies/{}/inventory/reports/movement-summary", companyId);
        Map<String, Object> summary = inventoryService.getMovementSummary(companyId, startDate, endDate);
        return ResponseEntity.ok(summary);
    }
}
