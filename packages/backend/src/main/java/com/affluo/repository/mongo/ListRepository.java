package com.affluo.repository.mongo;

import com.affluo.model.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListRepository extends MongoRepository<List, String> {
    
    List<List> findByCompanyId(String companyId);
    
    @Query("{'companyId': ?0, 'name': {$regex: ?1, $options: 'i'}}")
    List<List> findByCompanyIdAndNameContainingIgnoreCase(String companyId, String name);
    
    boolean existsByCompanyIdAndName(String companyId, String name);
    
    @Query("{'companyId': ?0, 'name': ?1, '_id': {$ne: ?2}}")
    boolean existsByCompanyIdAndNameAndIdNot(String companyId, String name, String id);
}
