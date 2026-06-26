package com.messsmart.controllers;

import com.messsmart.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@RequestBody Map<String, String> requestData) {
        try {
            String message = authService.registerStudent(
                    requestData.get("name"),
                    requestData.get("username"),
                    requestData.get("password"),
                    Long.parseLong(requestData.get("messId"))
            );
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register/admin/new-mess")
    public ResponseEntity<?> registerNewMessAdmin(@RequestBody Map<String, String> requestData) {
        try {
            String message = authService.registerNewMessAdmin(
                    requestData.get("name"),
                    requestData.get("username"),
                    requestData.get("password"),
                    requestData.get("messName")
            );
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register/admin/existing-mess")
    public ResponseEntity<?> registerExistingMessAdmin(@RequestBody Map<String, String> requestData) {
        try {
            String message = authService.registerExistingMessAdmin(
                    requestData.get("name"),
                    requestData.get("username"),
                    requestData.get("password"),
                    Long.parseLong(requestData.get("messId"))
            );
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> requestData) {
        try {
            String token = authService.login(
                    requestData.get("username"),
                    requestData.get("password"),
                    requestData.get("role") 
            );
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}