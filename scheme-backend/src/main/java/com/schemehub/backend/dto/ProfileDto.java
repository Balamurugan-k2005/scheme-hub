package com.schemehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDto {
    private Integer age;
    private String gender;
    private String state;
    private String district;
    private Double annualIncome;
    private String occupation;
    private String education;
    private String caste;
    private Boolean disabilityStatus;
    private String disabilityDetails;
    private Integer familyMembers;
    private Boolean isFarmer;
    private Boolean isStudent;
    private Boolean isBusinessOwner;
}
