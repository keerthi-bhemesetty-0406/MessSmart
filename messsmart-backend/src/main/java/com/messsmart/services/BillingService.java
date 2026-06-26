package com.messsmart.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.messsmart.models.CurrentMonthBill;
import com.messsmart.models.PastBillHistory;
import com.messsmart.models.Student;
import com.messsmart.repositories.CurrentMonthBillRepository;
import com.messsmart.repositories.PastBillHistoryRepository;
import com.messsmart.repositories.StudentRepository;

@Service
public class BillingService {

    @Autowired
    private CurrentMonthBillRepository currentMonthBillRepository;

    @Autowired
    private PastBillHistoryRepository pastBillHistoryRepository;

    @Autowired
    private StudentRepository studentRepository;

    // Hardcoded pricing policy constraints
    private final BigDecimal BASE_MONTHLY_PRICE = new BigDecimal("1500.00");
    private final BigDecimal SKIPPED_MEAL_PENALTY = new BigDecimal("25.00");
    private final BigDecimal UNBOOKED_MEAL_PENALTY = new BigDecimal("50.00");

    // 1. Core utility method to safely apply a generic penalty to a student's live ledger
    @Transactional
    public void applyPenalty(Long studentId, String penaltyType) {
        CurrentMonthBill bill = currentMonthBillRepository.findByStudentId(studentId)
                .orElseGet(() -> createDefaultBillForStudent(studentId));

        BigDecimal penaltyAmount = "SKIPPED".equalsIgnoreCase(penaltyType) ? SKIPPED_MEAL_PENALTY : UNBOOKED_MEAL_PENALTY;

        // Correctly call Lombok's generated standard getter and setter for BigDecimal fields
        bill.setTotalPenaltyCharges(bill.getTotalPenaltyCharges().add(penaltyAmount));
        
        // Recalculate net due amount: base_meal_bill + total_penalty_charges
        bill.setNetAmountDue(bill.getBaseMealBill().add(bill.getTotalPenaltyCharges()));
        bill.setLastUpdated(LocalDateTime.now());

        currentMonthBillRepository.save(bill);
    }

    // 2. Fetch the live data statement table to show directly on Student Dashboards
    public CurrentMonthBill getLiveBill(Long studentId) {
        return currentMonthBillRepository.findByStudentId(studentId)
                .orElseGet(() -> createDefaultBillForStudent(studentId));
    }

    // Helper method to auto-initialize a row if a student doesn't have one yet
    private CurrentMonthBill createDefaultBillForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student record missing."));
        
        CurrentMonthBill defaultBill = new CurrentMonthBill();
        defaultBill.setStudent(student);
        defaultBill.setBaseMealBill(BASE_MONTHLY_PRICE); // Set base fee
        defaultBill.setTotalPenaltyCharges(BigDecimal.ZERO);
        defaultBill.setNetAmountDue(BASE_MONTHLY_PRICE);
        defaultBill.setLastUpdated(LocalDateTime.now());
        
        return currentMonthBillRepository.save(defaultBill);
    }

    // =============================================================
    // AUTOMATED END-OF-MONTH ARCHIVE AND LEDGER REFRESH RESET CRON
    // =============================================================
    // Fires automatically at 11:59 PM on the last day of every calendar month
    @Scheduled(cron = "0 59 23 L * *")
    @Transactional
    public void executeMonthlyBillingRolloverCleanup() {
        List<CurrentMonthBill> activeBills = currentMonthBillRepository.findAll();
        LocalDate today = LocalDate.now();
        
        // Generate current string tag context dynamically (e.g., "JUNE_2026")
        String currentBillingPeriod = today.getMonth().toString() + "_" + today.getYear();

        for (CurrentMonthBill activeBill : activeBills) {
            // 1. Copy active monthly ledger row data directly into the PastBillHistory record layout
            PastBillHistory historyLog = new PastBillHistory();
            
            // Fixed mappings to use standard accessor getters from Lombok's bean context
            historyLog.setStudent(activeBill.getStudent());
            historyLog.setBillingPeriod(currentBillingPeriod);
            historyLog.setFinalBillAmount(activeBill.getNetAmountDue());
            historyLog.setPaymentStatus("UNPAID"); // Marked unpaid initially till transaction clearance
            historyLog.setArchivedAt(LocalDateTime.now());
            pastBillHistoryRepository.save(historyLog);

            // 2. REFRESH AND RESET the student's active monthly row clean back to 0.00
            activeBill.setTotalPenaltyCharges(BigDecimal.ZERO);
            activeBill.setBaseMealBill(BASE_MONTHLY_PRICE); // Restart base fee for new month
            activeBill.setNetAmountDue(BASE_MONTHLY_PRICE); // Net resets back to base
            activeBill.setLastUpdated(LocalDateTime.now());
            currentMonthBillRepository.save(activeBill);
        }
    }
}