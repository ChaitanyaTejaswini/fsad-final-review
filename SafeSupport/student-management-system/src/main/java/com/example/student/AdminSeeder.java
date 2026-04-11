package com.example.student;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private static final String ADMIN_ROLE = "ADMIN";

    @Value("${app.admin.name:Admin}")
    private String adminName;

    @Value("${app.admin.email:admin@example.com}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@123}")
    private String adminPassword;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String normalizedAdminEmail = adminEmail.trim().toLowerCase();

        // Auto-seed admin if not exists
        User existingAdmin = userRepository.findByEmailIgnoreCase(normalizedAdminEmail);
        if (existingAdmin == null) {
            User admin = new User();
            admin.setName(adminName);
            admin.setEmail(normalizedAdminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(ADMIN_ROLE);
            userRepository.save(admin);
            System.out.println("Admin was created.");
        } else {
            boolean requiresUpdate = false;

            if (!passwordEncoder.matches(adminPassword, existingAdmin.getPassword())) {
                existingAdmin.setPassword(passwordEncoder.encode(adminPassword));
                requiresUpdate = true;
            }
            if (!ADMIN_ROLE.equalsIgnoreCase(existingAdmin.getRole())) {
                existingAdmin.setRole(ADMIN_ROLE);
                requiresUpdate = true;
            }
            if (!adminName.equals(existingAdmin.getName())) {
                existingAdmin.setName(adminName);
                requiresUpdate = true;
            }
            if (!normalizedAdminEmail.equalsIgnoreCase(existingAdmin.getEmail())) {
                existingAdmin.setEmail(normalizedAdminEmail);
                requiresUpdate = true;
            }

            if (requiresUpdate) {
                userRepository.save(existingAdmin);
            }
            System.out.println("Admin already exists.");
        }
    }
}
