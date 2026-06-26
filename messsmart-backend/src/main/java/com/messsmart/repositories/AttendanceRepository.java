package com.messsmart.repositories;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.messsmart.models.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // Checks if a student already scanned for a meal type today
    @Query("SELECT a FROM Attendance a WHERE a.student.id = :studentId AND a.mealType = :mealType AND a.markedAt >= :startOfDay AND a.markedAt <= :endOfDay")
    Optional<Attendance> findDuplicateScan(
        @Param("studentId") Long studentId, 
        @Param("mealType") String mealType, 
        @Param("startOfDay") LocalDateTime startOfDay, 
        @Param("endOfDay") LocalDateTime endOfDay
    );

    // Counts total valid attended meals for a student from the start of the month till date
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.markedAt >= :startOfMonth")
    long countAttendedMealsFromStartOfMonth(@Param("studentId") Long studentId, @Param("startOfMonth") LocalDateTime startOfMonth);
}