package com.cdac.studentservice.controller;

import com.cdac.studentservice.entity.Student;
import com.cdac.studentservice.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return studentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        return studentRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    // Auto-create initial profile for registered user if missing
                    Student newStudent = new Student();
                    newStudent.setName(email.split("@")[0]);
                    newStudent.setEmail(email);
                    newStudent.setCourse("DAC");
                    newStudent.setRollNo("DAC-2026-" + String.format("%03d", (int)(Math.random() * 900) + 100));
                    newStudent.setBatch("Feb 2026");
                    Student saved = studentRepository.save(newStudent);
                    return ResponseEntity.ok(saved);
                });
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        if (student.getEmail() != null && !student.getEmail().trim().isEmpty()) {
            var existing = studentRepository.findByEmail(student.getEmail().trim());
            if (existing.isPresent()) {
                Student e = existing.get();
                if (student.getName() != null) e.setName(student.getName());
                if (student.getCourse() != null) e.setCourse(student.getCourse());
                if (student.getPhone() != null) e.setPhone(student.getPhone());
                if (student.getPrnNo() != null) e.setPrnNo(student.getPrnNo());
                if (student.getAddress() != null) e.setAddress(student.getAddress());
                if (student.getBatch() != null) e.setBatch(student.getBatch());
                return ResponseEntity.ok(studentRepository.save(e));
            }
        }

        String course = (student.getCourse() != null && !student.getCourse().trim().isEmpty()) 
                        ? student.getCourse().trim() : "DAC";
        student.setCourse(course);

        if (student.getRollNo() == null || student.getRollNo().trim().isEmpty()) {
            student.setRollNo(course + "-2026-" + String.format("%03d", (int)(Math.random() * 900) + 100));
        }
        if (student.getBatch() == null || student.getBatch().trim().isEmpty()) {
            student.setBatch("Feb 2026");
        }
        Student saved = studentRepository.save(student);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        return studentRepository.findById(id)
                .map(existing -> {
                    if (studentDetails.getName() != null) existing.setName(studentDetails.getName());
                    if (studentDetails.getEmail() != null) existing.setEmail(studentDetails.getEmail());
                    if (studentDetails.getCourse() != null) existing.setCourse(studentDetails.getCourse());
                    if (studentDetails.getRollNo() != null) existing.setRollNo(studentDetails.getRollNo());
                    if (studentDetails.getPrnNo() != null) existing.setPrnNo(studentDetails.getPrnNo());
                    if (studentDetails.getPhone() != null) existing.setPhone(studentDetails.getPhone());
                    if (studentDetails.getAddress() != null) existing.setAddress(studentDetails.getAddress());
                    if (studentDetails.getBatch() != null) existing.setBatch(studentDetails.getBatch());
                    return ResponseEntity.ok(studentRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/email/{email}")
    public ResponseEntity<Student> updateStudentByEmail(@PathVariable String email, @RequestBody Student studentDetails) {
        Student student = studentRepository.findByEmail(email).orElseGet(() -> {
            Student newStudent = new Student();
            newStudent.setEmail(email);
            return newStudent;
        });

        if (studentDetails.getName() != null) student.setName(studentDetails.getName());
        if (studentDetails.getCourse() != null) student.setCourse(studentDetails.getCourse());
        if (studentDetails.getRollNo() != null) student.setRollNo(studentDetails.getRollNo());
        if (studentDetails.getPrnNo() != null) student.setPrnNo(studentDetails.getPrnNo());
        if (studentDetails.getPhone() != null) student.setPhone(studentDetails.getPhone());
        if (studentDetails.getAddress() != null) student.setAddress(studentDetails.getAddress());
        if (studentDetails.getBatch() != null) student.setBatch(studentDetails.getBatch());

        if (student.getRollNo() == null || student.getRollNo().isEmpty()) {
            student.setRollNo("DAC-2026-" + String.format("%03d", (int)(Math.random() * 900) + 100));
        }

        Student saved = studentRepository.save(student);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        return studentRepository.findById(id)
                .map(student -> {
                    studentRepository.delete(student);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
