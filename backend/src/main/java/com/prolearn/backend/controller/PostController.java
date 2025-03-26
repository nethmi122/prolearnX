package com.prolearn.backend.controller;

import com.prolearn.backend.dto.CommentRequest;
import com.prolearn.backend.dto.CommentResponse;
import com.prolearn.backend.dto.PostRequest;
import com.prolearn.backend.dto.PostResponse;
import com.prolearn.backend.model.PostCategory;
import com.prolearn.backend.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getAllPosts(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(postService.getAllPosts(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<PostResponse>> getPostsByCategory(
            @PathVariable PostCategory category,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(postService.getPostsByCategory(category, pageable));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponse> createPost(
            @RequestPart("post") @Valid PostRequest postRequest,
            @RequestPart(value = "media", required = false) List<MultipartFile> mediaFiles,
            Authentication authentication) {
        PostResponse createdPost = postService.createPost(postRequest, mediaFiles, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @RequestPart("post") @Valid PostRequest postRequest,
            @RequestPart(value = "newMedia", required = false) List<MultipartFile> newMediaFiles,
            @RequestParam(value = "retainMediaIds", required = false) List<Long> retainMediaIds,
            Authentication authentication) {
        PostResponse updatedPost = postService.updatePost(id, postRequest, newMediaFiles, retainMediaIds, authentication.getName());
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            Authentication authentication) {
        postService.deletePost(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> likePost(
            @PathVariable Long postId,
            Authentication authentication) {
        postService.likePost(postId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<Void> unlikePost(
            @PathVariable Long postId,
            Authentication authentication) {
        postService.unlikePost(postId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long postId,
            @RequestBody @Valid CommentRequest commentRequest,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(postService.addComment(postId, commentRequest.getContent(), authentication.getName()));
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            Authentication authentication) {
        postService.deleteComment(postId, commentId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/media/{filename:.+}")
    public ResponseEntity<Resource> getMedia(@PathVariable String filename) {
        Resource resource = postService.loadMediaAsResource(filename);

        String contentType = determineContentType(filename);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    private String determineContentType(String filename) {
        if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else if (filename.toLowerCase().endsWith(".gif")) {
            return "image/gif";
        } else if (filename.toLowerCase().endsWith(".mp4")) {
            return "video/mp4";
        } else if (filename.toLowerCase().endsWith(".webm")) {
            return "video/webm";
        } else {
            return "application/octet-stream";
        }
    }
}