package com.schemehub.backend.controller;

import com.schemehub.backend.entity.Notification;
import com.schemehub.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications() {
        return ResponseEntity.ok(notificationService.getMyNotifications());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    // Direct helper endpoint to trigger deadline check (useful for demo/viva testing!)
    @PostMapping("/trigger-check")
    public ResponseEntity<?> triggerCheck() {
        notificationService.triggerDeadlineAlerts();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Deadline check triggered successfully.");
        return ResponseEntity.ok(response);
    }
}
