package com.messsmart.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.messsmart.models.Admin;
import com.messsmart.models.Student;
import com.messsmart.services.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Line 1: Get list of pending students -> GET /api/admin/pending/students/{messId}
    @GetMapping("/pending/students/{messId}")
    public ResponseEntity<List<Student>> getPendingStudents(@PathVariable Long messId) {
        return ResponseEntity.ok(adminService.getPendingStudents(messId));
    }

    // Line 2: Get list of pending staff admins -> GET /api/admin/pending/admins/{messId}
    @GetMapping("/pending/admins/{messId}")
    public ResponseEntity<List<Admin>> getPendingAdmins(@PathVariable Long messId) {
        return ResponseEntity.ok(adminService.getPendingAdmins(messId));
    }

    // Line 3: Approve Student -> POST /api/admin/approve/student/{id}
    @PostMapping("/approve/student/{id}")
    public ResponseEntity<?> approveStudent(@PathVariable Long id) {
        try {
            String message = adminService.approveStudent(id);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Line 4: Dismiss and Delete Student -> DELETE /api/admin/dismiss/student/{id}
    @DeleteMapping("/dismiss/student/{id}")
    public ResponseEntity<?> dismissStudent(@PathVariable Long id) {
        try {
            String message = adminService.dismissStudent(id);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Line 5: Approve Staff Admin -> POST /api/admin/approve/admin/{id}
    @PostMapping("/approve/admin/{id}")
    public ResponseEntity<?> approveAdmin(@PathVariable Long id) {
        try {
            String message = adminService.approveAdmin(id);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Line 6: Dismiss and Delete Staff Admin -> DELETE /api/admin/dismiss/admin/{id}
    @DeleteMapping("/dismiss/admin/{id}")
    public ResponseEntity<?> dismissAdmin(@PathVariable Long id) {
        try {
            String message = adminService.dismissAdmin(id);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get logged-in admin profile details -> GET /api/admin/profile/{username}
@GetMapping("/profile/{username}")
public ResponseEntity<?> getAdminProfile(@PathVariable String username) {
    try {
        return ResponseEntity.ok(adminService.getAdminProfile(username));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}

// Get total count of approved students in a mess -> GET /api/admin/count/students/{messId}
@GetMapping("/count/students/{messId}")
public ResponseEntity<?> getApprovedStudentsCount(@PathVariable Long messId) {
    try {
        long count = adminService.getApprovedStudentsCount(messId);
        return ResponseEntity.ok(java.util.Map.of("count", count));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
    }
}

    @Autowired
    private com.messsmart.repositories.MealSelectionRepository mealSelectionRepository;

    // Fetch dynamic headcounts and toggle status flags -> GET /api/admin/analytics/meals/{messId}
    @GetMapping("/analytics/meals/{messId}")
    public ResponseEntity<?> getMealHeadcounts(@PathVariable Long messId) {
        try {
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.LocalTime nowTime = java.time.LocalTime.now();
            
            // 1. Fetch baseline pool count of approved students
            long totalApproved = adminService.getApprovedStudentsCount(messId);

            // 2. Fetch active opt-in rows directly using your repo methods
            long bfOptIn = mealSelectionRepository.countBreakfastByMessIdAndDate(messId, today);
            long luOptIn = mealSelectionRepository.countLunchByMessIdAndDate(messId, today);
            long diOptIn = mealSelectionRepository.countDinnerByMessIdAndDate(messId, today);

            // 3. Compute Opt-Out math: Total Approved - Opted In
            long bfOptOut = Math.max(0, totalApproved - bfOptIn);
            long luOptOut = Math.max(0, totalApproved - luOptIn);
            long diOptOut = Math.max(0, totalApproved - diOptIn);

            // 4. Compare system hours to cut-offs to evaluate Status Badges
            // Breakfast Cut-off: 4:00 AM (Hour 4)
            String bfStatus = nowTime.isBefore(java.time.LocalTime.of(4, 0)) ? "LIVE" : "FINAL";
            // Lunch Cut-off: 10:00 AM (Hour 10)
            String luStatus = nowTime.isBefore(java.time.LocalTime.of(10, 0)) ? "LIVE" : "FINAL";
            // Dinner Cut-off: 5:00 PM (Hour 17)
            String diStatus = nowTime.isBefore(java.time.LocalTime.of(17, 0)) ? "LIVE" : "FINAL";

            return ResponseEntity.ok(Map.of(
                "date", today.toString(),
                "breakfast", Map.of("optIn", bfOptIn, "optOut", bfOptOut, "status", bfStatus),
                "lunch", Map.of("optIn", luOptIn, "optOut", luOptOut, "status", luStatus),
                "dinner", Map.of("optIn", diOptIn, "optOut", diOptOut, "status", diStatus)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}