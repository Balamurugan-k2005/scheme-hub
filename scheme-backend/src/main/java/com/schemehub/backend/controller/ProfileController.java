package com.schemehub.backend.controller;

import com.schemehub.backend.dto.ProfileDto;
import com.schemehub.backend.entity.Profile;
import com.schemehub.backend.mapper.DtoMapper;
import com.schemehub.backend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public ResponseEntity<?> getProfile() {
        Profile profile = profileService.getProfileOfCurrentUser();
        return ResponseEntity.ok(DtoMapper.toDto(profile));
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody ProfileDto profileDto) {
        Profile updated = profileService.updateProfile(profileDto);
        return ResponseEntity.ok(DtoMapper.toDto(updated));
    }
}
