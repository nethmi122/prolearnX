import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import LearningPlans from './pages/LearningPlans';
import LearningPlanDetail from './pages/LearningPlanDetail';
import CreateLearningPlan from './pages/CreateLearningPlan';
import NotFound from './pages/NotFound';
import EditPost from './pages/EditPost';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/posts/:postId" element={<PostDetail />} />
              <Route path="/posts/:id/edit" element={<EditPost />} />
              <Route path="/learning-plans" element={<LearningPlans />} />
              <Route path="/learning-plans/:planId" element={<LearningPlanDetail />} />
              <Route path="/create-learning-plan" element={<CreateLearningPlan />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;