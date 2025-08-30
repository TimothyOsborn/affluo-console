package com.affluo.repository.mongo;

import com.affluo.model.InventoryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends MongoRepository<InventoryItem, String> {
    
    List<InventoryItem> findByCompanyId(String companyId);
    
    List<InventoryItem> findByCompanyIdAndStatus(String companyId, String status);
    
    @Query("{'companyId': ?0, 'currentStock': {$lte: 'minimumStock'}}")
    List<InventoryItem> findLowStockItems(String companyId);
    
    @Query("{'companyId': ?0, 'currentStock': 0}")
    List<InventoryItem> findOutOfStockItems(String companyId);
    
    Optional<InventoryItem> findByCompanyIdAndSku(String companyId, String sku);
    
    @Query("{'companyId': ?0, 'sku': {$regex: ?1, $options: 'i'}}")
    List<InventoryItem> findByCompanyIdAndSkuContainingIgnoreCase(String companyId, String sku);
    
    @Query("{'companyId': ?0, 'name': {$regex: ?1, $options: 'i'}}")
    List<InventoryItem> findByCompanyIdAndNameContainingIgnoreCase(String companyId, String name);
    
    @Query("{'companyId': ?0, 'category': ?1}")
    List<InventoryItem> findByCompanyIdAndCategory(String companyId, String category);
    
    @Query("{'companyId': ?0, 'supplier': ?1}")
    List<InventoryItem> findByCompanyIdAndSupplier(String companyId, String supplier);
    
    @Query("{'companyId': ?0, 'warehouse': ?1}")
    List<InventoryItem> findByCompanyIdAndWarehouse(String companyId, String warehouse);
    
    boolean existsByCompanyIdAndSku(String companyId, String sku);
}
