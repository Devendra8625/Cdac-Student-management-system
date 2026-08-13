package com.cdac.studentservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String course;

    @Column(nullable = false, unique = true)
    private String rollNo;

    private String prnNo;
    private String phone;
    private String address;
    private String batch;

    public Student() {}

    public Student(String name, String email, String course, String rollNo, String prnNo, String phone, String address, String batch) {
        this.name = name;
        this.email = email;
        this.course = course;
        this.rollNo = rollNo;
        this.prnNo = prnNo;
        this.phone = phone;
        this.address = address;
        this.batch = batch;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }

    public String getPrnNo() { return prnNo; }
    public void setPrnNo(String prnNo) { this.prnNo = prnNo; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }
}
