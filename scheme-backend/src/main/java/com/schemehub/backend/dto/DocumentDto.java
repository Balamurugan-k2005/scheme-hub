package com.schemehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDto {
    private Long id;
    private String documentNameEn;
    private String documentNameHi;
    private String documentNameTa;
    private Boolean isMandatory;
}
