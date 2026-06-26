package com.messsmart.models;

import java.math.BigDecimal;
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
@Table(name = "past_bill_history")
@Data
public class PastBillHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Links back to the student record for tracking historical payment logs
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // Stores the specific month and year context (e.g., "JUNE_2026")
    @Column(name = "billing_period", nullable = false, length = 20)
    private String billingPeriod;

    @Column(name = "final_bill_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal finalBillAmount;

    // Tracks if the student actually paid this historical bill ('PAID' or 'UNPAID')
    @Column(name = "payment_status", nullable = false, length = 20)
    private String paymentStatus = "UNPAID";

    @Column(name = "archived_at", updatable = false)
    private LocalDateTime archivedAt = LocalDateTime.now();
}