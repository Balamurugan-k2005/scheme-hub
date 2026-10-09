package com.schemehub.backend.controller;

import com.schemehub.backend.dto.SchemeDto;
import com.schemehub.backend.dto.SchemeResponseDto;
import com.schemehub.backend.entity.Scheme;
import com.schemehub.backend.mapper.DtoMapper;
import com.schemehub.backend.service.RuleEngineService;
import com.schemehub.backend.service.SchemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
public class SchemeController {

    @Autowired
    private SchemeService schemeService;

    @GetMapping("/public/search")
    public ResponseEntity<?> searchSchemes(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String beneficiary,
            @RequestParam(required = false) Boolean isCentral,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "viewsCount") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<SchemeDto> result = schemeService.searchSchemes(query, state, category, beneficiary, isCentral, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSchemeDetails(@PathVariable Long id) {
        Scheme scheme = schemeService.getSchemeById(id, true);
        return ResponseEntity.ok(DtoMapper.toDto(scheme));
    }

    @GetMapping("/public/compare")
    public ResponseEntity<?> compareSchemes(@RequestParam List<Long> ids) {
        List<SchemeDto> comparison = schemeService.compareSchemes(ids);
        return ResponseEntity.ok(comparison);
    }

    @GetMapping("/recommend")
    public ResponseEntity<?> getRecommendations(@RequestParam(defaultValue = "en") String lang) {
        List<SchemeResponseDto> recommended = schemeService.getPersonalizedRecommendations(lang);
        return ResponseEntity.ok(recommended);
    }

    @GetMapping("/{id}/evaluate")
    public ResponseEntity<?> evaluateScheme(@PathVariable Long id, @RequestParam(defaultValue = "en") String lang) {
        RuleEngineService.EvaluationResult result = schemeService.evaluateSchemeForUser(id, lang);
        return ResponseEntity.ok(result);
    }
}
