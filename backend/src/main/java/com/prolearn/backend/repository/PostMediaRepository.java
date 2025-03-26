package com.prolearn.backend.repository;

import com.prolearn.backend.model.Post;
import com.prolearn.backend.model.PostMedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostMediaRepository extends JpaRepository<PostMedia, Long> {
    List<PostMedia> findByPost(Post post);
    void deleteByPost(Post post);
}