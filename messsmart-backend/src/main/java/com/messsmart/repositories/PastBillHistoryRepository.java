package com.messsmart.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.messsmart.models.PastBillHistory;

public interface PastBillHistoryRepository extends JpaRepository<PastBillHistory, Long> {
    List<PastBillHistory> findByStudentId(Long studentId);
}