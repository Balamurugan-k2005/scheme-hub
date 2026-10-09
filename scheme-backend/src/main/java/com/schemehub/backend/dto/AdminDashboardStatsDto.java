package com.schemehub.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class AdminDashboardStatsDto {
    private long totalSchemes;
    private long activeSchemes;
    private long pendingReports;
    private long registeredUsers;
    private long totalApplications;
    private Map<String, Long> schemesByCategory;
    private Map<String, Long> schemesByState;
    private Map<String, Long> applicationsByStatus;
}
