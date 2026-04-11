package com.example.student.repository;

import com.example.student.model.SupportRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportRequestRepository extends JpaRepository<SupportRequest, Long> {
    List<SupportRequest> findByVictimId(Long victimId);
    List<SupportRequest> findByAssignedCounsellorEmailIgnoreCase(String counsellorEmail);
    List<SupportRequest> findByStatus(String status);
}
