package com.messsmart.controllers;

import com.messsmart.dto.AttendanceScanDTO;
import com.messsmart.services.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    // Mess Worker QR Scanner Endpoint -> POST /api/attendance/scan
    @PostMapping("/scan")
    public ResponseEntity<?> processWorkerQRScan(@Valid @RequestBody AttendanceScanDTO scanDTO) {
        try {
            // No more manual parsing or loose map string keys!
            String resultMessage = attendanceService.recordWorkerScan(scanDTO.getStudentId(),scanDTO.getTimestamp());
            return ResponseEntity.ok(Map.of("message", resultMessage));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}