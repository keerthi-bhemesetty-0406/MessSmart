package com.messsmart.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "attendance")
@Data
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tracks which specific student scanned their token
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // Stores 'BREAKFAST', 'LUNCH', or 'DINNER'
    @Column(name = "meal_type", nullable = false, length = 20)
    private String mealType;

    @Column(name = "marked_at", nullable = false, updatable = false)
    private LocalDateTime markedAt = LocalDateTime.now();
}