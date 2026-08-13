package com.cdac.noticeservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "notices")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String category;

    @Column(length = 2000)
    private String message;

    private String date;
    private String eventDate;
    private String priority; // High, Medium, Low

    public Notice() {}

    public Notice(String title, String category, String message, String date, String eventDate, String priority) {
        this.title = title;
        this.category = category;
        this.message = message;
        this.date = date;
        this.eventDate = eventDate;
        this.priority = priority;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
