package com.prolearn.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "post_media")
public class PostMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
    
    @Column(nullable = false)
    private String mediaUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MediaType type;
    
    public enum MediaType {
        IMAGE,
        VIDEO
    }
}