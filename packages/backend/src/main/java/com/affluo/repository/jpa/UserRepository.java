package com.affluo.repository.jpa;

import com.affluo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    List<User> findByCompanyId(String companyId);
    
    List<User> findByCompanyIdAndIsActiveTrue(String companyId);
    
    @Query("SELECT u FROM User u WHERE u.companyId = :companyId AND u.role = :role")
    List<User> findByCompanyIdAndRole(@Param("companyId") String companyId, @Param("role") User.UserRole role);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}
