import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs?limit=3');
        setFeaturedJobs(response.data);
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
      }
    };

    fetchFeaturedJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${searchQuery}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          width: '100%',
          maxWidth: '100%'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
          >
            Find Your Dream Job
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Connect with top employers and discover opportunities that match your skills and aspirations
          </Typography>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                maxWidth: 600,
                bgcolor: 'white',
                borderRadius: 1,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ ml: 2 }}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Jobs Section */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Jobs
        </Typography>
        <Grid container spacing={4}>
          {featuredJobs.map((job) => (
            <Grid item key={job._id} xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {job.location}
                  </Typography>
                  <Typography variant="body2">
                    {job.description.substring(0, 150)}...
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box
          sx={{
            mt: 8,
            textAlign: 'center',
            py: 4,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Ready to Start Your Job Search?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/jobs')}
            sx={{ mt: 2 }}
          >
            Browse All Jobs
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 