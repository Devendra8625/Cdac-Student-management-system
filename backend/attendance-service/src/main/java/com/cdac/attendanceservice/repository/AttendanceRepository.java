package com.cdac.attendanceservice.repository;

import com.cdac.attendanceservice.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByDate(String date);
}
