package com.messsmart.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Entity
@Table(name = "meal_selections", uniqueConstraints = {
    @UniqueConstraint(name = "unique_student_daily_selection", columnNames = {"student_id", "selection_date"})
})
@Data
public class MealSelection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Links directly to the individual student booking the meals
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // Tracks which mess location this booking belongs to
    @ManyToOne
    @JoinColumn(name = "mess_id", nullable = false)
    private Mess mess;

    @Column(name = "selection_date", nullable = false)
    private LocalDate selectionDate;

    @Column(nullable = false)
    private boolean breakfast = true;

    @Column(nullable = false)
    private boolean lunch = true;

    @Column(nullable = false)
    private boolean dinner = true;
}