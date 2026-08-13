package com.cdac.courseservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    private String duration;
    private Integer modules;

    @Column(length = 2000)
    private String modulesList;

    public Course() {}

    public Course(String name, String code, String duration, Integer modules, String modulesList) {
        this.name = name;
        this.code = code;
        this.duration = duration;
        this.modules = modules;
        this.modulesList = modulesList;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Integer getModules() { return modules; }
    public void setModules(Integer modules) { this.modules = modules; }

    public String getModulesList() { return modulesList; }
    public void setModulesList(String modulesList) { this.modulesList = modulesList; }
}
