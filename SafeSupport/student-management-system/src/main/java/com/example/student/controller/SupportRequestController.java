package com.example.student.controller;

import com.example.student.User;
import com.example.student.UserRepository;
import com.example.student.model.SupportRequest;
import com.example.student.repository.SupportRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support-requests")
public class SupportRequestController {

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    @Autowired
    private UserRepository userRepository;

    // Admin: Get all support requests
    @GetMapping
    public ResponseEntity<?> getAll(@RequestAttribute("userId") Long userId,
                                     @RequestAttribute("userRole") String role) {
        List<SupportRequest> requests;

        if ("ADMIN".equals(role)) {
            requests = supportRequestRepository.findAll();
        } else if ("COUNSELLOR".equals(role)) {
            User counsellor = userRepository.findById(userId).orElse(null);
            if (counsellor == null || counsellor.getEmail() == null || counsellor.getEmail().isBlank()) {
                requests = List.of();
            } else {
                requests = supportRequestRepository.findByAssignedCounsellorEmailIgnoreCase(counsellor.getEmail());
            }
        } else {
            requests = supportRequestRepository.findByVictimId(userId);
        }

        return ResponseEntity.ok(requests);
    }

    // Victim: Create support request
    @PostMapping
    public ResponseEntity<?> create(@RequestBody SupportRequest request,
                                     @RequestAttribute("userId") Long userId,
                                     @RequestAttribute("userRole") String role) {
        if (!"VICTIM".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Only survivors can create support requests"));
        }

        User user = userRepository.findById(userId).orElse(null);
        request.setVictimId(userId);
        request.setVictimName(user != null ? user.getName() : "Unknown");
        request.setStatus("PENDING");
        SupportRequest saved = supportRequestRepository.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Admin: Assign counsellor to request
    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignCounsellor(@PathVariable Long id,
                                               @RequestBody Map<String, Long> body,
                                               @RequestAttribute("userRole") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        Long counsellorId = body.get("counsellorId");
        if (counsellorId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "counsellorId is required"));
        }

        User counsellor = userRepository.findById(counsellorId).orElse(null);
        if (counsellor == null || counsellor.getRole() == null || !"COUNSELLOR".equalsIgnoreCase(counsellor.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Selected user is not a counsellor"));
        }

        return supportRequestRepository.findById(id).map(request -> {
            String currentStatus = request.getStatus() != null ? request.getStatus().toUpperCase() : "PENDING";
            if ("COMPLETED".equals(currentStatus)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Completed request cannot be reassigned"));
            }

            request.setAssignedCounsellorName(counsellor.getName());
            request.setAssignedCounsellorEmail(counsellor.getEmail());
            request.setAssignedCounsellorId(counsellorId);
            if ("PENDING".equals(currentStatus)) {
                request.setStatus("ASSIGNED");
            }

            SupportRequest savedRequest = supportRequestRepository.save(request);
            return ResponseEntity.ok(savedRequest);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Counsellor: Update request status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                           @RequestBody Map<String, String> body,
                                           @RequestAttribute("userRole") String role) {
        if (!"COUNSELLOR".equals(role) && !"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        String requestedStatus = body.get("status");
        if (requestedStatus == null || requestedStatus.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status is required"));
        }

        final String nextStatus = requestedStatus.toUpperCase();
        if (!Set.of("IN_PROGRESS", "COMPLETED").contains(nextStatus)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Only IN_PROGRESS or COMPLETED are allowed"));
        }

        return supportRequestRepository.findById(id).map(request -> {
            String currentStatus = request.getStatus() != null ? request.getStatus().toUpperCase() : "PENDING";

            if ("COMPLETED".equals(currentStatus)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Completed request cannot be changed"));
            }

            if ("COMPLETED".equals(nextStatus) && !"IN_PROGRESS".equals(currentStatus)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Move request to IN_PROGRESS first"));
            }

            request.setStatus(nextStatus);
            SupportRequest savedRequest = supportRequestRepository.save(request);
            return ResponseEntity.ok(savedRequest);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete support request
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                     @RequestAttribute("userRole") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        supportRequestRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Support request deleted"));
    }
}
