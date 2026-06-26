package com.messsmart.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "current_month_bills")
@Data
public class CurrentMonthBill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Links to the specific student who owns this bill ledger row
    @OneToOne
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    // Base cost of the standard menu options they kept active
    @Column(name = "base_meal_bill", nullable = false, precision = 10, scale = 2)
    private BigDecimal baseMealBill = BigDecimal.ZERO;

    // Sum total of all automated penalty extra charges issued to them this month
    @Column(name = "total_penalty_charges", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPenaltyCharges = BigDecimal.ZERO;

    // Net running total calculated by adding base meal bill + penalty charges
    @Column(name = "net_amount_due", nullable = false, precision = 10, scale = 2)
    private BigDecimal netAmountDue = BigDecimal.ZERO;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated = LocalDateTime.now();
}