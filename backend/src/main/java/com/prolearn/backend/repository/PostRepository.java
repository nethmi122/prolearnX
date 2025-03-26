package com.prolearn.backend.repository;

import com.prolearn.backend.model.Post;
import com.prolearn.backend.model.PostCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByCategory(PostCategory category, Pageable pageable);
}