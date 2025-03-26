import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Avatar,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Grid
} from '@mui/material';
import {
  Close as CloseIcon,
  Image as ImageIcon,
  Videocam as VideocamIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const CreatePostModal = ({ open, handleClose, user = {} }) => {
  const [postContent, setPostContent] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHAR_COUNT = 1000;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostContent({
      ...postContent,
      [name]: value
    });
    
    if (name === 'description') {
      setCharCount(value.length);
    }
  };

  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // LinkedIn-like validation for media files
    if (files.some(file => file.type.includes('video/')) && files.length > 1) {
      alert('You can only upload one video at a time');
      return;
    }
    
    if (files.filter(file => file.type.includes('image/')).length > 3) {
      alert('You can only upload up to 3 images');
      return;
    }
    
    // Check video duration (client-side)
    files.forEach(file => {
      if (file.type.includes('video/')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = function() {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            alert('Video must be under 30 seconds');
            setMediaFiles([]);
            setPreviews([]);
            return;
          }
        };
        
        video.src = URL.createObjectURL(file);
      }
    });
    
    setMediaFiles(files);
    
    // Create previews
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.includes('video/') ? 'video' : 'image',
      name: file.name
    }));
    
    setPreviews(newPreviews);
  };

  const removeMedia = (index) => {
    const updatedFiles = [...mediaFiles];
    updatedFiles.splice(index, 1);
    setMediaFiles(updatedFiles);
    
    const updatedPreviews = [...previews];
    URL.revokeObjectURL(updatedPreviews[index].url);
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async () => {
    if (!postContent.title.trim()) {
      alert('Please add a title for your post');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create form data for multipart upload
      const formData = new FormData();
      formData.append('title', postContent.title);
      formData.append('description', postContent.description);
      formData.append('category', postContent.category);
      
      mediaFiles.forEach((file, index) => {
        formData.append(`media`, file);
      });
      
      // Call API to create post - you'll implement this service later
      // await PostService.createPost(formData);
      
      // For now just simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setPostContent({ title: '', description: '', category: '' });
      setMediaFiles([]);
      setPreviews([]);
      handleClose(true); // true indicates successful submission
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => !isSubmitting && handleClose(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Create a Post</Typography>
          <IconButton 
            onClick={() => handleClose(false)}
            disabled={isSubmitting}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={user.profilePicture} 
            alt={user.username || 'User'} 
            sx={{ mr: 1 }}
          />
          <Typography variant="subtitle1" fontWeight="bold">
            {user.fullName || user.username || 'You'}
          </Typography>
        </Box>
        
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={postContent.title}
          onChange={handleInputChange}
          margin="normal"
          variant="outlined"
          required
          disabled={isSubmitting}
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category"
            name="category"
            value={postContent.category}
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
        
        <Box position="relative" mt={2}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="What do you want to share?"
            name="description"
            value={postContent.description}
            onChange={handleInputChange}
            variant="outlined"
            disabled={isSubmitting}
            inputProps={{ maxLength: MAX_CHAR_COUNT }}
          />
          <Typography 
            variant="caption" 
            color={charCount > MAX_CHAR_COUNT * 0.9 ? "error" : "textSecondary"}
            sx={{ position: 'absolute', bottom: 8, right: 16 }}
          >
            {charCount}/{MAX_CHAR_COUNT}
          </Typography>
        </Box>

        {/* Media Previews */}
        {previews.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={1}>
              {previews.map((preview, index) => (
                <Grid item xs={4} key={index}>
                  <Box 
                    sx={{ 
                      position: 'relative',
                      height: 100,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    {preview.type === 'image' ? (
                      <img 
                        src={preview.url} 
                        alt={`Preview ${index}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <video 
                        src={preview.url} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        controls
                      />
                    )}
                    <IconButton 
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        right: 0,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }
                      }}
                      onClick={() => removeMedia(index)}
                      disabled={isSubmitting}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="caption" noWrap>{preview.name}</Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box>
          <input
            accept="image/*,video/*"
            id="icon-button-file"
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={handleMediaSelect}
            disabled={isSubmitting}
          />
          <label htmlFor="icon-button-file">
            <Chip
              icon={<ImageIcon />}
              label="Image"
              clickable
              component="span"
              variant="outlined"
              sx={{ mr: 1 }}
              disabled={isSubmitting || mediaFiles.some(file => file.type.includes('video/'))}
            />
          </label>
          <label htmlFor="icon-button-file">
            <Chip
              icon={<VideocamIcon />}
              label="Video"
              clickable
              component="span"
              variant="outlined"
              disabled={isSubmitting || mediaFiles.length > 0}
            />
          </label>
        </Box>
        
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isSubmitting || !postContent.title.trim()}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Publishing...' : 'Post'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePostModal;