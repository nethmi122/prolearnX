import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" paragraph>
        The page you are looking for does not exist.
      </Typography>
      <Box mt={4}>
        <Button variant="contained" component={Link} to="/" color="primary">
          Return to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;