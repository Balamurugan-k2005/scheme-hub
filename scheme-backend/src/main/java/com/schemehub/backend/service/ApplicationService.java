package com.schemehub.backend.service;

import com.schemehub.backend.dto.ApplicationDetailsResponseDto;
import com.schemehub.backend.dto.ChecklistItemDto;
import com.schemehub.backend.entity.*;
import com.schemehub.backend.exception.BadRequestException;
import com.schemehub.backend.exception.ResourceNotFoundException;
import com.schemehub.backend.mapper.DtoMapper;
import com.schemehub.backend.repository.ApplicationRepository;
import com.schemehub.backend.repository.SchemeRepository;
import com.schemehub.backend.repository.UserDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private UserDocumentRepository userDocumentRepository;

    @Autowired
    private AuthService authService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public ApplicationDetailsResponseDto saveScheme(Long schemeId) {
        User user = authService.getCurrentUser();
        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with id: " + schemeId));

        Optional<Application> existing = applicationRepository.findByUserIdAndSchemeId(user.getId(), schemeId);
        Application app;
        if (existing.isPresent()) {
            app = existing.get();
        } else {
            app = Application.builder()
                    .user(user)
                    .scheme(scheme)
                    .status(ApplicationStatus.SAVED)
                    .build();
            app = applicationRepository.save(app);
        }
        return getApplicationDetails(app, user.getId());
    }

    public ApplicationDetailsResponseDto updateStatus(Long id, ApplicationStatus status) {
        User user = authService.getCurrentUser();
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application record not found with id: " + id));

        if (!app.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to this application record.");
        }

        app.setStatus(status);
        app = applicationRepository.save(app);
        return getApplicationDetails(app, user.getId());
    }

    public ApplicationDetailsResponseDto updateDetails(Long id, String referenceId, LocalDate date, String notes) {
        User user = authService.getCurrentUser();
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application record not found with id: " + id));

        if (!app.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to this application record.");
        }

        app.setReferenceId(referenceId);
        app.setApplicationDate(date);
        app.setNotes(notes);
        
        app = applicationRepository.save(app);
        return getApplicationDetails(app, user.getId());
    }

    @Transactional(readOnly = true)
    public List<ApplicationDetailsResponseDto> getApplications() {
        User user = authService.getCurrentUser();
        List<Application> apps = applicationRepository.findByUserId(user.getId());
        if (apps == null) {
            return Collections.emptyList();
        }
        return apps.stream()
                .map(app -> getApplicationDetails(app, user.getId()))
                .collect(Collectors.toList());
    }

    public UserDocument uploadFile(MultipartFile file, String documentType) throws IOException {
        User user = authService.getCurrentUser();
        
        if (file.isEmpty()) {
            throw new BadRequestException("Cannot upload empty file.");
        }

        // Create directory if not exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate clean unique filename
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = "";
        int i = originalFilename.lastIndexOf('.');
        if (i > 0) {
            fileExtension = originalFilename.substring(i);
        }
        
        String cleanFilename = user.getId() + "_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + fileExtension;
        Path targetLocation = uploadPath.resolve(cleanFilename);
        
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Check if user already uploaded this document type, overwrite metadata or create new
        Optional<UserDocument> existing = userDocumentRepository.findByUserIdAndDocumentType(user.getId(), documentType);
        UserDocument doc;
        if (existing.isPresent()) {
            doc = existing.get();
            try {
                Files.deleteIfExists(uploadPath.resolve(doc.getFileName()));
            } catch (Exception e) {
                // ignore disk delete failure
            }
            doc.setFileName(cleanFilename);
            doc.setFilePath("/uploads/" + cleanFilename);
            doc.setUploadedAt(LocalDateTime.now());
        } else {
            doc = UserDocument.builder()
                    .user(user)
                    .documentType(documentType)
                    .fileName(cleanFilename)
                    .filePath("/uploads/" + cleanFilename)
                    .build();
        }

        return userDocumentRepository.save(doc);
    }

    @Transactional(readOnly = true)
    public List<UserDocument> getUserDocuments() {
        User user = authService.getCurrentUser();
        return userDocumentRepository.findByUserId(user.getId());
    }

    private ApplicationDetailsResponseDto getApplicationDetails(Application app, Long userId) {
        List<UserDocument> uploadedDocs = userDocumentRepository.findByUserId(userId);
        if (uploadedDocs == null) {
            uploadedDocs = Collections.emptyList();
        }

        List<RequiredDocument> reqDocs = (app.getScheme() != null && app.getScheme().getRequiredDocuments() != null)
                ? app.getScheme().getRequiredDocuments()
                : Collections.emptyList();
        
        List<ChecklistItemDto> checklist = new ArrayList<>();
        for (RequiredDocument rd : reqDocs) {
            // Check if user uploaded a document matching this required document name
            List<UserDocument> finalUploadedDocs = uploadedDocs;
            Optional<UserDocument> match = finalUploadedDocs.stream()
                    .filter(ud -> ud.getDocumentType() != null && (
                            (rd.getDocumentNameEn() != null && ud.getDocumentType().equalsIgnoreCase(rd.getDocumentNameEn())) ||
                            (rd.getDocumentNameHi() != null && ud.getDocumentType().equalsIgnoreCase(rd.getDocumentNameHi())) ||
                            (rd.getDocumentNameTa() != null && ud.getDocumentType().equalsIgnoreCase(rd.getDocumentNameTa()))
                    ))
                    .findFirst();

            checklist.add(ChecklistItemDto.builder()
                    .documentNameEn(rd.getDocumentNameEn())
                    .documentNameHi(rd.getDocumentNameHi())
                    .documentNameTa(rd.getDocumentNameTa())
                    .mandatory(rd.getIsMandatory() != null ? rd.getIsMandatory() : true)
                    .uploaded(match.isPresent())
                    .fileUrl(match.map(UserDocument::getFilePath).orElse(null))
                    .build());
        }

        return ApplicationDetailsResponseDto.builder()
                .id(app.getId())
                .scheme(app.getScheme() != null ? DtoMapper.toDto(app.getScheme()) : null)
                .status(app.getStatus())
                .referenceId(app.getReferenceId())
                .applicationDate(app.getApplicationDate())
                .notes(app.getNotes())
                .checklist(checklist)
                .build();
    }
}
