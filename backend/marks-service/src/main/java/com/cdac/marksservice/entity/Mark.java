package com.cdac.marksservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "marks")
public class Mark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentId;

    private String studentName;

    @Column(nullable = false)
    private String subject;

    private Integer score;
    private Integer maxScore;
    private String examDate;

    public Mark() {}

    public Mark(String studentId, String studentName, String subject, Integer score, Integer maxScore, String examDate) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.subject = subject;
        this.score = score;
        this.maxScore = maxScore;
        this.examDate = examDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getMaxScore() { return maxScore; }
    public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }

    public String getExamDate() { return examDate; }
    public void setExamDate(String examDate) { this.examDate = examDate; }
}
