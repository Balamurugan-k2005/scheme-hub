package com.schemehub.backend.dto;

import com.schemehub.backend.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponseDto {
    private Long id;
    private SchemeDto scheme;
    private ApplicationStatus status;
    private String referenceId;
    private LocalDate applicationDate;
    private String notes;
}
