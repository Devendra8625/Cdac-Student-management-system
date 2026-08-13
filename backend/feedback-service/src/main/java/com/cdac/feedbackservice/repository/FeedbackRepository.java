package com.cdac.feedbackservice.repository;

import com.cdac.feedbackservice.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}
