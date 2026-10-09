package com.schemehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeBatchDto {
    private String nameEn;
    private String nameHi;
    private String nameTa;

    private String descriptionEn;
    private String descriptionHi;
    private String descriptionTa;

    private String eligibilityDescEn;
    private String eligibilityDescHi;
    private String eligibilityDescTa;

    private String benefitEn;
    private String benefitHi;
    private String benefitTa;

    private String benefitCalculatorExpr;
    private String officialSourceUrl;

    private String departmentEn;
    private String departmentHi;
    private String departmentTa;

    private String category;
    private String beneficiaryType;

    private Boolean isCentral;
    private String stateName;
    private String districtName;
    private LocalDate deadlineDate;

    private String status;

    private List<RuleDto> rules;
    private List<DocumentDto> requiredDocuments;
}
