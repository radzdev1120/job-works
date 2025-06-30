import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  AccessTime as AccessTimeIcon,
  Delete as DeleteIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material';

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const loadSavedJobs = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Load saved job IDs
        const savedJobIds = JSON.parse(localStorage.getItem(`savedJobs_${userData.email}`) || '[]');
        setSavedJobs(savedJobIds);

        // Load all jobs
        const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        
        // Filter jobs that are in savedJobIds
        const savedJobDetails = allJobs.filter(job => savedJobIds.includes(job._id));
        setJobs(savedJobDetails);
      }
    } catch (error) {
      console.error('Error loading saved jobs:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load saved jobs',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!jobToDelete || !user) return;

    try {
      // Get current saved jobs
      const currentSavedJobs = JSON.parse(localStorage.getItem(`savedJobs_${user.email}`) || '[]');
      
      // Remove the job ID from saved jobs
      const updatedSavedJobs = currentSavedJobs.filter(id => id !== jobToDelete._id);
      
      // Update localStorage
      localStorage.setItem(`savedJobs_${user.email}`, JSON.stringify(updatedSavedJobs));
      
      // Update state
      setSavedJobs(updatedSavedJobs);
      setJobs(jobs.filter(job => job._id !== jobToDelete._id));

      setSnackbar({
        open: true,
        message: 'Job removed from saved jobs',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error removing saved job:', error);
      setSnackbar({
        open: true,
        message: 'Failed to remove job from saved jobs',
        severity: 'error'
      });
    }

    setDeleteDialogOpen(false);
    setJobToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          Please log in to view your saved jobs
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Saved Jobs
      </Typography>

      {jobs.length === 0 ? (
        <Alert severity="info">
          You haven't saved any jobs yet. Browse jobs and save the ones you're interested in!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} key={job._id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" gutterBottom>
                          {job.title}
                        </Typography>
                        <Tooltip title="Remove from saved jobs">
                          <IconButton 
                            onClick={() => handleDeleteClick(job)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {job.company}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip
                          icon={<WorkIcon />}
                          label={job.jobType}
                          size="small"
                        />
                        <Chip
                          icon={<LocationIcon />}
                          label={job.location}
                          size="small"
                        />
                        <Chip
                          icon={<MoneyIcon />}
                          label={`$${job.salary}`}
                          size="small"
                        />
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={new Date(job.createdAt).toLocaleDateString()}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {job.description}
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {job.skills?.slice(0, 3).map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {job.skills?.length > 3 && (
                          <Chip
                            label={`+${job.skills.length - 3} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: { xs: 'flex-start', md: 'flex-end' },
                      gap: 1,
                    }}>
                      <Button
                        variant="contained"
                        onClick={() => handleViewJob(job._id)}
                      >
                        View Details
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Remove Saved Job</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove "{jobToDelete?.title}" from your saved jobs?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default SavedJobs; 