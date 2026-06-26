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
@Table(name = "students")
@Data
public class Student {

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
    private String role = "ROLE_STUDENT";

    @Column(name = "is_approved", nullable = false)
    private boolean isApproved = false;

    // Each student is mapped to a specific mess building
    @ManyToOne
    @JoinColumn(name = "mess_id", referencedColumnName = "id")
    private Mess mess;
}