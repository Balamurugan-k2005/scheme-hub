package com.schemehub.backend.dto;

import com.schemehub.backend.entity.ReportType;
import lombok.Data;

@Data
public class ReportRequestDto {
    private Long schemeId;
    private ReportType reportType;
    private String comments;
}
