package com.messsmart.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.messsmart.models.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Custom finder to verify admin login credentials
    Optional<Admin> findByUsername(String username);
    List<Admin> findByMessIdAndIsApprovedFalse(Long messId);
}