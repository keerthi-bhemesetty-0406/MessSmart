package com.messsmart.controllers;

import java.time.LocalDate;
import java.util.Map;
import com.messsmart.dto.MealSelectionDTO;
import com.messsmart.models.MealSelection;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.messsmart.services.MealSelectionService;

@RestController
@RequestMapping("/api/meals")
public class MealSelectionController {

    @Autowired
    private MealSelectionService mealSelectionService;

    // Get a student's profile and current day selection
    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getStudentProfile(
            @PathVariable String username, 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            return ResponseEntity.ok(mealSelectionService.getStudentProfileDetails(username, date));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Student Toggle Endpoint -> Only one single clean mapping declaration!
    @PostMapping("/select")
    public ResponseEntity<?> saveMealSelection(@Valid @RequestBody MealSelectionDTO selectionDTO) {
        try {
            String msg = mealSelectionService.saveOrUpdateSelection(selectionDTO);
            return ResponseEntity.ok(Map.of("message", msg));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Kitchen staff headcount analytics endpoint
    @GetMapping("/headcount/{messId}")
    public ResponseEntity<?> getHeadcount(
            @PathVariable Long messId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            return ResponseEntity.ok(mealSelectionService.getKitchenHeadcount(messId, date));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    @Autowired
private com.messsmart.services.BillingService billingService;

// Get a student's active monthly bill statement ledger -> GET /api/meals/ledger/{studentId}


    @Autowired
    private com.messsmart.repositories.MealSelectionRepository mealSelectionRepository;

    @Autowired
    private com.messsmart.repositories.AttendanceRepository attendanceRepository;

    // Updated dynamic ledger metrics mapping
    
    // Updated dynamic ledger metrics mapping with per-meal costs factored in
    // Updated dynamic ledger metrics mapping
    @GetMapping("/ledger/{studentId}")
    public ResponseEntity<?> getStudentLedger(@PathVariable Long studentId) {
        try {
            // 1. Fetch your baseline database row tracker (Base Fee + Penalties)
            com.messsmart.models.CurrentMonthBill bill = billingService.getLiveBill(studentId);
            
            // Calculate beginning of current calendar month boundaries
            java.time.LocalDate firstDayOfDoc = java.time.LocalDate.now().withDayOfMonth(1);
            java.time.LocalDateTime startOfMonthTime = firstDayOfDoc.atStartOfDay();

            // 2. Fetch live metrics from your queries
            Long selectedCount = mealSelectionRepository.countSelectedMealsFromStartOfMonth(studentId, firstDayOfDoc);
            long attendedCount = attendanceRepository.countAttendedMealsFromStartOfMonth(studentId, startOfMonthTime);

            // 3. Define cost per individual attended meal consumption
            java.math.BigDecimal costPerMeal = new java.math.BigDecimal("40.00");
            java.math.BigDecimal totalAttendanceCost = costPerMeal.multiply(java.math.BigDecimal.valueOf(attendedCount));

            // 4. Calculate Net Balance: Base + Penalties + (Attended Count * Cost Per Meal)
            java.math.BigDecimal dynamicNetAmountDue = bill.getBaseMealBill()
                    .add(bill.getTotalPenaltyCharges())
                    .add(totalAttendanceCost);

            return ResponseEntity.ok(Map.of(
                "baseMealBill", bill.getBaseMealBill(),
                "totalPenaltyCharges", bill.getTotalPenaltyCharges(),
                "netAmountDue", dynamicNetAmountDue, // 🚀 Returns the completely calculated sum
                "selectedCount", selectedCount != null ? selectedCount : 0,
                "attendedCount", attendedCount
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}