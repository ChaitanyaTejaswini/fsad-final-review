package com.example.student.controller;

import com.example.student.User;
import com.example.student.UserRepository;
import com.example.student.model.LegalCase;
import com.example.student.repository.LegalCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/legal-cases")
@CrossOrigin(origins = "https://fsad-final-review.netlify.app", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class LegalCaseController {

    @Autowired
    private LegalCaseRepository legalCaseRepository;

    @Autowired
    private UserRepository userRepository;

    // Get cases based on role
    @GetMapping
    public ResponseEntity<?> getCases(@RequestAttribute("userId") Long userId,
                                       @RequestAttribute("userRole") String role) {
        if ("ADMIN".equals(role)) {
            return ResponseEntity.ok(legalCaseRepository.findAll());
        } else if ("LEGAL_ADVISOR".equals(role)) {
            return ResponseEntity.ok(legalCaseRepository.findByLegalAdvisorId(userId));
        } else {
            return ResponseEntity.ok(legalCaseRepository.findByVictimId(userId));
        }
    }

    // Victim: Create legal case request
    @PostMapping
    public ResponseEntity<?> createCase(@RequestBody LegalCase legalCase,
                                         @RequestAttribute("userId") Long userId,
                                         @RequestAttribute("userRole") String role) {
        if (!"VICTIM".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Only survivors can create legal cases"));
        }

        User user = userRepository.findById(userId).orElse(null);
        legalCase.setVictimId(userId);
        legalCase.setVictimName(user != null ? user.getName() : "Unknown");
        legalCase.setStatus("OPEN");
        legalCase.setFiledDate(LocalDateTime.now());
        LegalCase saved = legalCaseRepository.save(legalCase);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Admin: Assign legal advisor
    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignAdvisor(@PathVariable Long id,
                                            @RequestBody Map<String, Long> body,
                                            @RequestAttribute("userRole") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        return legalCaseRepository.findById(id).map(legalCase -> {
            Long advisorId = body.get("advisorId");
            legalCase.setLegalAdvisorId(advisorId);
            User advisor = userRepository.findById(advisorId).orElse(null);
            legalCase.setAdvisorName(advisor != null ? advisor.getName() : "Unknown");
            legalCase.setStatus("ASSIGNED");
            return ResponseEntity.ok(legalCaseRepository.save(legalCase));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Legal Advisor: Update case with advice
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCase(@PathVariable Long id,
                                         @RequestBody LegalCase update,
                                         @RequestAttribute("userRole") String role) {
        if (!"LEGAL_ADVISOR".equals(role) && !"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        return legalCaseRepository.findById(id).map(legalCase -> {
            if (update.getLegalAdvice() != null) legalCase.setLegalAdvice(update.getLegalAdvice());
            if (update.getStatus() != null) legalCase.setStatus(update.getStatus());
            if (update.getDescription() != null) legalCase.setDescription(update.getDescription());
            return ResponseEntity.ok(legalCaseRepository.save(legalCase));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin: Delete case
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCase(@PathVariable Long id,
                                         @RequestAttribute("userRole") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        legalCaseRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Legal case deleted"));
    }
}
