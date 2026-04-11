package com.example.student.repository;

import com.example.student.model.LegalCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LegalCaseRepository extends JpaRepository<LegalCase, Long> {
    List<LegalCase> findByVictimId(Long victimId);
    List<LegalCase> findByLegalAdvisorId(Long legalAdvisorId);
    List<LegalCase> findByStatus(String status);
}
