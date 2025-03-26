package com.prolearn.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {
    
    @NotBlank(message = "Comment content is required")
    @Size(max = 500, message = "Comment must be less than 500 characters")
    private String content;
}