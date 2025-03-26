import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, MenuItem, Select, FormControl, InputLabel, IconButton, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, DragIndicator as DragIcon } from '@mui/icons-material';

const CreateLearningPlan = () => {
  const [steps, setSteps] = useState([
    { title: '', description: '' },
  ]);

  const addStep = () => {
    setSteps([...steps, { title: '', description: '' }]);
  };

  const removeStep = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Learning Plan
        </Typography>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Plan Title"
            name="title"
            autoFocus
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              label="Category"
              defaultValue=""
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
            required
            fullWidth
            id="description"
            label="Plan Description"
            name="description"
            multiline
            rows={4}
          />
          
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Learning Steps
          </Typography>
          
          <List>
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => removeStep(index)} disabled={steps.length === 1}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ alignItems: 'flex-start', pt: 2 }}
                >
                  <Box sx={{ mr: 2, mt: 1 }}>
                    <DragIcon />
                  </Box>
                  
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1" component="div" gutterBottom>
                        Step {index + 1}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <TextField
                          margin="dense"
                          required
                          fullWidth
                          label="Step Title"
                          value={step.title}
                          onChange={(e) => updateStep(index, 'title', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          margin="dense"
                          fullWidth
                          label="Step Description"
                          multiline
                          rows={2}
                          value={step.description}
                          onChange={(e) => updateStep(index, 'description', e.target.value)}
                        />
                      </Box>
                    }
                    disableTypography
                  />
                </ListItem>
                {index < steps.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addStep}
            sx={{ mt: 2 }}
          >
            Add Step
          </Button>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Learning Plan
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateLearningPlan;