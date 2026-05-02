package com.example.student.controller;

import com.example.student.model.Resource;
import com.example.student.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "https://fsad-final-review.netlify.app", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class ResourceController {

    @Autowired
    private ResourceRepository resourceRepository;

    private static final Set<String> ALLOWED_CATEGORIES = Set.of(
            "LEGAL_RIGHTS",
            "HEALTH",
            "SAFETY",
            "SUPPORT_SERVICES",
            "FINANCIAL"
    );

    // Public: Get all resources
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceRepository.findAllByOrderByCreatedAtDesc());
    }

    // Public: Get resources by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Resource>> getByCategory(@PathVariable String category) {
        String normalizedCategory = normalizeCategory(category);
        if (!isValidCategory(normalizedCategory)) {
            return ResponseEntity.badRequest().body(List.of());
        }
        return ResponseEntity.ok(resourceRepository.findByCategoryOrderByCreatedAtDesc(normalizedCategory));
    }

    // Public: Get single resource
    @GetMapping("/{id}")
    public ResponseEntity<?> getResource(@PathVariable Long id) {
        return resourceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin/Legal Advisor: Create resource
    @PostMapping
    public ResponseEntity<?> createResource(@RequestBody Resource resource,
                                            @RequestAttribute(value = "userRole", required = false) String role,
                                            @RequestAttribute(value = "userId", required = false) Long userId) {
        if (!"ADMIN".equals(role) && !"LEGAL_ADVISOR".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        String title = normalize(resource.getTitle());
        String description = normalize(resource.getDescription());
        String content = normalize(resource.getContent());
        String category = normalizeCategory(resource.getCategory());

        if (title.isBlank() || description.isBlank() || content.isBlank() || category.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Title, description, category and content are required"));
        }

        if (!isValidCategory(category)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid category"));
        }

        if (resourceRepository.existsByTitleIgnoreCase(title)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "A resource with this title already exists"));
        }

        resource.setTitle(title);
        resource.setDescription(description);
        resource.setCategory(category);
        resource.setContent(content);
        resource.setCreatedBy(userId != null ? userId.toString() : null);

        Resource saved = resourceRepository.save(resource);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Admin/Legal Advisor: Update resource
    @PutMapping("/{id}")
    public ResponseEntity<?> updateResource(@PathVariable Long id,
                                            @RequestBody Resource resource,
                                            @RequestAttribute(value = "userRole", required = false) String role) {
        if (!"ADMIN".equals(role) && !"LEGAL_ADVISOR".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        String title = normalize(resource.getTitle());
        String description = normalize(resource.getDescription());
        String content = normalize(resource.getContent());
        String category = normalizeCategory(resource.getCategory());

        if (title.isBlank() || description.isBlank() || content.isBlank() || category.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Title, description, category and content are required"));
        }

        if (!isValidCategory(category)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid category"));
        }

        if (resourceRepository.existsByTitleIgnoreCaseAndIdNot(title, id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "A resource with this title already exists"));
        }

        return resourceRepository.findById(id).map(existing -> {
            existing.setTitle(title);
            existing.setDescription(description);
            existing.setCategory(category);
            existing.setContent(content);
            return ResponseEntity.ok(resourceRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin: Delete resource
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResource(@PathVariable Long id,
                                            @RequestAttribute(value = "userRole", required = false) String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        if (!resourceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        resourceRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Resource deleted"));
    }

    private boolean isValidCategory(String category) {
        return ALLOWED_CATEGORIES.contains(category);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeCategory(String value) {
        return normalize(value).toUpperCase();
    }
}
