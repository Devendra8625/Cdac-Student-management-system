package com.cdac.attendanceservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String date;

    @Column(nullable = false)
    private String subject;

    private Integer totalStudents;
    private Integer presentCount;
    private String status;

    public Attendance() {}

    public Attendance(String date, String subject, Integer totalStudents, Integer presentCount, String status) {
        this.date = date;
        this.subject = subject;
        this.totalStudents = totalStudents;
        this.presentCount = presentCount;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Integer getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Integer totalStudents) { this.totalStudents = totalStudents; }

    public Integer getPresentCount() { return presentCount; }
    public void setPresentCount(Integer presentCount) { this.presentCount = presentCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
