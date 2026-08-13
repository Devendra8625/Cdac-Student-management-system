package com.cdac.placementservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "placements")
public class Placement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String role;

    @Column(name = "package_offered")
    private String packageOffered;

    private String location;
    private String eligibility;
    private String date;
    private String status; // Active, Upcoming, Completed

    public Placement() {}

    public Placement(String company, String role, String packageOffered, String location, String eligibility, String date, String status) {
        this.company = company;
        this.role = role;
        this.packageOffered = packageOffered;
        this.location = location;
        this.eligibility = eligibility;
        this.date = date;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPackageOffered() { return packageOffered; }
    public void setPackageOffered(String packageOffered) { this.packageOffered = packageOffered; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
