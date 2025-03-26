import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PostService from '../../services/PostService';

const DeletePostDialog = ({ open, handleClose, postId, postTitle }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await PostService.deletePost(postId);
      // Close dialog and navigate away
      handleClose();
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete the post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={!isDeleting ? handleClose : undefined}
    >
      <DialogTitle>Delete Post</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete "{postTitle}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button 
          color="error" 
          onClick={handleDelete}
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={20} /> : null}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePostDialog;