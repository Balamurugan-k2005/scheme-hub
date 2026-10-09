package com.schemehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChecklistItemDto {
    private String documentNameEn;
    private String documentNameHi;
    private String documentNameTa;
    private boolean mandatory;
    private boolean uploaded;
    private String fileUrl;
}
