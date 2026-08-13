package com.cdac.marksservice.controller;

import com.cdac.marksservice.entity.Mark;
import com.cdac.marksservice.repository.MarkRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarksController {

    private final MarkRepository markRepository;

    public MarksController(MarkRepository markRepository) {
        this.markRepository = markRepository;
    }

    @GetMapping
    public List<Mark> getAllMarks() {
        return markRepository.findAll();
    }

    @GetMapping("/student/{studentId}")
    public List<Mark> getMarksByStudent(@PathVariable String studentId) {
        return markRepository.findByStudentId(studentId);
    }

    @PostMapping
    public ResponseEntity<Mark> addMark(@RequestBody Mark mark) {
        Mark saved = markRepository.save(mark);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mark> updateMark(@PathVariable Long id, @RequestBody Mark markDetails) {
        return markRepository.findById(id)
                .map(existing -> {
                    existing.setStudentId(markDetails.getStudentId());
                    existing.setStudentName(markDetails.getStudentName());
                    existing.setSubject(markDetails.getSubject());
                    existing.setScore(markDetails.getScore());
                    existing.setMaxScore(markDetails.getMaxScore());
                    existing.setExamDate(markDetails.getExamDate());
                    return ResponseEntity.ok(markRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMark(@PathVariable Long id) {
        return markRepository.findById(id)
                .map(mark -> {
                    markRepository.delete(mark);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
