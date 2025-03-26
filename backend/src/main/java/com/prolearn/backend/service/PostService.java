package com.prolearn.backend.service;

import com.prolearn.backend.dto.CommentResponse;
import com.prolearn.backend.dto.PostRequest;
import com.prolearn.backend.dto.PostResponse;
import com.prolearn.backend.exception.FileStorageException;
import com.prolearn.backend.exception.ResourceNotFoundException;
import com.prolearn.backend.exception.UnauthorizedException;
import com.prolearn.backend.model.Comment;
import com.prolearn.backend.model.Like;
import com.prolearn.backend.model.Post;
import com.prolearn.backend.model.PostCategory;
import com.prolearn.backend.model.PostMedia;
import com.prolearn.backend.model.User;
import com.prolearn.backend.repository.PostMediaRepository;
import com.prolearn.backend.repository.PostRepository;
import com.prolearn.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostMediaRepository postMediaRepository;
    private final UserRepository userRepository;
    private final MediaStorageService mediaStorageService;

    public Page<PostResponse> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable)
                .map(this::mapToPostResponse);
    }

    public PostResponse getPostById(Long id) {
        return postRepository.findById(id)
                .map(this::mapToPostResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    @Transactional
    public PostResponse createPost(PostRequest postRequest, List<MultipartFile> mediaFiles, String username) {
        User user = getUserByUsername(username);

        // Create new post
        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setDescription(postRequest.getDescription());
        post.setCategory(postRequest.getCategory());
        post.setOwner(user);
        post.setCreatedAt(LocalDateTime.now());

        Post savedPost = postRepository.save(post);

        // Process media files (if any)
        if (mediaFiles != null && !mediaFiles.isEmpty()) {
            List<PostMedia> savedMedia = processMediaFiles(mediaFiles, savedPost);
            savedPost.setMedia(savedMedia);
        }

        return mapToPostResponse(savedPost);
    }

    @Transactional
    public PostResponse updatePost(Long id, PostRequest postRequest, 
                               List<MultipartFile> newMediaFiles, List<Long> retainMediaIds, String username) {
        
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        // Check if user is the owner
        if (!post.getOwner().getUsername().equals(username)) {
            throw new UnauthorizedException("You can only edit your own posts");
        }

        // Update post details
        post.setTitle(postRequest.getTitle());
        post.setDescription(postRequest.getDescription());
        post.setCategory(postRequest.getCategory());
        post.setCreatedAt(LocalDateTime.now());

        // Handle media updates
        if (retainMediaIds == null) {
            retainMediaIds = new ArrayList<>();
        }

        // Delete media that are not in the retainMediaIds list
        List<PostMedia> mediaToRemove = new ArrayList<>();
        for (PostMedia media : post.getMedia()) {
            if (!retainMediaIds.contains(media.getId())) {
                // Delete the file
                mediaStorageService.deleteMedia(media.getMediaUrl());
                mediaToRemove.add(media);
            }
        }
        
        // Remove media from collection
        for (PostMedia media : mediaToRemove) {
            post.getMedia().remove(media);
            postMediaRepository.delete(media);
        }

        // Add new media files
        if (newMediaFiles != null && !newMediaFiles.isEmpty()) {
            List<PostMedia> newMedia = processMediaFiles(newMediaFiles, post);
            post.getMedia().addAll(newMedia);
        }

        Post updatedPost = postRepository.save(post);
        return mapToPostResponse(updatedPost);
    }

    @Transactional
    public void deletePost(Long id, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        // Check if user is the owner
        if (!post.getOwner().getUsername().equals(username)) {
            throw new UnauthorizedException("You can only delete your own posts");
        }

        // Delete all media files
        for (PostMedia media : post.getMedia()) {
            mediaStorageService.deleteMedia(media.getMediaUrl());
        }

        // Delete the post (this will cascade delete the media entries)
        postRepository.delete(post);
    }

    public Resource loadMediaAsResource(String filename) {
        try {
            Path filePath = mediaStorageService.getMediaPath(filename);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found: " + filename);
            }
        } catch (MalformedURLException ex) {
            throw new FileStorageException("Failed to load file: " + filename, ex);
        }
    }

    // Helper methods
    private List<PostMedia> processMediaFiles(List<MultipartFile> mediaFiles, Post post) {
        List<PostMedia> mediaList = new ArrayList<>();

        for (MultipartFile file : mediaFiles) {
            // Store the file and get the filename
            String storedFilename = mediaStorageService.storeMedia(file);
            
            // Create media entity
            PostMedia media = new PostMedia();
            media.setPost(post);
            media.setMediaUrl(storedFilename);
            
            // Determine media type - Fix null check
            String contentType = file.getContentType();
            if (contentType != null && contentType.startsWith("video/")) {
                media.setType(PostMedia.MediaType.VIDEO);
            } else {
                media.setType(PostMedia.MediaType.IMAGE);
            }
            
            mediaList.add(postMediaRepository.save(media));
        }

        return mediaList;
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    private PostResponse mapToPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .description(post.getDescription())
                .category(post.getCategory())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getCreatedAt())
                .owner(post.getOwner().getUsername())
                .ownerDisplayName(post.getOwner().getUsername())
                .ownerProfilePicture(post.getOwner().getProfilePicture())
                .likesCount(post.getLikes() != null ? post.getLikes().size() : 0)
                .commentsCount(post.getComments() != null ? post.getComments().size() : 0)
                .media(post.getMedia().stream()
                        .map(this::mapToMediaResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    private PostResponse.MediaDTO mapToMediaResponse(PostMedia media) {
        return new PostResponse.MediaDTO(
                media.getId(),
                media.getMediaUrl(),
                media.getType().name()
        );
    }

    public Page<PostResponse> getPostsByCategory(PostCategory category, Pageable pageable) {
        return postRepository.findByCategory(category, pageable)
                .map(this::mapToPostResponse);
    }

    @Transactional
    public void likePost(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        
        User user = getUserByUsername(username);
        
        // Check if already liked
        boolean alreadyLiked = post.getLikes().stream()
                .anyMatch(like -> like.getUser().getId().equals(user.getId()));
        
        if (!alreadyLiked) {
            Like like = new Like();
            like.setPost(post);
            like.setUser(user);
            like.setCreatedAt(LocalDateTime.now());
            post.getLikes().add(like);
            postRepository.save(post);
        }
    }

    @Transactional
    public void unlikePost(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        
        User user = getUserByUsername(username);
        
        post.getLikes().removeIf(like -> like.getUser().getId().equals(user.getId()));
        postRepository.save(post);
    }

    @Transactional
    public CommentResponse addComment(Long postId, String content, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        
        User user = getUserByUsername(username);
        
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setPost(post);
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());
        
        post.getComments().add(comment);
        Post savedPost = postRepository.save(post);
        
        Comment savedComment = savedPost.getComments().stream()
                .filter(c -> c.getContent().equals(content) && c.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Error saving comment"));
        
        return CommentResponse.builder()
                .id(savedComment.getId())
                .content(savedComment.getContent())
                .createdAt(savedComment.getCreatedAt())
                .updatedAt(savedComment.getUpdatedAt())
                .username(savedComment.getUser().getUsername())
                .userProfilePicture(savedComment.getUser().getProfilePicture())
                .build();
    }

    @Transactional
    public void deleteComment(Long postId, Long commentId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        
        User user = getUserByUsername(username);
        
        Comment comment = post.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        
        // Check if user is comment owner or post owner
        if (!comment.getUser().getId().equals(user.getId()) && !post.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to delete this comment");
        }
        
        post.getComments().remove(comment);
        postRepository.save(post);
    }
}