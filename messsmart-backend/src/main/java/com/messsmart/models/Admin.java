package com.messsmart.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "admins")
@Data
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name",nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false)
    private String role = "ROLE_ADMIN";

    // Add this column inside your Admin.java class
    @Column(name = "is_approved", nullable = false)
    private boolean isApproved = true; // Default to true, we will toggle this in code
    
    // Each admin manages a specific mess location
    @ManyToOne
    @JoinColumn(name = "mess_id", referencedColumnName = "id")
    private Mess mess;
}