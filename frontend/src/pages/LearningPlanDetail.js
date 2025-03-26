import React from 'react';
import { Container, Typography, Box, Paper, Stepper, Step, StepLabel, StepContent, Button, Divider, Avatar } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';

const LearningPlanDetail = () => {
  // Mock data - would come from API in real implementation
  const plan = {
    id: 1,
    title: "Complete React Developer Roadmap",
    description: "A comprehensive learning path to become a proficient React developer from scratch. This plan covers everything from JavaScript fundamentals to advanced React concepts like Hooks, Context API, and Redux state management.",
    category: "CODING",
    createdAt: "2025-02-15T14:30:00",
    updatedAt: "2025-03-10T09:15:00",
    creator: {
      username: "reactmaster",
      profilePicture: "https://i.pravatar.cc/300?img=5"
    },
    steps: [
      { 
        id: 1, 
        title: "JavaScript Fundamentals", 
        description: "Learn variables, data types, functions, and ES6 features.", 
        orderNumber: 1,
        completed: true
      },
      { 
        id: 2, 
        title: "DOM Manipulation", 
        description: "Understand how to interact with the Document Object Model.", 
        orderNumber: 2,
        completed: true
      },
      { 
        id: 3, 
        title: "React Basics", 
        description: "Learn components, props, and JSX syntax.", 
        orderNumber: 3,
        completed: false
      },
      { 
        id: 4, 
        title: "State Management", 
        description: "Master useState hook and lifting state up.", 
        orderNumber: 4,
        completed: false
      },
      { 
        id: 5, 
        title: "React Router", 
        description: "Create multi-page applications with React Router.", 
        orderNumber: 5,
        completed: false
      }
    ]
  };

  const handleToggleStep = (stepId) => {
    console.log("Toggling step completion:", stepId);
    // Would make API call to update step status in real implementation
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Plan Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {plan.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              src={plan.creator.profilePicture} 
              alt={plan.creator.username} 
              sx={{ mr: 1, width: 32, height: 32 }} 
            />
            <Typography variant="subtitle2">
              Created by {plan.creator.username}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Category: {plan.category.replace('_', ' ')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date(plan.updatedAt).toLocaleDateString()}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Plan Description */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Description</Typography>
          <Typography variant="body1" paragraph>
            {plan.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Steps */}
        <Typography variant="h6" gutterBottom>Learning Steps</Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Progress: {plan.steps.filter(step => step.completed).length}/{plan.steps.length} steps completed 
            ({Math.round((plan.steps.filter(step => step.completed).length / plan.steps.length) * 100)}%)
          </Typography>
        </Box>

        <Stepper orientation="vertical" nonLinear>
          {plan.steps.map((step) => (
            <Step key={step.id} active={true} completed={step.completed}>
              <StepLabel 
                StepIconComponent={step.completed ? CheckCircle : RadioButtonUnchecked}
                onClick={() => handleToggleStep(step.id)}
                sx={{ cursor: 'pointer' }}
              >
                <Typography variant="subtitle1">{step.title}</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2">{step.description}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant={step.completed ? "outlined" : "contained"}
                    size="small"
                    onClick={() => handleToggleStep(step.id)}
                  >
                    {step.completed ? "Mark as Incomplete" : "Mark as Complete"}
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Container>
  );
};

export default LearningPlanDetail;