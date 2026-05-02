package com.example.student.controller;

import com.example.student.User;
import com.example.student.UserRepository;
import com.example.student.model.CounsellingSession;
import com.example.student.repository.CounsellingSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/counselling")
@CrossOrigin(origins = "https://fsad-final-review.netlify.app", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class CounsellingController {

    @Autowired
    private CounsellingSessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    // Get sessions based on role
    @GetMapping
    public ResponseEntity<?> getSessions(@RequestAttribute("userId") Long userId,
                                          @RequestAttribute("userRole") String role) {
        if ("ADMIN".equals(role)) {
            return ResponseEntity.ok(sessionRepository.findAll());
        } else if ("COUNSELLOR".equals(role)) {
            return ResponseEntity.ok(sessionRepository.findByCounsellorId(userId));
        } else {
            return ResponseEntity.ok(sessionRepository.findByVictimId(userId));
        }
    }

    // Counsellor: Create session
    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody CounsellingSession session,
                                            @RequestAttribute("userId") Long userId,
                                            @RequestAttribute("userRole") String role) {
        if (!"COUNSELLOR".equals(role) && !"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        if (session.getSessionDate() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Session date is required"));
        }

        LocalDateTime currentMinute = LocalDateTime.now().withSecond(0).withNano(0);
        if (session.getSessionDate().isBefore(currentMinute)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Session date/time must be current or future"));
        }

        User counsellor = userRepository.findById(userId).orElse(null);
        session.setCounsellorId(userId);
        session.setCounsellorName(counsellor != null ? counsellor.getName() : "Unknown");

        if (session.getVictimId() != null) {
            User victim = userRepository.findById(session.getVictimId()).orElse(null);
            session.setVictimName(victim != null ? victim.getName() : "Unknown");
        }

        session.setStatus("SCHEDULED");
        CounsellingSession saved = sessionRepository.save(session);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Counsellor: Update session notes and progress
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSession(@PathVariable Long id,
                                            @RequestBody CounsellingSession update,
                                            @RequestAttribute("userRole") String role) {
        if (!"COUNSELLOR".equals(role) && !"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        return sessionRepository.findById(id).map(session -> {
            if (update.getNotes() != null) session.setNotes(update.getNotes());
            if (update.getStatus() != null) session.setStatus(update.getStatus());
            if (update.getProgressScore() != null) session.setProgressScore(update.getProgressScore());
            return ResponseEntity.ok(sessionRepository.save(session));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete session
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id,
                                            @RequestAttribute("userRole") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        sessionRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Session deleted"));
    }
}
