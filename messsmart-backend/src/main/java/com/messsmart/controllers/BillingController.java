package com.messsmart.controllers;

import java.util.Map;
import java.util.List; // 🚀 Add this line to fix the compilation error
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.messsmart.models.CurrentMonthBill;
import com.messsmart.services.BillingService;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    @Autowired
    private BillingService billingService;

    // Fetch structured current monthly ledger data row -> GET /api/billing/live/{studentId}
    @GetMapping("/live/{studentId}")
    public ResponseEntity<?> getLiveMonthlyStatement(@PathVariable Long studentId) {
        try {
            CurrentMonthBill statement = billingService.getLiveBill(studentId);
            return ResponseEntity.ok(statement);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Autowired
    private com.messsmart.repositories.PastBillHistoryRepository pastBillHistoryRepository;

    // Fetch archived student statement history logs -> GET /api/billing/history/{studentId}
    @GetMapping("/history/{studentId}")
    public ResponseEntity<?> getPastBillingHistory(@PathVariable Long studentId) {
        try {
            List<com.messsmart.models.PastBillHistory> history = pastBillHistoryRepository.findByStudentId(studentId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}