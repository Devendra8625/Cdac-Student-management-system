package com.cdac.feedbackservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    private String faculty;
    private Integer rating;

    @Column(length = 2000)
    private String comments;

    private String date;

    @Column(length = 2000)
    private String response;

    public Feedback() {}

    public Feedback(String subject, String faculty, Integer rating, String comments, String date, String response) {
        this.subject = subject;
        this.faculty = faculty;
        this.rating = rating;
        this.comments = comments;
        this.date = date;
        this.response = response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
}
