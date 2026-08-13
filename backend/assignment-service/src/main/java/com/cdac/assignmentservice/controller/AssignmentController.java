package com.cdac.assignmentservice.controller;

import com.cdac.assignmentservice.entity.Assignment;
import com.cdac.assignmentservice.repository.AssignmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentRepository assignmentRepository;

    public AssignmentController(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    @GetMapping
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) {
        if (assignment.getStatus() == null) {
            assignment.setStatus("Pending");
        }
        Assignment saved = assignmentRepository.save(assignment);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable Long id, @RequestBody Assignment details) {
        return assignmentRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(details.getTitle());
                    existing.setSubject(details.getSubject());
                    existing.setDueDate(details.getDueDate());
                    existing.setDescription(details.getDescription());
                    existing.setStatus(details.getStatus());
                    return ResponseEntity.ok(assignmentRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        return assignmentRepository.findById(id)
                .map(assignment -> {
                    assignmentRepository.delete(assignment);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
