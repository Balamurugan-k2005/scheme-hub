package com.schemehub.backend.service;

import com.schemehub.backend.dto.*;
import com.schemehub.backend.entity.*;
import com.schemehub.backend.exception.ResourceNotFoundException;
import com.schemehub.backend.mapper.DtoMapper;
import com.schemehub.backend.repository.SchemeRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchemeService {

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private RuleEngineService ruleEngineService;

    @Transactional
    public Scheme getSchemeById(Long id, boolean incrementViews) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with id: " + id));
        if (incrementViews) {
            scheme.setViewsCount(scheme.getViewsCount() + 1);
            schemeRepository.save(scheme);
        }
        return scheme;
    }

    @Transactional(readOnly = true)
    public Page<SchemeDto> searchSchemes(String query, String state, String category,
                                         String beneficiary, Boolean isCentral, Pageable pageable) {
        Specification<Scheme> spec = getSearchSpecification(query, state, category, beneficiary, isCentral);
        Page<Scheme> schemes = schemeRepository.findAll(spec, pageable);
        return schemes.map(DtoMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<SchemeResponseDto> getPersonalizedRecommendations(String lang) {
        Profile profile = null;
        try {
            profile = profileService.getProfileOfCurrentUser();
        } catch (Exception e) {
            // User might be guest or doesn't have a profile yet; return empty or un-evaluated schemes
        }

        List<Scheme> allSchemes = schemeRepository.findAll();
        List<SchemeResponseDto> recommendations = new ArrayList<>();

        for (Scheme scheme : allSchemes) {
            RuleEngineService.EvaluationResult eval = ruleEngineService.evaluate(profile, scheme, lang);
            // Recommend schemes where they are eligible (or potentially eligible with missing profile details)
            if (eval.isEligible()) {
                recommendations.add(SchemeResponseDto.builder()
                        .scheme(DtoMapper.toDto(scheme))
                        .evaluation(eval)
                        .build());
            }
        }

        // Sort by match percentage descending
        recommendations.sort((a, b) -> Integer.compare(b.getEvaluation().getMatchPercentage(), a.getEvaluation().getMatchPercentage()));

        return recommendations;
    }

    @Transactional(readOnly = true)
    public RuleEngineService.EvaluationResult evaluateSchemeForUser(Long schemeId, String lang) {
        Scheme scheme = getSchemeById(schemeId, false);
        Profile profile = profileService.getProfileOfCurrentUser();
        return ruleEngineService.evaluate(profile, scheme, lang);
    }

    @Transactional(readOnly = true)
    public List<SchemeDto> compareSchemes(List<Long> ids) {
        List<Scheme> schemes = schemeRepository.findAllById(ids);
        return schemes.stream().map(DtoMapper::toDto).collect(Collectors.toList());
    }

    private Specification<Scheme> getSearchSpecification(String query, String state, String category,
                                                          String beneficiary, Boolean isCentral) {
        return (root, criteriaQuery, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (query != null && !query.isEmpty()) {
                String wildCard = "%" + query.toLowerCase() + "%";
                Predicate nameEn = builder.like(builder.lower(root.get("nameEn")), wildCard);
                Predicate nameHi = builder.like(builder.lower(root.get("nameHi")), wildCard);
                Predicate nameTa = builder.like(builder.lower(root.get("nameTa")), wildCard);
                predicates.add(builder.or(nameEn, nameHi, nameTa));
            }

            if (state != null && !state.isEmpty()) {
                if ("central".equalsIgnoreCase(state)) {
                    predicates.add(builder.isNull(root.get("stateName")));
                } else if (!"all".equalsIgnoreCase(state)) {
                    // Match StateName OR Central schemes (central schemes are open to all states)
                    predicates.add(builder.or(
                            builder.isNull(root.get("stateName")),
                            builder.equal(builder.lower(root.get("stateName")), state.toLowerCase())
                    ));
                }
            }

            if (category != null && !category.isEmpty() && !"all".equalsIgnoreCase(category)) {
                predicates.add(builder.equal(root.get("category"), category.toUpperCase()));
            }

            if (beneficiary != null && !beneficiary.isEmpty() && !"all".equalsIgnoreCase(beneficiary)) {
                predicates.add(builder.equal(root.get("beneficiaryType"), beneficiary.toUpperCase()));
            }

            if (isCentral != null) {
                predicates.add(builder.equal(root.get("isCentral"), isCentral));
            }

            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
