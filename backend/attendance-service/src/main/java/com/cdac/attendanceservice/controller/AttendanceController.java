package com.cdac.attendanceservice.controller;

import com.cdac.attendanceservice.entity.Attendance;
import com.cdac.attendanceservice.repository.AttendanceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;

    public AttendanceController(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    @GetMapping("/date/{date}")
    public List<Attendance> getAttendanceByDate(@PathVariable String date) {
        return attendanceRepository.findByDate(date);
    }

    @PostMapping
    public ResponseEntity<Attendance> addAttendance(@RequestBody Attendance attendance) {
        Attendance saved = attendanceRepository.save(attendance);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttendance(@PathVariable Long id) {
        return attendanceRepository.findById(id)
                .map(attendance -> {
                    attendanceRepository.delete(attendance);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
