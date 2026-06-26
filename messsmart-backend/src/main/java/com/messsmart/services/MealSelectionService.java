package com.messsmart.services;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.messsmart.dto.MealSelectionDTO;
import com.messsmart.models.MealSelection;
import com.messsmart.models.Student;
import com.messsmart.repositories.MealSelectionRepository;
import com.messsmart.repositories.StudentRepository;

@Service
public class MealSelectionService {

    @Autowired
    private MealSelectionRepository mealSelectionRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Map<String, Object> getStudentProfileDetails(String username, LocalDate date) {
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
        
        MealSelection selection = mealSelectionRepository.findByStudentIdAndSelectionDate(student.getId(), date)
                .orElseGet(() -> {
                    MealSelection def = new MealSelection();
                    def.setStudent(student);
                    def.setMess(student.getMess());
                    def.setSelectionDate(date);
                    def.setBreakfast(true);
                    def.setLunch(true);
                    def.setDinner(true);
                    return def;
                });

        return Map.of(
            "id", student.getId(),
            "name", student.getName(),
            "username", student.getUsername(),
            "messName", student.getMess().getMessName(),
            "breakfast", selection.isBreakfast(),
            "lunch", selection.isLunch(),
            "dinner", selection.isDinner()
        );
    }

    public String saveOrUpdateSelection(MealSelectionDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Optional<MealSelection> existing = mealSelectionRepository.findByStudentIdAndSelectionDate(
                dto.getStudentId(), dto.getSelectionDate());

        MealSelection selection = existing.orElse(new MealSelection());
        selection.setStudent(student);
        selection.setMess(student.getMess());
        selection.setSelectionDate(dto.getSelectionDate());
        selection.setBreakfast(dto.isBreakfast());
        selection.setLunch(dto.isLunch());
        selection.setDinner(dto.isDinner());

        mealSelectionRepository.save(selection);
        return "Meal preferences saved successfully.";
    }

    public Map<String, Long> getKitchenHeadcount(Long messId, LocalDate date) {
        long breakfastCount = mealSelectionRepository.countBreakfastByMessIdAndDate(messId, date);
        long lunchCount = mealSelectionRepository.countLunchByMessIdAndDate(messId, date);
        long dinnerCount = mealSelectionRepository.countDinnerByMessIdAndDate(messId, date);

        return Map.of(
            "breakfast", breakfastCount,
            "lunch", lunchCount,
            "dinner", dinnerCount
        );
    }
}