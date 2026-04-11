package com.example.student.controller;

import com.example.student.User;
import com.example.student.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Admin: Get all users
    @GetMapping
    public ResponseEntity<?> getAllUsers(@RequestAttribute("userRole") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .filter(user -> !"ADMIN".equals(user.getRole()))
                .map(this::buildUserResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // Get users by role
    @GetMapping("/role/{role}")
    public ResponseEntity<?> getUsersByRole(@PathVariable String role,
                                            @RequestAttribute("userRole") String currentRole) {
        if (!"ADMIN".equals(currentRole) && !"COUNSELLOR".equals(currentRole)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        List<Map<String, Object>> users = userRepository.findByRole(role.toUpperCase()).stream()
                .map(this::buildUserResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // Get user profile
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id,
                                     @RequestAttribute("userId") Long currentUserId,
                                     @RequestAttribute("userRole") String currentRole) {
        if (!"ADMIN".equals(currentRole) && !id.equals(currentUserId)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(buildUserResponse(user));
    }

    // Admin: Update full user details
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                        @RequestBody Map<String, String> body,
                                        @RequestAttribute("userRole") String currentRole) {
        if (!"ADMIN".equals(currentRole)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (body.get("name") != null && !body.get("name").trim().isEmpty()) {
            user.setName(body.get("name").trim());
        }

        if (body.get("email") != null) {
            String normalizedEmail = body.get("email").trim().toLowerCase();
            if (normalizedEmail.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email cannot be empty"));
            }

            User existingByEmail = userRepository.findByEmailIgnoreCase(normalizedEmail);
            if (existingByEmail != null && !existingByEmail.getId().equals(user.getId())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
            }

            user.setEmail(normalizedEmail);
        }

        if (body.get("phone") != null) {
            user.setPhone(body.get("phone").trim());
        }

        if (body.get("gender") != null) {
            user.setGender(body.get("gender").trim());
        }

        if (body.get("role") != null && !body.get("role").isBlank()) {
            user.setRole(body.get("role").toUpperCase());
        }

        userRepository.save(user);
        return ResponseEntity.ok(buildUserResponse(user));
    }

    // Admin: Update user role
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id,
                                         @RequestBody Map<String, String> body,
                                         @RequestAttribute("userRole") String currentRole) {
        if (!"ADMIN".equals(currentRole)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setRole(body.get("role").toUpperCase());
        userRepository.save(user);
        return ResponseEntity.ok(buildUserResponse(user));
    }

    // Admin: Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id,
                                         @RequestAttribute("userRole") String currentRole) {
        if (!"ADMIN".equals(currentRole)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    // Get profile
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestAttribute("userId") Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(buildUserResponse(user));
    }

    // Update profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestAttribute("userId") Long userId,
                                            @RequestAttribute("userRole") String userRole,
                                            @RequestBody Map<String, String> body) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (body.get("name") != null) user.setName(body.get("name"));
        if (body.get("gender") != null) user.setGender(body.get("gender"));

        boolean isAdmin = "ADMIN".equals(userRole);
        boolean requestsEmailChange = body.get("email") != null;
        boolean requestsPhoneChange = body.get("phone") != null;

        if (!isAdmin && (requestsEmailChange || requestsPhoneChange)) {
            return ResponseEntity.status(403).body(Map.of("message", "Only admin can change email or mobile number"));
        }

        if (isAdmin && requestsEmailChange) {
            String normalizedEmail = body.get("email").trim().toLowerCase();
            if (normalizedEmail.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email cannot be empty"));
            }

            User existingByEmail = userRepository.findByEmailIgnoreCase(normalizedEmail);
            if (existingByEmail != null && !existingByEmail.getId().equals(user.getId())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
            }

            user.setEmail(normalizedEmail);
        }

        if (isAdmin && requestsPhoneChange) {
            user.setPhone(body.get("phone").trim());
        }

        userRepository.save(user);
        return ResponseEntity.ok(buildUserResponse(user));
    }

    // Dashboard stats for admin
    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@RequestAttribute("userRole") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        int adminCount = userRepository.findByRole("ADMIN").size();
        long nonAdminUsers = Math.max(0, userRepository.count() - adminCount);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", nonAdminUsers);
        stats.put("victims", userRepository.findByRole("VICTIM").size());
        stats.put("counsellors", userRepository.findByRole("COUNSELLOR").size());
        stats.put("legalAdvisors", userRepository.findByRole("LEGAL_ADVISOR").size());
        return ResponseEntity.ok(stats);
    }

    private Map<String, Object> buildUserResponse(User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("role", user.getRole());
        userMap.put("phone", user.getPhone());
        userMap.put("gender", user.getGender());
        userMap.put("createdAt", user.getCreatedAt());
        return userMap;
    }
}
