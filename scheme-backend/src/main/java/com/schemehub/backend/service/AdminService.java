package com.schemehub.backend.service;

import com.schemehub.backend.dto.AdminDashboardStatsDto;
import com.schemehub.backend.entity.*;
import com.schemehub.backend.exception.ResourceNotFoundException;
import com.schemehub.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserReportRepository userReportRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private AuthService authService;

    public AdminDashboardStatsDto getDashboardStats() {
        long totalSchemes = schemeRepository.count();
        long activeSchemes = schemeRepository.findAll().stream()
                .filter(s -> "OPEN".equalsIgnoreCase(s.getStatus()))
                .count();
        long pendingReports = userReportRepository.countByStatus("PENDING");
        long registeredUsers = userRepository.count();
        long totalApplications = applicationRepository.count();

        // category breakdown
        Map<String, Long> categoryMap = new HashMap<>();
        schemeRepository.countSchemesByCategory().forEach(row -> {
            categoryMap.put((String) row[0], (Long) row[1]);
        });

        // state breakdown
        Map<String, Long> stateMap = new HashMap<>();
        schemeRepository.countSchemesByState().forEach(row -> {
            stateMap.put((String) row[0], (Long) row[1]);
        });

        // application status breakdown
        Map<String, Long> statusMap = new HashMap<>();
        applicationRepository.countApplicationsByStatus().forEach(row -> {
            ApplicationStatus status = (ApplicationStatus) row[0];
            statusMap.put(status.name(), (Long) row[1]);
        });

        return AdminDashboardStatsDto.builder()
                .totalSchemes(totalSchemes)
                .activeSchemes(activeSchemes)
                .pendingReports(pendingReports)
                .registeredUsers(registeredUsers)
                .totalApplications(totalApplications)
                .schemesByCategory(categoryMap)
                .schemesByState(stateMap)
                .applicationsByStatus(statusMap)
                .build();
    }

    @Transactional
    public Scheme verifyScheme(Long schemeId, VerifiedStatus status) {
        User admin = authService.getCurrentUser();
        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with id: " + schemeId));

        scheme.setVerifiedStatus(status);
        scheme.setLastVerifiedAt(LocalDateTime.now());
        scheme.setVerifiedBy(admin);

        return schemeRepository.save(scheme);
    }

    @Transactional
    public UserReport createReport(Long schemeId, ReportType type, String comments) {
        User user = authService.getCurrentUser();
        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));

        UserReport report = UserReport.builder()
                .user(user)
                .scheme(scheme)
                .reportType(type)
                .comments(comments)
                .status("PENDING")
                .build();

        return userReportRepository.save(report);
    }

    public List<UserReport> getAllReports() {
        return userReportRepository.findAll();
    }

    @Transactional
    public UserReport resolveReport(Long reportId) {
        UserReport report = userReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        report.setStatus("RESOLVED");
        return userReportRepository.save(report);
    }
}
