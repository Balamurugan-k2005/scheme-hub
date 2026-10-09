package com.schemehub.backend.service;

import com.schemehub.backend.entity.Application;
import com.schemehub.backend.entity.Notification;
import com.schemehub.backend.entity.User;
import com.schemehub.backend.exception.ResourceNotFoundException;
import com.schemehub.backend.repository.ApplicationRepository;
import com.schemehub.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private AuthService authService;

    public List<Notification> getMyNotifications() {
        User user = authService.getCurrentUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional
    public Notification markAsRead(Long id) {
        User user = authService.getCurrentUser();
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        if (!notif.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found for this user.");
        }
        notif.setIsRead(true);
        return notificationRepository.save(notif);
    }

    @Transactional
    public void createNotification(User user, String title, String message, String type) {
        Notification notif = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        notificationRepository.save(notif);
    }

    // Cron expression: runs every day at 9:00 AM
    @Scheduled(cron = "0 0 9 * * ?")
    @Transactional
    public void triggerDeadlineAlerts() {
        List<Application> activeApplications = applicationRepository.findAll();
        LocalDate today = LocalDate.now();

        for (Application app : activeApplications) {
            LocalDate deadline = app.getScheme().getDeadlineDate();
            if (deadline != null && deadline.isAfter(today.minusDays(1))) {
                long daysRemaining = ChronoUnit.DAYS.between(today, deadline);
                
                // Only alert if deadline is within 5 days and status is not yet submitted
                if (daysRemaining <= 5 && app.getStatus().ordinal() < 3) { // 3 is SUBMITTED
                    String title = "⚠ Application deadline approaching!";
                    String msg = String.format("Your saved scheme '%s' has a deadline approaching. Only %d days remaining (Closes on %s).",
                            app.getScheme().getNameEn(), daysRemaining, deadline.toString());

                    // Check if notification already exists to avoid spamming the user
                    boolean alreadyNotified = notificationRepository.findByUserIdOrderByCreatedAtDesc(app.getUser().getId()).stream()
                            .anyMatch(n -> n.getType().equals("DEADLINE") && n.getMessage().contains(app.getScheme().getNameEn()));

                    if (!alreadyNotified) {
                        createNotification(app.getUser(), title, msg, "DEADLINE");
                    }
                }
            }
        }
    }
}
