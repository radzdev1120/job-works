import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Work,
  AttachMoney,
  LocationOn,
  Description,
  School,
  Group,
  Language,
} from '@mui/icons-material';

const PostJob = () => {
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Full Time Position',
    salary: '',
    description: '',
    requirements: [''],
    benefits: [''],
    responsibilities: [''],
    skills: [''],
    companyInfo: {
      size: '',
      industry: '',
      founded: '',
      website: '',
    },
    status: 'active',
    applications: [],
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.role !== 'recruiter') {
      navigate('/profile');
      return;
    }

    // Pre-fill company information if available
    if (user.company) {
      setJob(prev => ({
        ...prev,
        company: user.company,
        companyInfo: {
          ...prev.companyInfo,
          website: user.website || '',
        },
      }));
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Get existing jobs or initialize empty array
      const existingJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      
      // Create new job with ID and timestamp
      const newJob = {
        ...job,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        postedBy: JSON.parse(localStorage.getItem('user')).email,
        status: 'active',
        applications: [],
      };

      // Add new job to array
      existingJobs.push(newJob);
      
      // Save updated jobs array
      localStorage.setItem('jobs', JSON.stringify(existingJobs));
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/jobs');
      }, 2000);
    } catch (error) {
      setError('Failed to post job');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleArrayFieldChange = (field, index, value) => {
    setJob(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleAddArrayField = (field) => {
    setJob(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleRemoveArrayField = (field, index) => {
    setJob(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleCompanyInfoChange = (field, value) => {
    setJob(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: value,
      },
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Post a New Job
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Job posted successfully! Redirecting...
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Job Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Job Title"
                value={job.title}
                onChange={(e) => setJob({ ...job, title: e.target.value })}
                InputProps={{
                  startAdornment: <Work sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Company Name"
                value={job.company}
                onChange={(e) => setJob({ ...job, company: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Location"
                value={job.location}
                onChange={(e) => setJob({ ...job, location: e.target.value })}
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={job.jobType}
                  label="Job Type"
                  onChange={(e) => setJob({ ...job, jobType: e.target.value })}
                >
                  <MenuItem value="Full Time Position">Full Time</MenuItem>
                  <MenuItem value="Part Time Position">Part Time</MenuItem>
                  <MenuItem value="Contract Position">Contract</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Salary"
                type="number"
                value={job.salary}
                onChange={(e) => setJob({ ...job, salary: e.target.value })}
                InputProps={{
                  startAdornment: <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Job Description"
                value={job.description}
                onChange={(e) => setJob({ ...job, description: e.target.value })}
                InputProps={{
                  startAdornment: <Description sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            {/* Requirements */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              {job.requirements.map((req, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    required
                    label={`Requirement ${index + 1}`}
                    value={req}
                    onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveArrayField('requirements', index)}
                    disabled={job.requirements.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddArrayField('requirements')}
                sx={{ mt: 1 }}
              >
                Add Requirement
              </Button>
            </Grid>

            {/* Benefits */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Benefits
              </Typography>
              {job.benefits.map((benefit, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    required
                    label={`Benefit ${index + 1}`}
                    value={benefit}
                    onChange={(e) => handleArrayFieldChange('benefits', index, e.target.value)}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveArrayField('benefits', index)}
                    disabled={job.benefits.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddArrayField('benefits')}
                sx={{ mt: 1 }}
              >
                Add Benefit
              </Button>
            </Grid>

            {/* Responsibilities */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Responsibilities
              </Typography>
              {job.responsibilities.map((resp, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    required
                    label={`Responsibility ${index + 1}`}
                    value={resp}
                    onChange={(e) => handleArrayFieldChange('responsibilities', index, e.target.value)}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveArrayField('responsibilities', index)}
                    disabled={job.responsibilities.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddArrayField('responsibilities')}
                sx={{ mt: 1 }}
              >
                Add Responsibility
              </Button>
            </Grid>

            {/* Required Skills */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Required Skills
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {job.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleRemoveArrayField('skills', index)}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Add Skill"
                  value={job.skills[job.skills.length - 1]}
                  onChange={(e) => handleArrayFieldChange('skills', job.skills.length - 1, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddArrayField('skills');
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => handleAddArrayField('skills')}
                >
                  Add
                </Button>
              </Box>
            </Grid>

            {/* Company Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Company Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Size"
                value={job.companyInfo.size}
                onChange={(e) => handleCompanyInfoChange('size', e.target.value)}
                InputProps={{
                  startAdornment: <Group sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Industry"
                value={job.companyInfo.industry}
                onChange={(e) => handleCompanyInfoChange('industry', e.target.value)}
                InputProps={{
                  startAdornment: <Work sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Founded Year"
                type="number"
                value={job.companyInfo.founded}
                onChange={(e) => handleCompanyInfoChange('founded', e.target.value)}
                InputProps={{
                  startAdornment: <School sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Website"
                value={job.companyInfo.website}
                onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
                InputProps={{
                  startAdornment: <Language sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                >
                  Post Job
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default PostJob; 