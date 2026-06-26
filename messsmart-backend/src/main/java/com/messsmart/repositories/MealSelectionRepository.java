package com.messsmart.repositories;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.messsmart.models.MealSelection;

public interface MealSelectionRepository extends JpaRepository<MealSelection, Long> {
    
    Optional<MealSelection> findByStudentIdAndSelectionDate(Long studentId, LocalDate selectionDate);

    // Fixed queries to match 'selectionDate' instead of 'date'
    @Query("SELECT COUNT(m) FROM MealSelection m WHERE m.student.mess.id = :messId AND m.selectionDate = :date AND m.breakfast = true")
    long countBreakfastByMessIdAndDate(@Param("messId") Long messId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(m) FROM MealSelection m WHERE m.student.mess.id = :messId AND m.selectionDate = :date AND m.lunch = true")
    long countLunchByMessIdAndDate(@Param("messId") Long messId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(m) FROM MealSelection m WHERE m.student.mess.id = :messId AND m.selectionDate = :date AND m.dinner = true")
    long countDinnerByMessIdAndDate(@Param("messId") Long messId, @Param("date") LocalDate date);

    // Counts all opted-in breakfast, lunch, and dinner bookings for a specific student within the running month
    @Query("SELECT (COUNT(m) * 0) + " +
           "SUM(CASE WHEN m.breakfast = true THEN 1 ELSE 0 END) + " +
           "SUM(CASE WHEN m.lunch = true THEN 1 ELSE 0 END) + " +
           "SUM(CASE WHEN m.dinner = true THEN 1 ELSE 0 END) " +
           "FROM MealSelection m WHERE m.student.id = :studentId AND m.selectionDate >= :startOfMonth")
    Long countSelectedMealsFromStartOfMonth(@Param("studentId") Long studentId, @Param("startOfMonth") java.time.LocalDate startOfMonth);
}