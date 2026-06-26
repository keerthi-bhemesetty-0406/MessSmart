package com.messsmart.controllers;

import com.messsmart.models.Mess;
import com.messsmart.repositories.MessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/messes")
public class MessController {

    @Autowired
    private MessRepository messRepository;

    // Exposes the GET endpoint at /api/messes for your React Register.jsx screen
    @GetMapping
    public ResponseEntity<List<Mess>> getAllMesses() {
        List<Mess> messes = messRepository.findAll();
        return ResponseEntity.ok(messes);
    }
}