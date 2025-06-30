import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocationOn,
  Work,
  AttachMoney,
  Business,
  CalendarToday,
  School,
  Star,
  Description,
  CheckCircle,
  Group,
  Language,
  AccessTime,
  Bookmark,
  BookmarkBorder,
  Send,
} from '@mui/icons-material';
import useApi from '../hooks/useApi';
import { JobDetailsSkeleton } from '../components/Skeleton';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { get, loading, error } = useApi();
  const [job, setJob] = useState(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load saved and applied jobs
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const saved = JSON.parse(localStorage.getItem(`savedJobs_${userData.email}`) || '[]');
      const applied = JSON.parse(localStorage.getItem(`appliedJobs_${userData.email}`) || '[]');
      setSavedJobs(saved);
      setAppliedJobs(applied);
    }

    // Load job details
    try {
      const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      const foundJob = jobs.find(j => j._id === id);
      if (foundJob) {
        setJob(foundJob);
      } else {
        setError('Job not found');
      }
    } catch (error) {
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleSaveJob = () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please login to save jobs',
        severity: 'error'
      });
      return;
    }

    const isSaved = savedJobs.includes(job._id);
    let updatedSavedJobs;
    if (isSaved) {
      updatedSavedJobs = savedJobs.filter(savedId => savedId !== job._id);
    } else {
      updatedSavedJobs = [...savedJobs, job._id];
    }
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem(`savedJobs_${user.email}`, JSON.stringify(updatedSavedJobs));
    setSnackbar({
      open: true,
      message: isSaved ? 'Job removed from saved jobs' : 'Job saved successfully',
      severity: 'success'
    });
  };

  const handleApply = () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please login to apply for jobs',
        severity: 'error'
      });
      return;
    }
    const hasApplied = appliedJobs.includes(id);
    if (hasApplied) {
      setSnackbar({
        open: true,
        message: 'You have already applied for this job',
        severity: 'info'
      });
      return;
    }
    setApplyDialogOpen(true);
  };

  const handleSubmitApplication = () => {
    if (!applicationMessage.trim()) {
      setSnackbar({
        open: true,
        message: 'Please add a message to your application',
        severity: 'error'
      });
      return;
    }
    const updatedAppliedJobs = [...appliedJobs, id];
    setAppliedJobs(updatedAppliedJobs);
    localStorage.setItem(`appliedJobs_${user.email}`, JSON.stringify(updatedAppliedJobs));

    // Update job applications
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const updatedJobs = jobs.map(j => {
      if (j._id === id) {
        return {
          ...j,
          applications: [...(j.applications || []), {
            applicantEmail: user.email,
            message: applicationMessage,
            status: 'pending',
            appliedAt: new Date().toISOString()
          }]
        };
      }
      return j;
    });

    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    setJob(updatedJobs.find(j => j._id === id));

    setSnackbar({
      open: true,
      message: 'Application submitted successfully',
      severity: 'success'
    });

    setApplyDialogOpen(false);
    setApplicationMessage('');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return <JobDetailsSkeleton />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Job not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        {/* Header Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {job.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {job.company}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Chip
                icon={<LocationOn />}
                label={job.location}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<Work />}
                label={job.jobType}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<AttachMoney />}
                label={`$${job.salary.toLocaleString()} per year`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleApply}
                disabled={appliedJobs.includes(job._id)}
                startIcon={appliedJobs.includes(job._id) ? <CheckCircle /> : <Send />}
              >
                {appliedJobs.includes(job._id) ? 'Applied' : 'Apply Now'}
              </Button>
              <Button
                variant="outlined"
                color={savedJobs.includes(job._id) ? "primary" : "default"}
                size="large"
                fullWidth
                startIcon={savedJobs.includes(job._id) ? <Bookmark /> : <BookmarkBorder />}
                onClick={handleSaveJob}
              >
                {savedJobs.includes(job._id) ? 'Saved' : 'Save Job'}
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Main Content */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Job Description */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Job Description
              </Typography>
              <Typography variant="body1" paragraph>
                {job.description}
              </Typography>
            </Box>

            {/* Requirements */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              <List>
                {job.requirements.map((req, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={req} />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Responsibilities */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Responsibilities
              </Typography>
              <List>
                {job.responsibilities.map((resp, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Star color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={resp} />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Skills */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Required Skills
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {job.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Company Information */}
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Company Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Business />
                    </ListItemIcon>
                    <ListItemText
                      primary="Company Size"
                      secondary={job.companyInfo.size}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Work />
                    </ListItemIcon>
                    <ListItemText
                      primary="Industry"
                      secondary={job.companyInfo.industry}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Founded"
                      secondary={job.companyInfo.founded}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Language />
                    </ListItemIcon>
                    <ListItemText
                      primary="Website"
                      secondary={
                        <a
                          href={job.companyInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit' }}
                        >
                          {job.companyInfo.website.replace('https://', '')}
                        </a>
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card elevation={2} sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Benefits & Perks
                </Typography>
                <List>
                  {job.benefits.map((benefit, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Star color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card elevation={2} sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Job Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime />
                    </ListItemIcon>
                    <ListItemText
                      primary="Posted"
                      secondary={new Date(job.createdAt).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Work />
                    </ListItemIcon>
                    <ListItemText
                      primary="Employment Type"
                      secondary={job.jobType}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location"
                      secondary={job.location}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Application Dialog */}
      <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for {job.title}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Why are you interested in this position?"
            value={applicationMessage}
            onChange={(e) => setApplicationMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitApplication} variant="contained">
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default JobDetails; 