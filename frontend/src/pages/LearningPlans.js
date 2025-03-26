import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActionArea, Box, Chip, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LearningPlans = () => {
  const navigate = useNavigate();
  
  // Mock data - would come from API in real implementation
  const learningPlans = [
    {
      id: 1,
      title: "Complete React Developer Roadmap",
      description: "A comprehensive learning path to become a proficient React developer from scratch.",
      category: "CODING",
      creator: {
        username: "reactmaster",
      },
      steps: 12,
      completedSteps: 0
    },
    {
      id: 2,
      title: "Cybersecurity Fundamentals",
      description: "Learn the basics of cybersecurity, including threat models, encryption, and network security.",
      category: "CYBERSECURITY",
      creator: {
        username: "securityguru",
      },
      steps: 8,
      completedSteps: 3
    },
    {
      id: 3,
      title: "Data Science with Python",
      description: "From basic statistics to machine learning models using Python libraries.",
      category: "DATA_SCIENCE",
      creator: {
        username: "datascientist101",
      },
      steps: 15,
      completedSteps: 7
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Learning Plans
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create-learning-plan')}
        >
          Create Plan
        </Button>
      </Box>

      <Grid container spacing={3}>
        {learningPlans.map((plan) => (
          <Grid item key={plan.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea 
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                onClick={() => navigate(`/learning-plans/${plan.id}`)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {plan.title}
                  </Typography>
                  <Chip 
                    label={plan.category.replace('_', ' ')} 
                    size="small" 
                    color="primary" 
                    sx={{ mb: 2 }} 
                  />
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {plan.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Created by: {plan.creator.username}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      Progress: {plan.completedSteps}/{plan.steps} steps
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {Math.round((plan.completedSteps / plan.steps) * 100)}%
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LearningPlans;