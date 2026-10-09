package com.schemehub.backend.controller;

import com.schemehub.backend.dto.*;
import com.schemehub.backend.entity.*;
import com.schemehub.backend.mapper.DtoMapper;
import com.schemehub.backend.repository.EligibilityRuleRepository;
import com.schemehub.backend.repository.RequiredDocumentRepository;
import com.schemehub.backend.repository.SchemeRepository;
import com.schemehub.backend.service.AdminService;
import com.schemehub.backend.service.SchemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private SchemeService schemeService;

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private EligibilityRuleRepository eligibilityRuleRepository;

    @Autowired
    private RequiredDocumentRepository requiredDocumentRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHEME_MANAGER')")
    public ResponseEntity<AdminDashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @PutMapping("/schemes/{id}/verify")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHEME_MANAGER')")
    public ResponseEntity<?> verifyScheme(@PathVariable Long id, @RequestParam VerifiedStatus status) {
        Scheme scheme = adminService.verifyScheme(id, status);
        return ResponseEntity.ok(DtoMapper.toDto(scheme));
    }

    // Public endpoint for submitting a report on a scheme
    @PostMapping("/reports")
    public ResponseEntity<?> submitReport(@RequestBody ReportRequestDto reportRequest) {
        UserReport report = adminService.createReport(reportRequest.getSchemeId(), reportRequest.getReportType(), reportRequest.getComments());
        return ResponseEntity.ok(report);
    }

    @GetMapping("/reports")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHEME_MANAGER')")
    public ResponseEntity<List<UserReport>> getAllReports() {
        return ResponseEntity.ok(adminService.getAllReports());
    }

    @PutMapping("/reports/{id}/resolve")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHEME_MANAGER')")
    public ResponseEntity<?> resolveReport(@PathVariable Long id) {
        UserReport resolved = adminService.resolveReport(id);
        return ResponseEntity.ok(resolved);
    }

    // CRUD Schemes
    @PostMapping("/schemes")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHEME_MANAGER')")
    public ResponseEntity<?> createScheme(@RequestBody SchemeDto schemeDto) {
        Scheme scheme = Scheme.builder()
                .nameEn(schemeDto.getNameEn())
                .nameHi(schemeDto.getNameHi())
                .nameTa(schemeDto.getNameTa())
                .descriptionEn(schemeDto.getDescriptionEn())
                .descriptionHi(schemeDto.getDescriptionHi())
                .descriptionTa(schemeDto.getDescriptionTa())
                .eligibilityDescEn(schemeDto.getEligibilityDescEn())
                .eligibilityDescHi(schemeDto.getEligibilityDescHi())
                .eligibilityDescTa(schemeDto.getEligibilityDescTa())
                .benefitEn(schemeDto.getBenefitEn())
                .benefitHi(schemeDto.getBenefitHi())
                .benefitTa(schemeDto.getBenefitTa())
                .benefitCalculatorExpr(schemeDto.getBenefitCalculatorExpr())
                .officialSourceUrl(schemeDto.getOfficialSourceUrl())
                .departmentEn(schemeDto.getDepartmentEn())
                .departmentHi(schemeDto.getDepartmentHi())
                .departmentTa(schemeDto.getDepartmentTa())
                .category(schemeDto.getCategory())
                .beneficiaryType(schemeDto.getBeneficiaryType())
                .isCentral(schemeDto.getIsCentral())
                .stateName(schemeDto.getStateName())
                .districtName(schemeDto.getDistrictName())
                .deadlineDate(schemeDto.getDeadlineDate())
                .status(schemeDto.getStatus())
                .build();

        Scheme saved = schemeRepository.save(scheme);
        return ResponseEntity.ok(DtoMapper.toDto(saved));
    }

    @PutMapping("/schemes/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHEME_MANAGER')")
    public ResponseEntity<?> updateScheme(@PathVariable Long id, @RequestBody SchemeDto schemeDto) {
        Scheme scheme = schemeService.getSchemeById(id, false);
        scheme.setNameEn(schemeDto.getNameEn());
        scheme.setNameHi(schemeDto.getNameHi());
        scheme.setNameTa(schemeDto.getNameTa());
        scheme.setDescriptionEn(schemeDto.getDescriptionEn());
        scheme.setDescriptionHi(schemeDto.getDescriptionHi());
        scheme.setDescriptionTa(schemeDto.getDescriptionTa());
        scheme.setEligibilityDescEn(schemeDto.getEligibilityDescEn());
        scheme.setEligibilityDescHi(schemeDto.getEligibilityDescHi());
        scheme.setEligibilityDescTa(schemeDto.getEligibilityDescTa());
        scheme.setBenefitEn(schemeDto.getBenefitEn());
        scheme.setBenefitHi(schemeDto.getBenefitHi());
        scheme.setBenefitTa(schemeDto.getBenefitTa());
        scheme.setBenefitCalculatorExpr(schemeDto.getBenefitCalculatorExpr());
        scheme.setOfficialSourceUrl(schemeDto.getOfficialSourceUrl());
        scheme.setDepartmentEn(schemeDto.getDepartmentEn());
        scheme.setDepartmentHi(schemeDto.getDepartmentHi());
        scheme.setDepartmentTa(schemeDto.getDepartmentTa());
        scheme.setCategory(schemeDto.getCategory());
        scheme.setBeneficiaryType(schemeDto.getBeneficiaryType());
        scheme.setIsCentral(schemeDto.getIsCentral());
        scheme.setStateName(schemeDto.getStateName());
        scheme.setDistrictName(schemeDto.getDistrictName());
        scheme.setDeadlineDate(schemeDto.getDeadlineDate());
        scheme.setStatus(schemeDto.getStatus());

        Scheme saved = schemeRepository.save(scheme);
        return ResponseEntity.ok(DtoMapper.toDto(saved));
    }

    @DeleteMapping("/schemes/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> deleteScheme(@PathVariable Long id) {
        Scheme scheme = schemeService.getSchemeById(id, false);
        schemeRepository.delete(scheme);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Scheme deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/schemes/{id}/rules")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHEME_MANAGER')")
    public ResponseEntity<?> addRule(@PathVariable Long id, @RequestBody RuleDto ruleDto) {
        Scheme scheme = schemeService.getSchemeById(id, false);
        EligibilityRule rule = EligibilityRule.builder()
                .scheme(scheme)
                .fieldName(ruleDto.getFieldName())
                .operator(ruleDto.getOperator())
                .ruleValue(ruleDto.getRuleValue())
                .isCritical(ruleDto.getIsCritical())
                .messageEn(ruleDto.getMessageEn())
                .messageHi(ruleDto.getMessageHi())
                .messageTa(ruleDto.getMessageTa())
                .build();

        EligibilityRule saved = eligibilityRuleRepository.save(rule);
        return ResponseEntity.ok(DtoMapper.toDto(saved));
    }

    @PostMapping("/schemes/{id}/documents")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHEME_MANAGER')")
    public ResponseEntity<?> addDocument(@PathVariable Long id, @RequestBody DocumentDto docDto) {
        Scheme scheme = schemeService.getSchemeById(id, false);
        RequiredDocument doc = RequiredDocument.builder()
                .scheme(scheme)
                .documentNameEn(docDto.getDocumentNameEn())
                .documentNameHi(docDto.getDocumentNameHi())
                .documentNameTa(docDto.getDocumentNameTa())
                .isMandatory(docDto.getIsMandatory())
                .build();

        RequiredDocument saved = requiredDocumentRepository.save(doc);
        return ResponseEntity.ok(DtoMapper.toDto(saved));
    }

    @Autowired
    private com.schemehub.backend.service.SchemeIngestionService schemeIngestionService;

    @PostMapping(value = "/schemes/batch-upload", consumes = "multipart/form-data")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHEME_MANAGER')")
    public ResponseEntity<?> uploadBatchSchemes(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        Map<String, Object> result = schemeIngestionService.importFromFile(file);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/schemes/sync-feeds")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHEME_MANAGER')")
    public ResponseEntity<?> syncExternalFeeds() {
        Map<String, Object> result = schemeIngestionService.syncExternalGovFeeds();
        return ResponseEntity.ok(result);
    }
}
