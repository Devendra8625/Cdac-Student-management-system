package com.cdac.courseservice.controller;

import com.cdac.courseservice.entity.Course;
import com.cdac.courseservice.repository.CourseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseRepository courseRepository;

    public CourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @GetMapping
    public List<Course> getAllCourses() {
        List<Course> list = courseRepository.findAll();
        if (list.isEmpty()) {
            // Seed initial 12 PGCP courses with exact modules lists
            List<Course> defaults = new ArrayList<>();
            defaults.add(new Course("PG Course in Advanced Computing", "PGCP-AC", "6 Months", 13,
                    "C Programming, Data Structures & Algorithms, OOP with Java, Web Programming, Database Technologies, .NET, Java Enterprise Technologies, Spring Boot, Microservices, React, DevOps, Aptitude, Project"));
            defaults.add(new Course("PG Course in Big Data Analytics", "PGCP-BDA", "6 Months", 11,
                    "Python, SQL, Statistics, Machine Learning, Hadoop, Spark, Kafka, Data Visualization, Deep Learning, Data Engineering, Project"));
            defaults.add(new Course("PG Course in Artificial Intelligence", "PGCP-AI", "6 Months", 10,
                    "Python, Mathematics for AI, Machine Learning, Deep Learning, NLP, Computer Vision, Generative AI, MLOps, TensorFlow/PyTorch, Project"));
            defaults.add(new Course("PG Course in Embedded Systems Design", "PGCP-ESD", "6 Months", 9,
                    "C/C++, Embedded C, ARM Programming, RTOS, Linux Device Drivers, IoT, Embedded Linux, PCB Basics, Project"));
            defaults.add(new Course("PG Course in IT Infrastructure, Systems & Security", "PGCP-ITISS", "6 Months", 9,
                    "Linux Administration, Windows Server, Networking, Virtualization, Cloud Computing, Cyber Security, Ethical Hacking, Firewalls, Project"));
            defaults.add(new Course("PG Course in VLSI Design", "PGCP-VLSI", "6 Months", 9,
                    "Digital Electronics, Verilog HDL, SystemVerilog, FPGA, CMOS Design, Physical Design, ASIC Flow, STA, Project"));
            defaults.add(new Course("PG Course in Mobile Computing", "PGCP-MC", "6 Months", 7,
                    "Java/Kotlin, Android Development, REST APIs, Flutter Basics, Firebase, Mobile Security, Project"));
            defaults.add(new Course("PG Course in Advanced Secure Software Development", "PGCP-ASSD", "6 Months", 8,
                    "Secure Coding, Java Enterprise, OWASP, DevSecOps, Cryptography, Penetration Testing, Secure API Development, Project"));
            defaults.add(new Course("PG Course in Robotics & Allied Technologies", "PGCP-RAT", "6 Months", 7,
                    "Robotics Fundamentals, ROS, Embedded Systems, AI for Robotics, Sensors & Actuators, Computer Vision, Project"));
            defaults.add(new Course("PG Course in HPC System Administration", "PGCP-HPCSA", "6 Months", 8,
                    "Linux, Cluster Computing, Networking, MPI/OpenMP, GPU Computing, HPC Administration, Storage Systems, Project"));
            defaults.add(new Course("PG Course in FinTech & Blockchain Development", "PGCP-FBD", "6 Months", 9,
                    "Java, MERN Stack, Blockchain, Solidity, Ethereum, Smart Contracts, Cryptography, Digital Payments, Project"));
            defaults.add(new Course("PG Course in Cyber Security & Forensics", "PGCP-CSF", "6 Months", 8,
                    "Ethical Hacking, Network Security, Digital Forensics, Malware Analysis, Incident Response, Cloud Security, SIEM, Project"));
            return courseRepository.saveAll(defaults);
        }
        return list;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course saved = courseRepository.save(course);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        return courseRepository.findById(id)
                .map(existing -> {
                    existing.setName(courseDetails.getName());
                    existing.setCode(courseDetails.getCode());
                    existing.setDuration(courseDetails.getDuration());
                    existing.setModules(courseDetails.getModules());
                    if (courseDetails.getModulesList() != null) {
                        existing.setModulesList(courseDetails.getModulesList());
                    }
                    return ResponseEntity.ok(courseRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(course -> {
                    courseRepository.delete(course);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
