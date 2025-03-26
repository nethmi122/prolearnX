package com.prolearn.backend.repository;

import com.prolearn.backend.model.Like;
import com.prolearn.backend.model.Post;
import com.prolearn.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByPostAndUser(Post post, User user);
    void deleteByPostAndUser(Post post, User user);
}