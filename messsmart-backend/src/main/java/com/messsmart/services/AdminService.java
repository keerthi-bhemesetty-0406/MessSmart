package com.messsmart.services;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.messsmart.models.Admin;
import com.messsmart.models.Student;
import com.messsmart.repositories.AdminRepository;
import com.messsmart.repositories.StudentRepository;

@Service
public class AdminService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AdminRepository adminRepository;

    public List<Student> getPendingStudents(Long messId) {
        return studentRepository.findByMessIdAndIsApprovedFalse(messId);
    }

    public List<Admin> getPendingAdmins(Long messId) {
        return adminRepository.findByMessIdAndIsApprovedFalse(messId);
    }

    public String approveStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setApproved(true); // Lombok target for boolean isApproved field
        studentRepository.save(student);
        return "Student account approved successfully.";
    }

    public String dismissStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found");
        }
        studentRepository.deleteById(id);
        return "Student application successfully removed from database.";
    }

    public String approveAdmin(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin staff not found"));
        admin.setApproved(true); // Lombok target for boolean isApproved field
        adminRepository.save(admin);
        return "Staff admin approved successfully.";
    }

    public String dismissAdmin(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin staff not found");
        }
        adminRepository.deleteById(id);
        return "Staff admin application successfully removed from database.";
    }

    // Dynamic profile metadata lookup resolver matching your dashboard fetch
    public Map<String, Object> getAdminProfile(String username) {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin account not found"));
                
        return Map.of(
            "name", admin.getName(),
            "username", admin.getUsername(),
            "messId", admin.getMess().getId(),
            "messName", admin.getMess().getMessName()
        );
    }
    // 🚀 Add this method to resolve the final compilation error!
    public long getApprovedStudentsCount(Long messId) {
        return studentRepository.countByMessIdAndIsApprovedTrue(messId);
    }
}