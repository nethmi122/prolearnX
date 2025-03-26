import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Button, Grid, CircularProgress,
  Paper, Fab, Pagination, Card, CardMedia, CardContent, 
  CardActions, Avatar, IconButton, Divider
} from '@mui/material';
import { Add as AddIcon, ThumbUp, Comment, Share } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PostService from '../services/PostService';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    fetchPosts(page);
  }, [page]);
  
  const fetchPosts = async (pageNumber) => {
    try {
      setLoading(true);
      const response = await PostService.getPosts(pageNumber);
      setPosts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreatePost = () => {
    navigate('/create-post');
  };
  
  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };
  
  const handlePageChange = (event, value) => {
    setPage(value - 1);  // API uses 0-based indexing
    window.scrollTo(0, 0);
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Create Post Section */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center' }}>
        <Avatar 
          src={currentUser?.profilePicture} 
          alt={currentUser?.username} 
          sx={{ mr: 2 }} 
        />
        <Button 
          variant="outlined" 
          fullWidth 
          onClick={handleCreatePost}
          sx={{ 
            textAlign: 'left', 
            justifyContent: 'flex-start',
            py: 1.5
          }}
        >
          What's on your mind, {currentUser?.displayName?.split(' ')[0] || 'there'}?
        </Button>
      </Paper>
      
      {/* Mobile FAB for creating posts */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16, display: { md: 'none' } }}>
        <Fab color="primary" aria-label="add" onClick={handleCreatePost}>
          <AddIcon />
        </Fab>
      </Box>
      
      {/* Posts List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : posts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>No posts yet</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Be the first to share something with the community!
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleCreatePost}
          >
            Create Post
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {posts.map(post => (
              <Grid item xs={12} key={post.id}>
                <Card sx={{ cursor: 'pointer' }} onClick={() => handlePostClick(post.id)}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={post.ownerProfilePicture} 
                        alt={post.owner} 
                        sx={{ mr: 1.5 }} 
                      />
                      <Box>
                        <Typography variant="subtitle1">
                          {post.ownerDisplayName || post.owner}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(post.createdAt).toLocaleDateString()}
                          {post.category && ` • ${post.category.replace('_', ' ')}`}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    
                    {post.description && (
                      <Typography variant="body1" paragraph>
                        {post.description.length > 150 
                          ? `${post.description.substring(0, 150)}...` 
                          : post.description}
                      </Typography>
                    )}
                    
                    {/* Display first media if available */}
                    {post.media && post.media.length > 0 && (
                      <Box sx={{ position: 'relative' }}>
                        {post.media[0].type === 'IMAGE' ? (
                          <CardMedia
                            component="img"
                            image={`http://localhost:8080/api/posts/media/${post.media[0].url}`}
                            alt="Post media"
                            sx={{ borderRadius: 1, maxHeight: 300, objectFit: 'cover' }}
                          />
                        ) : (
                          <CardMedia
                            component="video"
                            src={`http://localhost:8080/api/posts/media/${post.media[0].url}`}
                            controls
                            sx={{ borderRadius: 1, maxHeight: 300 }}
                          />
                        )}
                        
                        {post.media.length > 1 && (
                          <Box sx={{
                            position: 'absolute',
                            right: 10,
                            bottom: 10,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            px: 1,
                            borderRadius: 1
                          }}>
                            +{post.media.length - 1} more
                          </Box>
                        )}
                      </Box>
                    )}
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions>
                    <Button 
                      startIcon={<ThumbUp />}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Like handling logic
                      }}
                      size="small"
                    >
                      Like {post.likesCount > 0 && `(${post.likesCount})`}
                    </Button>
                    
                    <Button 
                      startIcon={<Comment />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePostClick(post.id);
                      }}
                      size="small"
                    >
                      Comment {post.commentsCount > 0 && `(${post.commentsCount})`}
                    </Button>
                    
                    <Button 
                      startIcon={<Share />}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Share handling logic
                        navigator.clipboard.writeText(window.location.origin + `/posts/${post.id}`);
                      }}
                      size="small"
                    >
                      Share
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page + 1} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;