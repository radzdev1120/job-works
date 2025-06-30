import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete
} from '@mui/material';
import { dummyUsers } from '../data/dummyUsers';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'jobseeker',
    profession: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    bio: '',
    skills: [],
    education: [{
      degree: '',
      school: '',
      year: ''
    }],
    experience: [{
      title: '',
      company: '',
      duration: '',
      description: ''
    }]
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.profession) newErrors.profession = 'Profession is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.location) newErrors.location = 'Location is required';
   

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      skills: newValue
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      education: newEducation
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience];
    newExperience[index] = {
      ...newExperience[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      experience: newExperience
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', school: '', year: '' }]
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    // Check if email already exists
    const existingUser = dummyUsers.find(user => user.email === formData.email);
    if (existingUser) {
      setSnackbar({
        open: true,
        message: 'Email already registered',
        severity: 'error'
      });
      return;
    }

    // Create new user object
    const newUser = {
      ...formData,
      savedJobs: [],
      appliedJobs: []
    };

    // Add to dummy users (in a real app, this would be an API call)
    dummyUsers.push(newUser);

    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(newUser));

    setSnackbar({
      open: true,
      message: 'Registration successful! Redirecting to dashboard...',
      severity: 'success'
    });

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Create Your Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                error={!!errors.profession}
                helperText={errors.profession}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LinkedIn Profile"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GitHub Profile"
                name="github"
                value={formData.github}
                onChange={handleChange}
              />
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Personal Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </Grid> */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'AWS', 'Docker', 'Kubernetes']}
                value={formData.skills}
                onChange={handleSkillsChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Skills"
                    error={!!errors.skills}
                    helperText={errors.skills}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} />
                  ))
                }
              />
            </Grid>

            {/* Education Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Education
              </Typography>
              {formData.education.map((edu, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="School"
                      value={edu.school}
                      onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Year"
                      value={edu.year}
                      onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                    />
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                onClick={addEducation}
                sx={{ mt: 1 }}
              >
                Add Education
              </Button>
            </Grid>

            {/* Experience Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Experience
              </Typography>
              {formData.experience.map((exp, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={exp.title}
                      onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Duration"
                      value={exp.duration}
                      onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                    />
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                onClick={addExperience}
                sx={{ mt: 1 }}
              >
                Add Experience
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register; 