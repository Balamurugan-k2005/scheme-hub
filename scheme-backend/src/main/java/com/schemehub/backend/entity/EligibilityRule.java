package com.schemehub.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "eligibility_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EligibilityRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    @JsonIgnore
    private Scheme scheme;

    @Column(name = "field_name", nullable = false)
    private String fieldName; // e.g. age, state, annualIncome, caste, gender, occupation, disabilityStatus, isFarmer, isStudent, isBusinessOwner

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RuleOperator operator; // GTE, LTE, EQ, IN, NEQ

    @Column(name = "rule_value", nullable = false)
    private String ruleValue; // e.g. "18", "TN", "SC,ST", "FEMALE"

    @Column(name = "is_critical", nullable = false)
    private Boolean isCritical; // true = fails the scheme entirely, false = reduces match score

    // Localized failure messages for explanatory outputs
    @Column(name = "message_en")
    private String messageEn;
    
    @Column(name = "message_hi")
    private String messageHi;
    
    @Column(name = "message_ta")
    private String messageTa;
}
