package com.affluo.repository.mongo;

import com.affluo.model.Form;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormRepository extends MongoRepository<Form, String> {
    
    List<Form> findByCompanyId(String companyId);
    
    List<Form> findByCompanyIdAndStatus(String companyId, String status);
    
    Optional<Form> findByIdAndCompanyId(String id, String companyId);
    
    @Query("{'companyId': ?0, 'status': {$in: ['PUBLISHED', 'DRAFT']}}")
    List<Form> findActiveFormsByCompanyId(String companyId);
    
    boolean existsByIdAndCompanyId(String id, String companyId);
}
