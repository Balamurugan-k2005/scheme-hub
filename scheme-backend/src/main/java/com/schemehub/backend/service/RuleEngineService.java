package com.schemehub.backend.service;

import com.schemehub.backend.entity.*;
import lombok.*;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class RuleEngineService {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EvaluationResult {
        private boolean eligible;
        private int matchPercentage;
        private List<String> passedRules;
        private List<String> failedRules;
        private List<String> missingFields;
        private Double calculatedBenefit;
    }

    public EvaluationResult evaluate(Profile profile, Scheme scheme, String lang) {
        List<EligibilityRule> rules = scheme.getRules();
        
        List<String> passed = new ArrayList<>();
        List<String> failed = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        boolean failedCriticalRule = false;
        int totalRules = rules.size();
        int passedCount = 0;

        if (totalRules == 0) {
            return EvaluationResult.builder()
                    .eligible(true)
                    .matchPercentage(100)
                    .passedRules(passed)
                    .failedRules(failed)
                    .missingFields(missing)
                    .calculatedBenefit(calculateBenefit(profile, scheme))
                    .build();
        }

        for (EligibilityRule rule : rules) {
            Object userValue = getUserProfileValue(profile, rule.getFieldName());
            String ruleMsg = getLocalizedRuleMessage(rule, lang);

            if (userValue == null) {
                // Profile field is blank - unknown info
                missing.add(getLocalizedMissingMessage(rule.getFieldName(), lang));
                continue;
            }

            boolean isMatch = evaluateCondition(userValue, rule.getOperator(), rule.getRuleValue());

            if (isMatch) {
                passedCount++;
                passed.add(ruleMsg);
            } else {
                if (rule.getIsCritical()) {
                    failedCriticalRule = true;
                }
                failed.add(ruleMsg);
            }
        }

        boolean eligible = !failedCriticalRule;
        int matchPercentage = 0;

        if (eligible) {
            matchPercentage = (int) Math.round(((double) passedCount / totalRules) * 100);
            // Cap match percentage if there are missing details
            if (!missing.isEmpty() && matchPercentage > 85) {
                matchPercentage = 85;
            }
        } else {
            matchPercentage = 0;
        }

        Double calculatedBenefit = calculateBenefit(profile, scheme);

        return EvaluationResult.builder()
                .eligible(eligible)
                .matchPercentage(matchPercentage)
                .passedRules(passed)
                .failedRules(failed)
                .missingFields(missing)
                .calculatedBenefit(calculatedBenefit)
                .build();
    }

    public Double calculateBenefit(Profile profile, Scheme scheme) {
        if (scheme.getBenefitCalculatorExpr() == null || scheme.getBenefitCalculatorExpr().isEmpty()) {
            return null;
        }
        try {
            ExpressionParser parser = new SpelExpressionParser();
            Expression exp = parser.parseExpression(scheme.getBenefitCalculatorExpr());
            EvaluationContext context = new StandardEvaluationContext();
            
            if (profile != null) {
                context.setVariable("annualIncome", profile.getAnnualIncome() != null ? profile.getAnnualIncome() : 0.0);
                context.setVariable("age", profile.getAge() != null ? profile.getAge() : 0);
                context.setVariable("familyMembers", profile.getFamilyMembers() != null ? profile.getFamilyMembers() : 0);
                context.setVariable("isStudent", profile.getIsStudent() != null ? profile.getIsStudent() : false);
                context.setVariable("isFarmer", profile.getIsFarmer() != null ? profile.getIsFarmer() : false);
            } else {
                context.setVariable("annualIncome", 0.0);
                context.setVariable("age", 0);
                context.setVariable("familyMembers", 0);
                context.setVariable("isStudent", false);
                context.setVariable("isFarmer", false);
            }

            return exp.getValue(context, Double.class);
        } catch (Exception e) {
            // Fallback: parse as static value
            try {
                return Double.parseDouble(scheme.getBenefitCalculatorExpr());
            } catch (NumberFormatException nfe) {
                return null;
            }
        }
    }

    private Object getUserProfileValue(Profile profile, String fieldName) {
        if (profile == null) return null;
        return switch (fieldName) {
            case "age" -> profile.getAge();
            case "gender" -> profile.getGender();
            case "state" -> profile.getState();
            case "district" -> profile.getDistrict();
            case "annualIncome" -> profile.getAnnualIncome();
            case "occupation" -> profile.getOccupation();
            case "education" -> profile.getEducation();
            case "caste" -> profile.getCaste();
            case "disabilityStatus" -> profile.getDisabilityStatus();
            case "isFarmer" -> profile.getIsFarmer();
            case "isStudent" -> profile.getIsStudent();
            case "isBusinessOwner" -> profile.getIsBusinessOwner();
            default -> null;
        };
    }

    private boolean evaluateCondition(Object userValue, RuleOperator operator, String ruleValue) {
        try {
            if (operator == RuleOperator.EQ) {
                return userValue.toString().equalsIgnoreCase(ruleValue);
            } else if (operator == RuleOperator.NEQ) {
                return !userValue.toString().equalsIgnoreCase(ruleValue);
            } else if (operator == RuleOperator.IN) {
                String[] values = ruleValue.split(",");
                return Arrays.stream(values)
                        .map(String::trim)
                        .anyMatch(v -> v.equalsIgnoreCase(userValue.toString()));
            } else {
                double userDouble = Double.parseDouble(userValue.toString());
                double ruleDouble = Double.parseDouble(ruleValue);
                if (operator == RuleOperator.GTE) {
                    return userDouble >= ruleDouble;
                } else if (operator == RuleOperator.LTE) {
                    return userDouble <= ruleDouble;
                }
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }

    private String getLocalizedRuleMessage(EligibilityRule rule, String lang) {
        if ("ta".equalsIgnoreCase(lang) && rule.getMessageTa() != null) {
            return rule.getMessageTa();
        }
        if ("hi".equalsIgnoreCase(lang) && rule.getMessageHi() != null) {
            return rule.getMessageHi();
        }
        return rule.getMessageEn() != null ? rule.getMessageEn() : "Rule requirement checked.";
    }

    private String getLocalizedMissingMessage(String fieldName, String lang) {
        boolean isTa = "ta".equalsIgnoreCase(lang);
        boolean isHi = "hi".equalsIgnoreCase(lang);

        return switch (fieldName) {
            case "age" -> isTa ? "வயது விவரங்கள் இல்லை" : isHi ? "आयु की जानकारी गायब है" : "Age information is missing";
            case "gender" -> isTa ? "பாலின விவரங்கள் இல்லை" : isHi ? "लिंग की जानकारी गायब है" : "Gender details missing";
            case "state" -> isTa ? "மாநில விவரங்கள் இல்லை" : isHi ? "राज्य की जानकारी गायब है" : "State residency info missing";
            case "annualIncome" -> isTa ? "வருமான விவரங்கள் இல்லை" : isHi ? "वार्षिक आय की जानकारी गायब है" : "Annual income details missing";
            case "occupation" -> isTa ? "வேலைவாய்ப்பு விவரங்கள் இல்லை" : isHi ? "व्यवसाय की जानकारी गायब है" : "Occupation details missing";
            case "caste" -> isTa ? "சமூகப் பிரிவு விவரங்கள் இல்லை" : isHi ? "जाति/श्रेणी की जानकारी गायब है" : "Caste/category details missing";
            case "isFarmer" -> isTa ? "விவசாயி நிலை தெரியவில்லை" : isHi ? "किसान होने की स्थिति अज्ञात है" : "Farmer status unknown";
            case "isStudent" -> isTa ? "மாணவர் நிலை தெரியவில்லை" : isHi ? "छात्र होने की स्थिति अज्ञात है" : "Student status unknown";
            default -> isTa ? "விவரங்கள் பூர்த்தி செய்யப்படவில்லை" : isHi ? "अतिरिक्त जानकारी गायब है" : "Additional profile information required";
        };
    }
}
