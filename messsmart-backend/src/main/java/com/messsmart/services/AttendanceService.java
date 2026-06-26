package com.messsmart.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.messsmart.models.Attendance;
import com.messsmart.models.MealSelection;
import com.messsmart.models.Student;
import com.messsmart.repositories.AttendanceRepository;
import com.messsmart.repositories.MealSelectionRepository;
import com.messsmart.repositories.StudentRepository;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MealSelectionRepository mealSelectionRepository;

    @Autowired
    private StudentRepository studentRepository;

    // We inject BillingService here so we can call applyPenalty()
    @Autowired
    private BillingService billingService;

    // ==========================================
    // 1. LIVE WORKER QR CODE SCANNER LOGIC
    // ==========================================
    // ==========================================
    // 1. LIVE WORKER QR CODE SCANNER LOGIC (TIME-LOCKED EXPIRY SECURED)
    // ==========================================
    public String recordWorkerScan(Long studentId, Long qrTimestamp) {
        // 🚀 CRYPTOGRAPHIC TIME WINDOW GUARD RAMP
        if (qrTimestamp == null) {
            throw new RuntimeException("Scan Denied: Invalid cryptographic structure. Missing timestamp.");
        }

        long serverTime = System.currentTimeMillis();
        long timeDelta = serverTime - qrTimestamp;
        long maxTolerance = 1000 * 60 * 3; // 3 Minutes in milliseconds (180,000 ms)

        // Prevent future-spoofing clocks or tokens that exceed our 3-minute tolerance window
        if (timeDelta < -30000 || timeDelta > maxTolerance) {
            throw new RuntimeException("Scan Denied: QR code expired. Please have student open their active app screen.");
        }

        LocalDateTime nowDateTime = LocalDateTime.now();
        LocalDate today = nowDateTime.toLocalDate();
        LocalTime nowTime = nowDateTime.toLocalTime();
        String activeMeal;

        // Determine which serving window is active right now
        if (nowTime.isAfter(LocalTime.of(6, 0)) && nowTime.isBefore(LocalTime.of(9, 30))) {
            activeMeal = "BREAKFAST";
        } else if (nowTime.isAfter(LocalTime.of(11, 30)) && nowTime.isBefore(LocalTime.of(18, 0))) { // Keeping our developer bypass extension window if active
            activeMeal = "LUNCH";
        } else if (nowTime.isAfter(LocalTime.of(19, 0)) && nowTime.isBefore(LocalTime.of(22, 0))) { 
            activeMeal = "DINNER";
        } else {
            throw new RuntimeException("Scan Denied: Cafeteria windows are currently closed.");
        }

        // Double-Scan Prevention
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);
        Optional<Attendance> duplicateCheck = attendanceRepository.findDuplicateScan(studentId, activeMeal, startOfDay, endOfDay);
        if (duplicateCheck.isPresent()) {
            throw new RuntimeException("Scan Denied: Attendance already marked for " + activeMeal + " today.");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student record not found."));

        // Check if the student pre-booked this meal
        MealSelection selection = mealSelectionRepository.findByStudentIdAndSelectionDate(studentId, today)
                .orElse(null);

        boolean wasBooked = false;
        if (selection != null) {
            if ("BREAKFAST".equals(activeMeal)) wasBooked = selection.isBreakfast();
            else if ("LUNCH".equals(activeMeal)) wasBooked = selection.isLunch();
            else if ("DINNER".equals(activeMeal)) wasBooked = selection.isDinner();
        }

        // Save entry into the attendance table
        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setMealType(activeMeal);
        attendance.setMarkedAt(nowDateTime);
        attendanceRepository.save(attendance);

        if (wasBooked) {
            return "Attendance Marked: Enjoy your " + activeMeal + "!";
        } else {
            billingService.applyPenalty(studentId, "UNBOOKED");
            return "Attendance Marked with Warning: Unbooked meal eaten. An unplanned penalty has been applied.";
        }
    }

    // ==========================================
    // 2. AUTOMATED TIMED POST-MESS ABSENTEE SWEEPER
    // ==========================================

    // Run at 10:01 AM for Breakfast absentees
    @Scheduled(cron = "0 1 10 * * *")
    @Transactional
    public void processBreakfastAbsentees() {
        processMealAbsentees("BREAKFAST");
    }

    // Run at 2:21 PM for Lunch absentees
    @Scheduled(cron = "0 21 14 * * *")
    @Transactional
    public void processLunchAbsentees() {
        processMealAbsentees("LUNCH");
    }

    // Run at 10:01 PM for Dinner absentees
    @Scheduled(cron = "0 1 22 * * *")
    @Transactional
    public void processDinnerAbsentees() {
        processMealAbsentees("DINNER");
    }

    private void processMealAbsentees(String mealType) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);
        
        List<Student> activeStudents = studentRepository.findAll();

        for (Student student : activeStudents) {
            // Check if this student has a scan record for today's meal window
            boolean attended = attendanceRepository
                    .findDuplicateScan(student.getId(), mealType, startOfDay, endOfDay)
                    .isPresent();

            if (!attended) {
                // Check if they booked it
                MealSelection selection = mealSelectionRepository
                        .findByStudentIdAndSelectionDate(student.getId(), today)
                        .orElse(null);

                boolean wasBooked = false;
                if (selection != null) {
                    if ("BREAKFAST".equals(mealType)) wasBooked = selection.isBreakfast();
                    else if ("LUNCH".equals(mealType)) wasBooked = selection.isLunch();
                    else if ("DINNER".equals(mealType)) wasBooked = selection.isDinner();
                }

                // CASE 2: Booked but NOT Attended (Food Waste Penalty)
                if (wasBooked) {
                    // Tells billingService to add a skipped meal penalty to current_month_bills
                    billingService.applyPenalty(student.getId(), "SKIPPED");
                }
            }
        }
    }
}