package com.affluo.repository.mongo;

import com.affluo.model.FormSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormSubmissionRepository extends MongoRepository<FormSubmission, String> {
    
    List<FormSubmission> findByCompanyId(String companyId);
    
    List<FormSubmission> findByFormId(String formId);
    
    List<FormSubmission> findByCompanyIdAndFormId(String companyId, String formId);
    
    List<FormSubmission> findByCompanyIdAndStatus(String companyId, String status);
    
    Optional<FormSubmission> findByIdAndCompanyId(String id, String companyId);
    
    @Query("{'companyId': ?0, 'submittedAt': {$gte: ?1}}")
    List<FormSubmission> findRecentSubmissionsByCompanyId(String companyId, java.time.LocalDateTime since);
    
    long countByCompanyId(String companyId);
    
    long countByFormId(String formId);
}
