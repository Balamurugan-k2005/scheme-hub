package com.schemehub.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "schemes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Localized Scheme Names
    @Column(name = "name_en", nullable = false)
    private String nameEn;
    @Column(name = "name_hi")
    private String nameHi;
    @Column(name = "name_ta")
    private String nameTa;

    // Localized Descriptions
    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;
    @Column(name = "description_hi", columnDefinition = "TEXT")
    private String descriptionHi;
    @Column(name = "description_ta", columnDefinition = "TEXT")
    private String descriptionTa;

    // Localized Eligibility Summary
    @Column(name = "eligibility_desc_en", columnDefinition = "TEXT")
    private String eligibilityDescEn;
    @Column(name = "eligibility_desc_hi", columnDefinition = "TEXT")
    private String eligibilityDescHi;
    @Column(name = "eligibility_desc_ta", columnDefinition = "TEXT")
    private String eligibilityDescTa;

    // Localized Benefit details
    @Column(name = "benefit_en")
    private String benefitEn;
    @Column(name = "benefit_hi")
    private String benefitHi;
    @Column(name = "benefit_ta")
    private String benefitTa;

    @Column(name = "benefit_calculator_expr")
    private String benefitCalculatorExpr;

    @Column(name = "official_source_url")
    private String officialSourceUrl;

    @Column(name = "last_verified_at")
    private LocalDateTime lastVerifiedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "verified_status", nullable = false)
    private VerifiedStatus verifiedStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by_id")
    private User verifiedBy;

    // Localized Department Names
    @Column(name = "department_en")
    private String departmentEn;
    @Column(name = "department_hi")
    private String departmentHi;
    @Column(name = "department_ta")
    private String departmentTa;

    // Constants or keys for category/beneficiary
    @Column(nullable = false)
    private String category; // EDUCATION, AGRICULTURE, HEALTH, HOUSING, FINANCIAL

    @Column(name = "beneficiary_type", nullable = false)
    private String beneficiaryType; // STUDENTS, FARMERS, WOMEN, SENIOR_CITIZENS, ALL

    @Column(name = "is_central", nullable = false)
    private Boolean isCentral;

    @Column(name = "state_name")
    private String stateName; // Optional (null for central)

    @Column(name = "district_name")
    private String districtName; // Optional local schemes

    @Column(name = "deadline_date")
    private LocalDate deadlineDate;

    @Column(nullable = false)
    private String status; // OPEN, CLOSED, OPENING_SOON

    @Column(name = "views_count", nullable = false)
    private Integer viewsCount;

    @OneToMany(mappedBy = "scheme", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<EligibilityRule> rules = new ArrayList<>();

    @OneToMany(mappedBy = "scheme", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<RequiredDocument> requiredDocuments = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (viewsCount == null) {
            viewsCount = 0;
        }
        if (verifiedStatus == null) {
            verifiedStatus = VerifiedStatus.NEEDS_REVIEW;
        }
    }
}
