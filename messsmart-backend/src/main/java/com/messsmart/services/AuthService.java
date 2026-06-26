package com.messsmart.services;

import com.messsmart.models.Admin;
import com.messsmart.models.Student;
import com.messsmart.models.Mess;
import com.messsmart.repositories.AdminRepository;
import com.messsmart.repositories.StudentRepository;
import com.messsmart.repositories.MessRepository;
import com.messsmart.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private MessRepository messRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // 1. Register a Student Profile
    public String registerStudent(String name, String username, String password, Long messId) {
        if (studentRepository.findByUsername(username).isPresent() || adminRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username is already taken!");
        }

        Mess mess = messRepository.findById(messId)
                .orElseThrow(() -> new RuntimeException("Target campus mess location not found!"));

        Student student = new Student();
        student.setName(name);
        student.setUsername(username);
        student.setPassword(passwordEncoder.encode(password));
        student.setRole("ROLE_STUDENT"); 
        student.setMess(mess);
        student.setApproved(false); 

        studentRepository.save(student);
        return "Student registered successfully! Pending administrator approval.";
    }

    // 2. Button A: Register Admin for a BRAND NEW Mess
    public String registerNewMessAdmin(String name, String username, String password, String newMessName) {
        if (studentRepository.findByUsername(username).isPresent() || adminRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username is already taken!");
        }

        Mess newMess = new Mess();
        newMess.setMessName(newMessName);
        messRepository.save(newMess); 

        Admin admin = new Admin();
        admin.setName(name);
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole("ROLE_ADMIN"); 
        admin.setMess(newMess);
        admin.setApproved(true); 

        adminRepository.save(admin);
        return "Mess created and Super Admin account registered successfully!";
    }

    // 3. Button B: Register Admin for an EXISTING Mess
    public String registerExistingMessAdmin(String name, String username, String password, Long messId) {
        if (studentRepository.findByUsername(username).isPresent() || adminRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username is already taken!");
        }

        Mess mess = messRepository.findById(messId)
                .orElseThrow(() -> new RuntimeException("Target campus mess location not found!"));

        Admin admin = new Admin();
        admin.setName(name);
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole("ROLE_ADMIN"); 
        admin.setMess(mess);
        admin.setApproved(false); 

        adminRepository.save(admin);
        return "Staff Admin registered successfully! Pending approval from your Mess Head.";
    }

    // 4. Unified Cross-Table Login Validation Logic
    public String login(String username, String password, String role) {
        if ("ROLE_STUDENT".equalsIgnoreCase(role)) {
            Optional<Student> studentOpt = studentRepository.findByUsername(username);
            if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                if (!student.isApproved()) {
                    throw new RuntimeException("Your account access is currently pending admin verification.");
                }
                if (passwordEncoder.matches(password, student.getPassword())) {
                    return jwtUtil.generateToken(student.getUsername(), student.getRole());
                }
            }
        }

        if ("ROLE_ADMIN".equalsIgnoreCase(role)) {
            Optional<Admin> adminOpt = adminRepository.findByUsername(username);
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                if (!admin.isApproved()) {
                    throw new RuntimeException("Your manager account access is pending verification by your Mess Head.");
                }
                if (passwordEncoder.matches(password, admin.getPassword())) {
                    return jwtUtil.generateToken(admin.getUsername(), admin.getRole());
                }
            }
        }

        throw new RuntimeException("Invalid username or password for the selected role.");
    }
}