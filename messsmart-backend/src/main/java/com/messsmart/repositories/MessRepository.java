package com.messsmart.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.messsmart.models.Mess;

@Repository
public interface MessRepository extends JpaRepository<Mess, Long> {
    // Custom finder to look up a mess by its exact name (e.g., "SouthMess")
    Optional<Mess> findByMessName(String messName);
}