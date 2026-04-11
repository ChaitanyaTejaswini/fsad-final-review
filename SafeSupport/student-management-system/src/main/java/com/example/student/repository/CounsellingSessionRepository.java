package com.example.student.repository;

import com.example.student.model.CounsellingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CounsellingSessionRepository extends JpaRepository<CounsellingSession, Long> {
    List<CounsellingSession> findByCounsellorId(Long counsellorId);
    List<CounsellingSession> findByVictimId(Long victimId);
}
