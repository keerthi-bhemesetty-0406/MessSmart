package com.messsmart.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MealSelectionDTO {

    @NotNull(message = "Student ID cannot be blank.")
    private Long studentId;

    @NotNull(message = "Selection date must be specified.")
    private LocalDate selectionDate;

    private boolean breakfast;
    private boolean lunch;
    private boolean dinner;
}