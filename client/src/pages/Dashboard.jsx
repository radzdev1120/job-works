import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
  Alert,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Menu,
} from '@mui/material';
import {
  Bookmark,
  Work,
  LocationOn,
  AttachMoney,
  AccessTime,
  Search,
  Sort,
  FilterList,
  CheckCircle,
  Pending,
  Cancel,
  MoreVert,
  Delete,
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    // Load saved and applied jobs
    const savedJobIds = JSON.parse(localStorage.getItem(`savedJobs_${user.email}`) || '[]');
    const applied = JSON.parse(localStorage.getItem(`appliedJobs_${user.email}`) || '[]');
    
    // Load all jobs to get details
    const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    
    // Filter and map saved jobs
    const savedJobsWithDetails = allJobs.filter(job => savedJobIds.includes(job._id));
    
    // Filter and map applied jobs with application details
    const appliedJobsWithDetails = allJobs
      .filter(job => applied.includes(job._id))
      .map(job => {
        const application = job.applications?.find(app => app.applicantEmail === user.email);
        return {
          ...job,
          applicationDetails: application
        };
      });

    setSavedJobs(savedJobsWithDetails);
    setAppliedJobs(appliedJobsWithDetails);
    setAllJobs(allJobs);
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleRemoveSavedJob = (jobId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const updatedSavedJobs = savedJobs.filter(job => job._id !== jobId);
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem(`savedJobs_${user.email}`, JSON.stringify(updatedSavedJobs.map(job => job._id)));
    
    setSnackbar({
      open: true,
      message: 'Job removed from saved jobs',
      severity: 'success'
    });
  };

  const handleUpdateApplicationStatus = (jobId, newStatus) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    
    const updatedJobs = allJobs.map(job => {
      if (job._id === jobId) {
        const updatedApplications = job.applications.map(app => {
          if (app.applicantEmail === user.email) {
            return { ...app, status: newStatus };
          }
          return app;
        });
        return { ...job, applications: updatedApplications };
      }
      return job;
    });

    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    
    // Update local state
    const updatedAppliedJobs = appliedJobs.map(job => {
      if (job._id === jobId) {
        return {
          ...job,
          applicationDetails: {
            ...job.applicationDetails,
            status: newStatus
          }
        };
      }
      return job;
    });

    setAppliedJobs(updatedAppliedJobs);
    setSnackbar({
      open: true,
      message: 'Application status updated',
      severity: 'success'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle />;
      case 'pending':
        return <Pending />;
      case 'rejected':
        return <Cancel />;
      default:
        return null;
    }
  };

  const sortJobs = (jobs) => {
    return [...jobs].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        case 'salary':
          comparison = parseInt(b.salary) - parseInt(a.salary);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });
  };

  const filterJobs = (jobs) => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
        (job.applicationDetails?.status === filterStatus);

      return matchesSearch && matchesStatus;
    });
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!jobToDelete) return;

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      // Get current saved job IDs from localStorage
      const savedJobIds = JSON.parse(localStorage.getItem(`savedJobs_${user.email}`) || '[]');
      
      // Remove the job ID from the array
      const updatedSavedJobIds = savedJobIds.filter(id => id !== jobToDelete._id);
      
      // Update localStorage
      localStorage.setItem(`savedJobs_${user.email}`, JSON.stringify(updatedSavedJobIds));
      
      // Update state
      setSavedJobs(prevJobs => prevJobs.filter(job => job._id !== jobToDelete._id));

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

  const getJobDetails = (jobId) => {
    return allJobs.find(job => job._id === jobId);
  };

  const renderJobCard = (job, isSaved = false) => {
    const isApplied = job.applicationDetails !== undefined;
    const applicationStatus = job.applicationDetails?.status;

    return (
      <Card key={job._id} sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" gutterBottom>
                  {job.title}
                </Typography>
              </Box>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                {job.company}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  icon={<Work />}
                  label={job.jobType}
                  size="small"
                />
                <Chip
                  icon={<LocationOn />}
                  label={job.location}
                  size="small"
                />
                <Chip
                  icon={<AttachMoney />}
                  label={`$${job.salary}`}
                  size="small"
                />
                <Chip
                  icon={<AccessTime />}
                  label={new Date(job.createdAt).toLocaleDateString()}
                  size="small"
                />
                {isApplied && (
                  <Chip
                    label={applicationStatus}
                    color={getStatusColor(applicationStatus)}
                    size="small"
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {job.description}
              </Typography>
              {isApplied && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Application Message:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.applicationDetails.message}
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={4} sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              gap: 1,
            }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/jobs/${job._id}`)}
              >
                View Details
              </Button>
              {isApplied ? (
                <Button
                  variant="contained"
                  onClick={(e) => {
                    setSelectedJob(job);
                    setAnchorEl(e.currentTarget);
                  }}
                >
                  Update Status
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => navigate(`/jobs/${job._id}`)}
                >
                  Apply Now
                </Button>
              )}
              {isSaved && (
                <Tooltip title="Remove from saved jobs">
                  <IconButton 
                    onClick={() => handleDeleteClick(job)}
                    color="error"
                    size="small"
                    sx={{ alignSelf: 'flex-end' }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderFilters = () => (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        size="small"
        placeholder="Search jobs..."
        value={searchQuery}
        onChange={handleSearch}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{ minWidth: 200 }}
      />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          label="Sort By"
          onChange={(e) => handleSort(e.target.value)}
          startAdornment={<Sort sx={{ mr: 1, color: 'text.secondary' }} />}
        >
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="salary">Salary</MenuItem>
          <MenuItem value="title">Title</MenuItem>
        </Select>
      </FormControl>
      {activeTab === 1 && (
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={handleStatusFilter}
            startAdornment={<FilterList sx={{ mr: 1, color: 'text.secondary' }} />}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      )}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Job Type</InputLabel>
        <Select
          value={filterType}
          label="Job Type"
          onChange={(e) => setFilterType(e.target.value)}
          startAdornment={<Work sx={{ mr: 1, color: 'text.secondary' }} />}
        >
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value="Full Time Position">Full Time</MenuItem>
          <MenuItem value="Part Time Position">Part Time</MenuItem>
          <MenuItem value="Contract Position">Contract</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label={`Saved Jobs (${savedJobs.length})`} />
          <Tab label={`Applied Jobs (${appliedJobs.length})`} />
        </Tabs>
      </Box>

      {renderFilters()}

      {activeTab === 0 && (
        <Box>
          {savedJobs.length === 0 ? (
            <Alert severity="info">
              You haven't saved any jobs yet. Browse jobs and click the "Save Job" button to save interesting positions.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {filterJobs(sortJobs(savedJobs)).map(job => (
                <Grid item xs={12} key={job._id}>
                  {renderJobCard(job, true)}
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          {appliedJobs.length === 0 ? (
            <Alert severity="info">
              You haven't applied to any jobs yet. Browse jobs and click the "Apply Now" button to submit your applications.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {filterJobs(sortJobs(appliedJobs)).map(job => (
                <Grid item xs={12} key={job._id}>
                  {renderJobCard(job)}
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Status Update Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          handleUpdateApplicationStatus(selectedJob._id, 'pending');
          setAnchorEl(null);
        }}>
          Mark as Pending
        </MenuItem>
        <MenuItem onClick={() => {
          handleUpdateApplicationStatus(selectedJob._id, 'accepted');
          setAnchorEl(null);
        }}>
          Mark as Accepted
        </MenuItem>
        <MenuItem onClick={() => {
          handleUpdateApplicationStatus(selectedJob._id, 'rejected');
          setAnchorEl(null);
        }}>
          Mark as Rejected
        </MenuItem>
      </Menu>

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

export default Dashboard; 