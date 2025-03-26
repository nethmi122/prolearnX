package com.prolearn.backend.service;

import com.prolearn.backend.model.Notification;
import com.prolearn.backend.model.User;
import com.prolearn.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification createNotification(User recipient, User actor, Notification.NotificationType type, String entityId) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setActor(actor);
        notification.setType(type);
        notification.setEntityId(entityId);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        
        return notificationRepository.save(notification);
    }
}