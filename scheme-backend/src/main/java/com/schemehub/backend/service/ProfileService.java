package com.schemehub.backend.service;

import com.schemehub.backend.dto.ProfileDto;
import com.schemehub.backend.entity.Profile;
import com.schemehub.backend.entity.User;
import com.schemehub.backend.exception.ResourceNotFoundException;
import com.schemehub.backend.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private AuthService authService;

    public Profile getProfileOfCurrentUser() {
        User user = authService.getCurrentUser();
        return profileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Profile profile = Profile.builder()
                            .user(user)
                            .build();
                    return profileRepository.save(profile);
                });
    }

    @Transactional
    public Profile updateProfile(ProfileDto profileDto) {
        Profile profile = getProfileOfCurrentUser();

        profile.setAge(profileDto.getAge());
        profile.setGender(profileDto.getGender());
        profile.setState(profileDto.getState());
        profile.setDistrict(profileDto.getDistrict());
        profile.setAnnualIncome(profileDto.getAnnualIncome());
        profile.setOccupation(profileDto.getOccupation());
        profile.setEducation(profileDto.getEducation());
        profile.setCaste(profileDto.getCaste());
        profile.setDisabilityStatus(profileDto.getDisabilityStatus());
        profile.setDisabilityDetails(profileDto.getDisabilityDetails());
        profile.setFamilyMembers(profileDto.getFamilyMembers());
        profile.setIsFarmer(profileDto.getIsFarmer());
        profile.setIsStudent(profileDto.getIsStudent());
        profile.setIsBusinessOwner(profileDto.getIsBusinessOwner());

        return profileRepository.save(profile);
    }
}
