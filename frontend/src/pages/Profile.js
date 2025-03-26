import React from 'react';
import { Container, Typography, Box, Avatar, Paper, Divider, Button, Grid } from '@mui/material';

const Profile = () => {
  // Placeholder data - would come from API in real implementation
  const user = {
    username: "techuser123",
    fullName: "Alex Johnson",
    bio: "Software developer passionate about web technologies and teaching others.",
    profilePicture: "https://i.pravatar.cc/300",
    following: 123,
    followers: 456
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            src={user.profilePicture}
            alt={user.username}
            sx={{ width: 100, height: 100, mr: 3 }}
          />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {user.fullName}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              @{user.username}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2">
                <strong>{user.following}</strong> Following
              </Typography>
              <Typography variant="body2">
                <strong>{user.followers}</strong> Followers
              </Typography>
            </Box>
            <Button variant="contained" size="small" sx={{ mt: 1 }}>
              Follow
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Bio */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Bio
          </Typography>
          <Typography variant="body1">
            {user.bio}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Posts and Learning Plans Placeholder */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Recent Posts
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography>No posts yet.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Learning Plans
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography>No learning plans yet.</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;