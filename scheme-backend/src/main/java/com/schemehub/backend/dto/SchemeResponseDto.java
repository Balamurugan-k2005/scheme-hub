package com.schemehub.backend.dto;

import com.schemehub.backend.service.RuleEngineService.EvaluationResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchemeResponseDto {
    private SchemeDto scheme;
    private EvaluationResult evaluation;
}
