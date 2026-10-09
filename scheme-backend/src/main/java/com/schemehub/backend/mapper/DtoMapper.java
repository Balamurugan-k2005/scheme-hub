package com.schemehub.backend.mapper;

import com.schemehub.backend.dto.*;
import com.schemehub.backend.entity.*;

import java.util.stream.Collectors;

public class DtoMapper {

    public static RuleDto toDto(EligibilityRule rule) {
        if (rule == null) return null;
        return RuleDto.builder()
                .id(rule.getId())
                .fieldName(rule.getFieldName())
                .operator(rule.getOperator())
                .ruleValue(rule.getRuleValue())
                .isCritical(rule.getIsCritical())
                .messageEn(rule.getMessageEn())
                .messageHi(rule.getMessageHi())
                .messageTa(rule.getMessageTa())
                .build();
    }

    public static DocumentDto toDto(RequiredDocument doc) {
        if (doc == null) return null;
        return DocumentDto.builder()
                .id(doc.getId())
                .documentNameEn(doc.getDocumentNameEn())
                .documentNameHi(doc.getDocumentNameHi())
                .documentNameTa(doc.getDocumentNameTa())
                .isMandatory(doc.getIsMandatory())
                .build();
    }

    public static SchemeDto toDto(Scheme scheme) {
        if (scheme == null) return null;
        return SchemeDto.builder()
                .id(scheme.getId())
                .nameEn(scheme.getNameEn())
                .nameHi(scheme.getNameHi())
                .nameTa(scheme.getNameTa())
                .descriptionEn(scheme.getDescriptionEn())
                .descriptionHi(scheme.getDescriptionHi())
                .descriptionTa(scheme.getDescriptionTa())
                .eligibilityDescEn(scheme.getEligibilityDescEn())
                .eligibilityDescHi(scheme.getEligibilityDescHi())
                .eligibilityDescTa(scheme.getEligibilityDescTa())
                .benefitEn(scheme.getBenefitEn())
                .benefitHi(scheme.getBenefitHi())
                .benefitTa(scheme.getBenefitTa())
                .benefitCalculatorExpr(scheme.getBenefitCalculatorExpr())
                .officialSourceUrl(scheme.getOfficialSourceUrl())
                .lastVerifiedAt(scheme.getLastVerifiedAt())
                .verifiedStatus(scheme.getVerifiedStatus())
                .departmentEn(scheme.getDepartmentEn())
                .departmentHi(scheme.getDepartmentHi())
                .departmentTa(scheme.getDepartmentTa())
                .category(scheme.getCategory())
                .beneficiaryType(scheme.getBeneficiaryType())
                .isCentral(scheme.getIsCentral())
                .stateName(scheme.getStateName())
                .districtName(scheme.getDistrictName())
                .deadlineDate(scheme.getDeadlineDate())
                .status(scheme.getStatus())
                .viewsCount(scheme.getViewsCount())
                .rules(scheme.getRules() != null ? scheme.getRules().stream().map(DtoMapper::toDto).collect(Collectors.toList()) : null)
                .requiredDocuments(scheme.getRequiredDocuments() != null ? scheme.getRequiredDocuments().stream().map(DtoMapper::toDto).collect(Collectors.toList()) : null)
                .build();
    }

    public static ApplicationResponseDto toDto(Application app) {
        if (app == null) return null;
        return ApplicationResponseDto.builder()
                .id(app.getId())
                .scheme(toDto(app.getScheme()))
                .status(app.getStatus())
                .referenceId(app.getReferenceId())
                .applicationDate(app.getApplicationDate())
                .notes(app.getNotes())
                .build();
    }

    public static ProfileDto toDto(Profile profile) {
        if (profile == null) return null;
        return ProfileDto.builder()
                .age(profile.getAge())
                .gender(profile.getGender())
                .state(profile.getState())
                .district(profile.getDistrict())
                .annualIncome(profile.getAnnualIncome())
                .occupation(profile.getOccupation())
                .education(profile.getEducation())
                .caste(profile.getCaste())
                .disabilityStatus(profile.getDisabilityStatus())
                .disabilityDetails(profile.getDisabilityDetails())
                .familyMembers(profile.getFamilyMembers())
                .isFarmer(profile.getIsFarmer())
                .isStudent(profile.getIsStudent())
                .isBusinessOwner(profile.getIsBusinessOwner())
                .build();
    }
}
