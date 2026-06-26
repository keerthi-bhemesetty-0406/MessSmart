package com.messsmart.models;

import java.time.LocalDate;
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
@Table(name = "extra_charges")
@Data
public class ExtraCharge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Links to the student who incurred the fine
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // Explains the violation: 'MARKED_BUT_NOT_ATTENDED' or 'NOT_MARKED_BUT_ATTENDED'
    @Column(name = "penalty_reason", nullable = false, length = 100)
    private String penaltyReason;

    // The financial fine penalty amount assessed (e.g., 50.00)
    @Column(name = "penalty_amount", nullable = false, precision = 10, scale = 2)
    private java.math.BigDecimal penaltyAmount;

    @Column(name = "issued_date", nullable = false)
    private LocalDate issuedDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}