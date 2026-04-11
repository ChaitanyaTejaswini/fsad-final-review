package com.example.student.repository;

import com.example.student.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByCategoryOrderByCreatedAtDesc(String category);
    List<Resource> findAllByOrderByCreatedAtDesc();
    List<Resource> findByCreatedBy(String createdBy);
    boolean existsByTitleIgnoreCase(String title);
    boolean existsByTitleIgnoreCaseAndIdNot(String title, Long id);
}
