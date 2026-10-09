package com.schemehub.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Integer age;
    private String gender; // MALE, FEMALE, TRANSGENDER, OTHER
    private String state;
    private String district;
    
    @Column(name = "annual_income")
    private Double annualIncome;
    
    private String occupation; // STUDENT, FARMER, BUSINESS, UNEMPLOYED, RETIRED, OTHER
    private String education; // BELOW_MATRIC, MATRIC, HIGHER_SECONDARY, GRADUATE, POST_GRADUATE
    private String caste; // GENERAL, OBC, SC, ST
    
    @Column(name = "disability_status")
    private Boolean disabilityStatus;
    
    @Column(name = "disability_details")
    private String disabilityDetails;
    
    @Column(name = "family_members")
    private Integer familyMembers;
    
    @Column(name = "is_farmer")
    private Boolean isFarmer;
    
    @Column(name = "is_student")
    private Boolean isStudent;
    
    @Column(name = "is_business_owner")
    private Boolean isBusinessOwner;
}
