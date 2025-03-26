package com.prolearn.backend.dto;

import com.prolearn.backend.model.PostCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String title;
    private String description;
    private PostCategory category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String owner;
    private String ownerDisplayName;
    private String ownerProfilePicture;
    private List<MediaDTO> media;
    private int likesCount;
    private int commentsCount;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MediaDTO {
        private Long id;
        private String url;
        private String type;
    }
}