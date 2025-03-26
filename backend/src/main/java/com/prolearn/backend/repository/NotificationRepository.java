package com.prolearn.backend.repository;

import com.prolearn.backend.model.Notification;
import com.prolearn.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByRecipientOrderByCreatedAtDesc(User recipient, Pageable pageable);
    long countByRecipientAndReadFalse(User recipient);
}