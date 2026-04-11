package com.example.student.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "counselling_sessions")
public class CounsellingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "counsellor_id", nullable = false)
    private Long counsellorId;

    @Column(name = "victim_id", nullable = false)
    private Long victimId;

    @Column(name = "victim_name")
    private String victimName;

    @Column(name = "counsellor_name")
    private String counsellorName;

    @Column(name = "session_date")
    private LocalDateTime sessionDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    private String status = "SCHEDULED";

    @Column(name = "progress_score")
    private Integer progressScore;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCounsellorId() { return counsellorId; }
    public void setCounsellorId(Long counsellorId) { this.counsellorId = counsellorId; }

    public Long getVictimId() { return victimId; }
    public void setVictimId(Long victimId) { this.victimId = victimId; }

    public String getVictimName() { return victimName; }
    public void setVictimName(String victimName) { this.victimName = victimName; }

    public String getCounsellorName() { return counsellorName; }
    public void setCounsellorName(String counsellorName) { this.counsellorName = counsellorName; }

    public LocalDateTime getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDateTime sessionDate) { this.sessionDate = sessionDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getProgressScore() { return progressScore; }
    public void setProgressScore(Integer progressScore) { this.progressScore = progressScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
