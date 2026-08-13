package com.cdac.marksservice.repository;

import com.cdac.marksservice.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MarkRepository extends JpaRepository<Mark, Long> {
    List<Mark> findByStudentId(String studentId);
}
