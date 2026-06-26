package com.messsmart.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.messsmart.models.CurrentMonthBill;

public interface CurrentMonthBillRepository extends JpaRepository<CurrentMonthBill, Long> {
    Optional<CurrentMonthBill> findByStudentId(Long studentId);
}