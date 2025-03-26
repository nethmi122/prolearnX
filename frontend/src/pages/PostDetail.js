import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, Typography, Box, Paper, Avatar, 
    Grid, Button, CircularProgress, Card, CardMedia,
    IconButton, Menu, MenuItem, Divider
} from '@mui/material';
import {
    ThumbUp, Comment, MoreVert as MoreIcon,
    Edit as EditIcon, Delete as DeleteIcon
} from '@mui/icons-material';
import PostService from '../services/PostService';
import DeletePostDialog from '../components/post/DeletePostDialog';
import CommentSection from '../components/comment/CommentSection';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an auth context

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Get current user from auth context
    
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    
    // Fetch post data
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await PostService.getPost(id);
                setPost(response.data);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Failed to load post. It may have been deleted or you may not have permission to view it.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPost();
    }, [id]);
    
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const handleEditClick = () => {
        handleMenuClose();
        navigate(`/posts/${id}/edit`);
    };
    
    const handleDeleteClick = () => {
        handleMenuClose();
        setDeleteDialogOpen(true);
    };
    
    const handleLikeClick = async () => {
        try {
            await PostService.likePost(id);
            // Refresh post data to get updated like count
            const response = await PostService.getPost(id);
            setPost(response.data);
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };
    
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="error">{error}</Typography>
                    <Button 
                        variant="contained" 
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </Button>
                </Paper>
            </Container>
        );
    }
    
    const isOwner = currentUser && post.owner === currentUser.username;
    const apiBaseUrl = `${process.env.REACT_APP_API_URL || ''}/api/posts/media/`;
    
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
                {/* Post Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                            src={post.ownerProfilePicture} 
                            alt={post.owner}
                            sx={{ mr: 1 }}
                        />
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {post.ownerDisplayName || post.owner}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {new Date(post.createdAt).toLocaleDateString()}
                                {post.updatedAt && ` (edited ${new Date(post.updatedAt).toLocaleDateString()})`}
                            </Typography>
                        </Box>
                    </Box>
                    
                    {isOwner && (
                        <>
                            <IconButton onClick={handleMenuOpen}>
                                <MoreIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleEditClick}>
                                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                                    Edit Post
                                </MenuItem>
                                <MenuItem onClick={handleDeleteClick}>
                                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                                    Delete Post
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>
                
                {/* Post Content */}
                <Typography variant="h5" component="h1" gutterBottom>
                    {post.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Category: {post.category.replace('_', ' ')}
                </Typography>
                
                {post.description && (
                    <Typography variant="body1" paragraph sx={{ my: 2 }}>
                        {post.description}
                    </Typography>
                )}
                
                {/* Media Content */}
                {post.media && post.media.length > 0 && (
                    <Grid container spacing={2} sx={{ my: 3 }}>
                        {post.media.map((media, index) => (
                            <Grid item xs={12} key={index} sx={{
                                ...(post.media.length > 1 && { md: 6 }),
                                ...(post.media.length > 2 && { md: 4 })
                            }}>
                                <Card>
                                    {media.type === 'IMAGE' ? (
                                        <CardMedia
                                            component="img"
                                            image={apiBaseUrl + media.url}
                                            alt={`Post media ${index + 1}`}
                                            sx={{ maxHeight: '400px', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <CardMedia
                                            component="video"
                                            src={apiBaseUrl + media.url}
                                            controls
                                            sx={{ maxHeight: '400px' }}
                                        />
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
                
                {/* Engagement Actions */}
                <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                    <Button
                        startIcon={<ThumbUp />}
                        onClick={handleLikeClick}
                        color="primary"
                        variant="outlined"
                    >
                        Like {post.likesCount > 0 && `(${post.likesCount})`}
                    </Button>
                    
                    <Button
                        startIcon={<Comment />}
                        color="primary"
                        variant="outlined"
                        onClick={() => document.getElementById('comment-section').focus()}
                    >
                        Comment {post.commentsCount > 0 && `(${post.commentsCount})`}
                    </Button>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                {/* Comment Section */}
                <CommentSection postId={id} />
            </Paper>
            
            {/* Delete Confirmation Dialog */}
            <DeletePostDialog
                open={deleteDialogOpen}
                handleClose={() => setDeleteDialogOpen(false)}
                postId={id}
                postTitle={post.title}
            />
        </Container>
    );
};

export default PostDetail;