package com.affluo.repository.mongo;

import com.affluo.model.InventoryMovement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryMovementRepository extends MongoRepository<InventoryMovement, String> {
    
    List<InventoryMovement> findByCompanyId(String companyId);
    
    List<InventoryMovement> findByCompanyIdAndInventoryItemId(String companyId, String inventoryItemId);
    
    List<InventoryMovement> findByCompanyIdAndMovementType(String companyId, String movementType);
    
    List<InventoryMovement> findByCompanyIdAndFormId(String companyId, String formId);
    
    List<InventoryMovement> findByCompanyIdAndFormSubmissionId(String companyId, String formSubmissionId);
    
    @Query("{'companyId': ?0, 'performedAt': {$gte: ?1, $lte: ?2}}")
    List<InventoryMovement> findByCompanyIdAndPerformedAtBetween(String companyId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'companyId': ?0, 'inventoryItemId': ?1, 'performedAt': {$gte: ?2, $lte: ?3}}")
    List<InventoryMovement> findByCompanyIdAndInventoryItemIdAndPerformedAtBetween(
        String companyId, String inventoryItemId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'companyId': ?0, 'referenceNumber': ?1}")
    List<InventoryMovement> findByCompanyIdAndReferenceNumber(String companyId, String referenceNumber);
    
    @Query("{'companyId': ?0, 'performedBy': ?1}")
    List<InventoryMovement> findByCompanyIdAndPerformedBy(String companyId, String performedBy);
    
    @Query("{'companyId': ?0, 'inventoryItemId': ?1}")
    List<InventoryMovement> findByCompanyIdAndInventoryItemIdOrderByPerformedAtDesc(String companyId, String inventoryItemId);
}
