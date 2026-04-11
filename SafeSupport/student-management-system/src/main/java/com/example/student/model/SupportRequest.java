package com.example.student.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_requests")
public class SupportRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "victim_id", nullable = false)
    private Long victimId;

    @Column(name = "victim_name")
    private String victimName;

    @Transient
    private Long assignedCounsellorId;

    @Column(name = "assigned_counsellor_name")
    private String assignedCounsellorName;

    @Column(name = "assigned_counsellor_email")
    private String assignedCounsellorEmail;

    @Column(nullable = false)
    private String type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(nullable = false)
    private String priority = "MEDIUM";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getVictimId() { return victimId; }
    public void setVictimId(Long victimId) { this.victimId = victimId; }

    public String getVictimName() { return victimName; }
    public void setVictimName(String victimName) { this.victimName = victimName; }

    public Long getAssignedCounsellorId() { return assignedCounsellorId; }
    public void setAssignedCounsellorId(Long assignedCounsellorId) { this.assignedCounsellorId = assignedCounsellorId; }

    public String getAssignedCounsellorName() { return assignedCounsellorName; }
    public void setAssignedCounsellorName(String assignedCounsellorName) { this.assignedCounsellorName = assignedCounsellorName; }

    public String getAssignedCounsellorEmail() { return assignedCounsellorEmail; }
    public void setAssignedCounsellorEmail(String assignedCounsellorEmail) { this.assignedCounsellorEmail = assignedCounsellorEmail; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
