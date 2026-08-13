package com.cdac.assignmentservice.repository;

import com.cdac.assignmentservice.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
}
