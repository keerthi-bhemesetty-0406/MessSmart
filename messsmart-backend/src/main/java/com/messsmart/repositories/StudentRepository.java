package com.messsmart.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.messsmart.models.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    // Looks up a student profile by username for login verification
    Optional<Student> findByUsername(String username);

    // Fetches all unapproved students for an admin's specific mess hall workflow
    List<Student> findByMessIdAndIsApprovedFalse(Long messId);

    // Counts all approved students actively assigned to a specific mess location
long countByMessIdAndIsApprovedTrue(Long messId);
}