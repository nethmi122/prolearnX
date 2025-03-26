import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Button, Box } from '@mui/material';
import CreatePostModal from '../components/post/CreatePostModal';

const CreatePost = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(true);
  
  // Mock user data - in a real app, you would get this from your auth context
  const currentUser = {
    username: "techuser123",
    fullName: "Alex Johnson",
    profilePicture: "https://i.pravatar.cc/300"
  };
  
  const handleCloseModal = (success) => {
    setModalOpen(false);
    if (success) {
      // Redirect to home page after successful post creation
      navigate('/');
    } else {
      // If they just closed the modal without posting
      navigate(-1);
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {!modalOpen && (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Share your knowledge with the community
          </Typography>
          <Box mt={2}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setModalOpen(true)}
              size="large"
            >
              Create a Post
            </Button>
          </Box>
        </Paper>
      )}
      
      <CreatePostModal
        open={modalOpen}
        handleClose={handleCloseModal}
        user={currentUser}
      />
    </Container>
  );
};

export default CreatePost;