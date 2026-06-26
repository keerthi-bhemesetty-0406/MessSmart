package com.messsmart.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AttendanceScanDTO {

    @NotNull(message = "Student ID is required to process the scan.")
    private Long studentId;

    private Long timestamp;
}