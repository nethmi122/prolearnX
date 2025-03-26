import React, { useState, useRef } from 'react';
import { 
    Button, TextField, Box, Typography, Grid, Paper, 
    IconButton, FormControl, InputLabel, Select, MenuItem,
    CircularProgress, Card, CardMedia 
} from '@mui/material';
import { 
    CloudUpload as UploadIcon, 
    Delete as DeleteIcon,
    PhotoCamera as CameraIcon,
    Videocam as VideoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PostService from '../../services/PostService';

const CreatePostForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: ''
    });
    
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef();
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        
        // Validate file count
        if (files.length + selectedFiles.length > 3) {
            setError('You can only upload up to 3 files total.');
            return;
        }
        
        // Check if there's a video
        const hasVideo = [...selectedFiles, ...files].some(file => 
            file.type.startsWith('video/'));
            
        if (hasVideo && files.length + selectedFiles.length > 1) {
            setError('When uploading a video, you cannot upload additional media.');
            return;
        }
        
        // File size validation (10MB limit for images, 30MB for videos)
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
        setSelectedFiles(prev => [...prev, ...files]);
        
        // Create file previews
        const newPreviews = files.map(file => {
            const isVideo = file.type.startsWith('video/');
            return {
                file,
                url: URL.createObjectURL(file),
                type: isVideo ? 'video' : 'image'
            };
        });
        
        setPreviews(prev => [...prev, ...newPreviews]);
        setError('');
    };
    
    const removeFile = (index) => {
        // Remove file from array
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
        
        // Remove preview and revoke object URL
        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index].url);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
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
            
            // Add media files
            selectedFiles.forEach(file => {
                postFormData.append('media', file);
            });
            
            // Submit to API
            await PostService.createPost(postFormData);
            
            // Redirect to home page on success
            navigate('/');
        } catch (err) {
            console.error('Error creating post:', err);
            setError(err.response?.data?.message || 'Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" component="h1" gutterBottom>
                Create New Post
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
                
                {/* Media Preview Section */}
                {previews.length > 0 && (
                    <Box sx={{ my: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Media Preview
                        </Typography>
                        <Grid container spacing={2}>
                            {previews.map((preview, index) => (
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
                                            onClick={() => removeFile(index)}
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
                <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                    <input
                        ref={fileInputRef}
                        accept="image/*,video/*"
                        id="contained-button-file"
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        disabled={isSubmitting || selectedFiles.length >= 3}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            component="label"
                            htmlFor="contained-button-file"
                            variant="outlined"
                            startIcon={<UploadIcon />}
                            disabled={isSubmitting || selectedFiles.length >= 3 || 
                                     selectedFiles.some(file => file.type.startsWith('video/'))}
                        >
                            Add Media
                        </Button>
                        
                        <Typography variant="body2" color="text.secondary">
                            {selectedFiles.length}/3 files
                        </Typography>
                    </Box>
                    
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                        {/* Indicator of what media types are allowed */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CameraIcon color="action" fontSize="small" />
                            <Typography variant="caption" color="text.secondary">Images</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <VideoIcon color="action" fontSize="small" />
                            <Typography variant="caption" color="text.secondary">Videos (max 30s)</Typography>
                        </Box>
                    </Box>
                </Box>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/')}
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
                        {isSubmitting ? 'Posting...' : 'Create Post'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default CreatePostForm;