import React, { useState } from 'react';
import { Box, Avatar, Typography, TextField, Button, Divider, List, ListItem } from '@mui/material';

const CommentSection = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  
  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    
    // In a real app, you would call an API here
    const newComment = {
      id: Date.now(),
      content: comment,
      createdAt: new Date().toISOString(),
      username: 'currentUser',
      userProfilePicture: null
    };
    
    setComments(prev => [newComment, ...prev]);
    setComment('');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Comments</Typography>
      
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          id="comment-section"
          fullWidth
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ mr: 1 }}
        />
        <Button 
          variant="contained" 
          onClick={handleSubmitComment}
          disabled={!comment.trim()}
        >
          Post
        </Button>
      </Box>
      
      {comments.length > 0 ? (
        <List>
          {comments.map((comment, index) => (
            <React.Fragment key={comment.id}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <Avatar sx={{ mr: 2, width: 32, height: 32 }} />
                <Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="subtitle2" sx={{ mr: 1 }}>
                      {comment.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{comment.content}</Typography>
                </Box>
              </ListItem>
              {index < comments.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No comments yet. Be the first to comment!
        </Typography>
      )}
    </Box>
  );
};

export default CommentSection;