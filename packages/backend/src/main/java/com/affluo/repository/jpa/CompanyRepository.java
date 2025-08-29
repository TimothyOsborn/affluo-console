package com.affluo.repository.jpa;

import com.affluo.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    
    Optional<Company> findByCompanyId(String companyId);
    
    boolean existsByCompanyId(String companyId);
}
