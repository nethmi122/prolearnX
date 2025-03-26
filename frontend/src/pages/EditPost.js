import React from 'react';
import { Container } from '@mui/material';
import EditPostForm from '../components/post/EditPostForm';

const EditPost = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <EditPostForm />
        </Container>
    );
};

export default EditPost;