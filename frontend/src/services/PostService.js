import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class PostService {
  // Get all posts (paginated)
  getPosts(page = 0, size = 10) {
    return axios.get(`${API_URL}/posts?page=${page}&size=${size}`);
  }

  // Get posts by user
  getPostsByUser(username, page = 0, size = 10) {
    return axios.get(`${API_URL}/users/${username}/posts?page=${page}&size=${size}`);
  }

  // Get posts by category
  getPostsByCategory(category, page = 0, size = 10) {
    return axios.get(`${API_URL}/posts/category/${category}?page=${page}&size=${size}`);
  }

  // Get a single post by ID
  getPost(id) {
    return axios.get(`${API_URL}/posts/${id}`);
  }

  // Create a new post
  createPost(formData) {
    return axios.post(`${API_URL}/posts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Update an existing post
  updatePost(id, formData) {
    return axios.put(`${API_URL}/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Delete a post
  deletePost(id) {
    return axios.delete(`${API_URL}/posts/${id}`);
  }

  // Like a post
  likePost(id) {
    return axios.post(`${API_URL}/posts/${id}/like`);
  }

  // Unlike a post
  unlikePost(id) {
    return axios.delete(`${API_URL}/posts/${id}/like`);
  }

  // Add a comment to a post
  addComment(postId, content) {
    return axios.post(`${API_URL}/posts/${postId}/comments`, { content });
  }

  // Delete a comment from a post
  deleteComment(postId, commentId) {
    return axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}`);
  }
}

export default new PostService();