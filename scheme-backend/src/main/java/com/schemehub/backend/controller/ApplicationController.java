package com.schemehub.backend.controller;

import com.schemehub.backend.dto.ApplicationDetailsResponseDto;
import com.schemehub.backend.entity.ApplicationStatus;
import com.schemehub.backend.entity.UserDocument;
import com.schemehub.backend.exception.BadRequestException;
import com.schemehub.backend.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<List<ApplicationDetailsResponseDto>> getApplications() {
        List<ApplicationDetailsResponseDto> apps = applicationService.getApplications();
        return ResponseEntity.ok(apps);
    }

    @PostMapping("/save/{schemeId}")
    public ResponseEntity<ApplicationDetailsResponseDto> saveScheme(@PathVariable Long schemeId) {
        ApplicationDetailsResponseDto saved = applicationService.saveScheme(schemeId);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationDetailsResponseDto> updateStatus(
            @PathVariable Long id, 
            @RequestParam ApplicationStatus status) {
        ApplicationDetailsResponseDto updated = applicationService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/details")
    public ResponseEntity<ApplicationDetailsResponseDto> updateDetails(
            @PathVariable Long id,
            @RequestParam(required = false) String referenceId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String notes) {
        ApplicationDetailsResponseDto updated = applicationService.updateDetails(id, referenceId, date, notes);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/documents/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType) {
        try {
            UserDocument userDoc = applicationService.uploadFile(file, documentType);
            return ResponseEntity.ok(userDoc);
        } catch (IOException e) {
            throw new BadRequestException("Failed to upload document: " + e.getMessage());
        }
    }

    @GetMapping("/documents")
    public ResponseEntity<List<UserDocument>> getUserDocuments() {
        List<UserDocument> docs = applicationService.getUserDocuments();
        return ResponseEntity.ok(docs);
    }
}
