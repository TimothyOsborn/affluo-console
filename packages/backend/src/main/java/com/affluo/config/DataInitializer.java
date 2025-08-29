package com.affluo.config;

import com.affluo.model.Company;
import com.affluo.model.User;
import com.affluo.repository.jpa.CompanyRepository;
import com.affluo.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize sample company
        if (!companyRepository.existsByCompanyId("company1")) {
            Company company = new Company();
            company.setCompanyId("company1");
            company.setName("Sample Company");
            company.setDescription("A sample company for testing");
            company.setContactEmail("admin@samplecompany.com");
            company.setIsActive(true);
            companyRepository.save(company);
            log.info("Created sample company: {}", company.getName());
        }

        // Initialize sample admin user
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setEmail("admin@samplecompany.com");
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(User.UserRole.COMPANY_ADMIN);
            admin.setCompanyId("company1");
            admin.setIsActive(true);
            userRepository.save(admin);
            log.info("Created sample admin user: {}", admin.getUsername());
        }

        // Initialize sample team member
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("password"));
            user.setEmail("user@samplecompany.com");
            user.setFirstName("Team");
            user.setLastName("Member");
            user.setRole(User.UserRole.TEAM_MEMBER);
            user.setCompanyId("company1");
            user.setIsActive(true);
            userRepository.save(user);
            log.info("Created sample team member: {}", user.getUsername());
        }
    }
}
