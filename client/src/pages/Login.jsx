import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { dummyUsers } from '../data/dummyUsers';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Find user with matching email
    const user = dummyUsers.find(u => u.email === formData.email);

    if (!user) {
      setError('User not found');
      return;
    }

    if (user.password !== formData.password) {
      setError('Remember password');
      return;
    }

    // Store user data in localStorage (excluding password)
    const { password, ...userData } = user;
    localStorage.setItem('user', JSON.stringify(userData));

    // Redirect based on role
    if (user.role === 'recruiter') {
      navigate('/post-job');
    } else {
      navigate('/jobs');
    }
  };

  return (
    <Container 
      maxWidth="" 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          width: '100%',
          maxWidth: '400px',
          margin: 'auto'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Welcome Back
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 