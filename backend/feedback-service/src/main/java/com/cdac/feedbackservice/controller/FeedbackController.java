package com.cdac.feedbackservice.controller;

import com.cdac.feedbackservice.entity.Feedback;
import com.cdac.feedbackservice.repository.FeedbackRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;

    public FeedbackController(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @GetMapping
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Feedback> addFeedback(@RequestBody Feedback feedback) {
        if (feedback.getDate() == null) {
            feedback.setDate(LocalDate.now().toString());
        }
        Feedback saved = feedbackRepository.save(feedback);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/response")
    public ResponseEntity<Feedback> respondFeedback(@PathVariable Long id, @RequestBody String responseText) {
        return feedbackRepository.findById(id)
                .map(existing -> {
                    existing.setResponse(responseText);
                    return ResponseEntity.ok(feedbackRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        return feedbackRepository.findById(id)
                .map(feedback -> {
                    feedbackRepository.delete(feedback);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
