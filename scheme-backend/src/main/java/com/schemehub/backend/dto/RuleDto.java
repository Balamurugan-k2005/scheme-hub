package com.schemehub.backend.dto;

import com.schemehub.backend.entity.RuleOperator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RuleDto {
    private Long id;
    private String fieldName;
    private RuleOperator operator;
    private String ruleValue;
    private Boolean isCritical;
    private String messageEn;
    private String messageHi;
    private String messageTa;
}
