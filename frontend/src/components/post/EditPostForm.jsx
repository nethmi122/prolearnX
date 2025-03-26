import React, { useState, useEffect, useRef } from 'react';
import { 
    Button, TextField, Box, Typography, Grid, Paper, 
    IconButton, FormControl, InputLabel, Select, MenuItem,
    CircularProgress, Card, CardMedia, Chip
} from '@mui/material';
import { 
    CloudUpload as UploadIcon, 
    Delete as DeleteIcon,
    PhotoCamera as CameraIcon,
    Videocam as VideoIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import PostService from '../../services/PostService';

const EditPostForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: ''
    });
    
    const [existingMedia, setExistingMedia] = useState([]);
    const [retainMediaIds, setRetainMediaIds] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [newFilePreviews, setNewFilePreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef();
    
    // Fetch post data
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await PostService.getPost(id);
                const post = response.data;
                
                setFormData({
                    title: post.title,
                    description: post.description || '',
                    category: post.category
                });
                
                setExistingMedia(post.media || []);
                setRetainMediaIds(post.media?.map(m => m.id) || []);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Failed to load post data.');
                setIsLoading(false);
            }
        };
        
        fetchPost();
    }, [id]);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const toggleExistingMedia = (mediaId) => {
        if (retainMediaIds.includes(mediaId)) {
            setRetainMediaIds(prev => prev.filter(id => id !== mediaId));
        } else {
            setRetainMediaIds(prev => [...prev, mediaId]);
        }
    };
    
    const handleNewFileSelect = (e) => {
        const files = Array.from(e.target.files);
        
        // Calculate total media count
        const totalMediaCount = retainMediaIds.length + newFiles.length + files.length;
        
        // Validate file count
        if (totalMediaCount > 3) {
            setError('You can only have up to 3 media files total.');
            return;
        }
        
        // Check if there's a video
        const hasExistingVideo = existingMedia.some(m => 
            retainMediaIds.includes(m.id) && m.type === 'VIDEO');
        const hasNewVideo = [...newFiles, ...files].some(file => 
            file.type.startsWith('video/'));
            
        if ((hasExistingVideo || hasNewVideo) && totalMediaCount > 1) {
            setError('When including a video, you cannot have additional media.');
            return;
        }
        
        // File size validation
        const invalidFile = files.find(file => {
            const isVideo = file.type.startsWith('video/');
            const maxSize = isVideo ? 30 * 1024 * 1024 : 10 * 1024 * 1024;
            return file.size > maxSize;
        });
        
        if (invalidFile) {
            const isVideo = invalidFile.type.startsWith('video/');
            setError(`File too large: ${invalidFile.name}. ${isVideo ? 'Videos' : 'Images'} must be under ${isVideo ? '30MB' : '10MB'}.`);
            return;
        }
        
        // Process valid files
        setNewFiles(prev => [...prev, ...files]);
        
        // Create file previews
        const newPreviews = files.map(file => {
            const isVideo = file.type.startsWith('video/');
            return {
                file,
                url: URL.createObjectURL(file),
                type: isVideo ? 'video' : 'image'
            };
        });
        
        setNewFilePreviews(prev => [...prev, ...newPreviews]);
        setError('');
    };
    
    const removeNewFile = (index) => {
        const newFilesList = [...newFiles];
        newFilesList.splice(index, 1);
        setNewFiles(newFilesList);
        
        const newPreviewList = [...newFilePreviews];
        URL.revokeObjectURL(newPreviewList[index].url);
        newPreviewList.splice(index, 1);
        setNewFilePreviews(newPreviewList);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.category) {
            setError('Title and category are required.');
            return;
        }
        
        setIsSubmitting(true);
        setError('');
        
        try {
            // Create FormData object
            const postFormData = new FormData();
            
            // Add post data as JSON
            const postBlob = new Blob([JSON.stringify(formData)], {
                type: 'application/json'
            });
            postFormData.append('post', postBlob);
            
            // Add retained media IDs
            retainMediaIds.forEach(mediaId => {
                postFormData.append('retainMediaIds', mediaId);
            });
            
            // Add new media files
            newFiles.forEach(file => {
                postFormData.append('newMedia', file);
            });
            
            // Submit to API
            await PostService.updatePost(id, postFormData);
            
            // Redirect to post detail page
            navigate(`/posts/${id}`);
        } catch (err) {
            console.error('Error updating post:', err);
            setError(err.response?.data?.message || 'Failed to update post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    
    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" component="h1" gutterBottom>
                Edit Post
            </Typography>
            
            {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                />
                
                <FormControl fullWidth margin="normal" required>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category"
                        name="category"
                        value={formData.category}
                        label="Category"
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    >
                        <MenuItem value="CODING">Coding</MenuItem>
                        <MenuItem value="SOFTWARE_DEVELOPMENT">Software Development</MenuItem>
                        <MenuItem value="CYBERSECURITY">Cybersecurity</MenuItem>
                        <MenuItem value="DATA_SCIENCE">Data Science</MenuItem>
                        <MenuItem value="OTHER">Other</MenuItem>
                    </Select>
                </FormControl>
                
                <TextField
                    margin="normal"
                    fullWidth
                    id="description"
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    disabled={isSubmitting}
                />
                
                {/* Existing Media Section */}
                {existingMedia.length > 0 && (
                    <Box sx={{ my: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Current Media
                        </Typography>
                        <Grid container spacing={2}>
                            {existingMedia.map((media) => {
                                const isRetained = retainMediaIds.includes(media.id);
                                const apiUrl = `${process.env.REACT_APP_API_URL || ''}/api/posts/media/${media.url}`;
                                
                                return (
                                    <Grid item xs={12} sm={4} key={media.id}>
                                        <Card 
                                            sx={{ 
                                                position: 'relative',
                                                opacity: isRetained ? 1 : 0.5,
                                                transition: 'opacity 0.3s'
                                            }}
                                        >
                                            {media.type === 'IMAGE' ? (
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image={apiUrl}
                                                    alt="Post media"
                                                />
                                            ) : (
                                                <CardMedia
                                                    component="video"
                                                    height="140"
                                                    src={apiUrl}
                                                    controls
                                                />
                                            )}
                                            <Chip
                                                label={isRetained ? "Remove" : "Deleted"}
                                                color={isRetained ? "primary" : "error"}
                                                onClick={() => toggleExistingMedia(media.id)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                }}
                                                disabled={isSubmitting}
                                            />
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                )}
                
                {/* New Media Preview Section */}
                {newFilePreviews.length > 0 && (
                    <Box sx={{ my: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            New Media
                        </Typography>
                        <Grid container spacing={2}>
                            {newFilePreviews.map((preview, index) => (
                                <Grid item xs={12} sm={4} key={index}>
                                    <Card sx={{ position: 'relative' }}>
                                        {preview.type === 'image' ? (
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={preview.url}
                                                alt={`Preview ${index}`}
                                            />
                                        ) : (
                                            <CardMedia
                                                component="video"
                                                height="140"
                                                src={preview.url}
                                                controls
                                            />
                                        )}
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                top: 5,
                                                right: 5,
                                                bgcolor: 'rgba(255, 255, 255, 0.7)',
                                            }}
                                            size="small"
                                            onClick={() => removeNewFile(index)}
                                            disabled={isSubmitting}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
                
                {/* Media Upload Section */}
                {(retainMediaIds.length + newFiles.length < 3) && (
                    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                        <input
                            ref={fileInputRef}
                            accept="image/*,video/*"
                            id="contained-button-file"
                            type="file"
                            multiple
                            onChange={handleNewFileSelect}
                            style={{ display: 'none' }}
                            disabled={isSubmitting}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                                component="label"
                                htmlFor="contained-button-file"
                                variant="outlined"
                                startIcon={<UploadIcon />}
                                disabled={isSubmitting || 
                                         (retainMediaIds.length + newFiles.length >= 3) || 
                                         existingMedia.some(m => retainMediaIds.includes(m.id) && m.type === 'VIDEO') ||
                                         newFiles.some(f => f.type.startsWith('video/'))}
                            >
                                Add Media
                            </Button>
                            
                            <Typography variant="body2" color="text.secondary">
                                {(retainMediaIds.length + newFiles.length)}/3 files
                            </Typography>
                        </Box>
                    </Box>
                )}
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`/posts/${id}`)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || !formData.title.trim() || !formData.category}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isSubmitting ? 'Saving...' : 'Update Post'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default EditPostForm;