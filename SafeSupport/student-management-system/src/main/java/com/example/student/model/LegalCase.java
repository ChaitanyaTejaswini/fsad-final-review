package com.example.student.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "legal_cases")
public class LegalCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "victim_id", nullable = false)
    private Long victimId;

    @Column(name = "victim_name")
    private String victimName;

    @Column(name = "legal_advisor_id")
    private Long legalAdvisorId;

    @Column(name = "advisor_name")
    private String advisorName;

    @Column(name = "case_type", nullable = false)
    private String caseType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String status = "OPEN";

    @Column(name = "legal_advice", columnDefinition = "LONGTEXT")
    private String legalAdvice;

    @Column(name = "filed_date")
    private LocalDateTime filedDate;

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

    public Long getLegalAdvisorId() { return legalAdvisorId; }
    public void setLegalAdvisorId(Long legalAdvisorId) { this.legalAdvisorId = legalAdvisorId; }

    public String getAdvisorName() { return advisorName; }
    public void setAdvisorName(String advisorName) { this.advisorName = advisorName; }

    public String getCaseType() { return caseType; }
    public void setCaseType(String caseType) { this.caseType = caseType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLegalAdvice() { return legalAdvice; }
    public void setLegalAdvice(String legalAdvice) { this.legalAdvice = legalAdvice; }

    public LocalDateTime getFiledDate() { return filedDate; }
    public void setFiledDate(LocalDateTime filedDate) { this.filedDate = filedDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
