package com.messsmart.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.messsmart.models.ExtraCharge;

@Repository
public interface ExtraChargeRepository extends JpaRepository<ExtraCharge, Long> {
    // Pulls all penalty fees applied to a single student profile
    List<ExtraCharge> findByStudentId(Long studentId);
}