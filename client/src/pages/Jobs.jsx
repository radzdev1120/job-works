import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Tooltip,
  Slider,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Send as SendIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobType, setJobType] = useState('all');
  const [location, setLocation] = useState('all');
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [experienceLevel, setExperienceLevel] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(null);
  const jobsPerPage = 5;

  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    try {
      // Load jobs from localStorage
      let storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      
      // If no jobs exist, add sample jobs
      if (storedJobs.length === 0) {
        const sampleJobs = [
          {
            _id: '1',
            title: 'Senior Frontend Developer',
            company: 'Tech Innovations Inc.',
            location: 'San Francisco, CA',
            jobType: 'Full Time Position',
            salary: '130000',
            description: 'We are looking for a Senior Frontend Developer to join our team and help build the next generation of web applications.',
            requirements: [
              '5+ years of experience with modern JavaScript frameworks',
              'Strong expertise in React, Vue, or Angular',
              'Experience with state management (Redux, Vuex)',
              'Proficiency in HTML5, CSS3, and responsive design'
            ],
            responsibilities: [
              'Develop and maintain high-quality user interfaces',
              'Collaborate with UX/UI designers to implement designs',
              'Write clean, maintainable, and efficient code'
            ],
            benefits: [
              'Competitive salary and equity package',
              'Health, dental, and vision insurance',
              '401(k) matching',
              'Flexible work hours and remote options'
            ],
            skills: ['React', 'TypeScript', 'Redux', 'CSS/SASS', 'Jest'],
            status: 'active',
            applications: [],
            createdAt: new Date().toISOString(),
            postedBy: 'recruiter@example.com'
          },
          {
            _id: '2',
            title: 'Backend Developer',
            company: 'Data Systems Corp',
            location: 'Remote',
            jobType: 'Full Time Position',
            salary: '120000',
            description: 'Join our backend team to build scalable and efficient server-side applications.',
            requirements: [
              '4+ years of backend development experience',
              'Strong knowledge of Node.js, Python, or Java',
              'Experience with SQL and NoSQL databases'
            ],
            responsibilities: [
              'Design and implement RESTful APIs',
              'Develop and maintain database schemas',
              'Implement security best practices'
            ],
            benefits: [
              'Competitive salary',
              'Remote-first work environment',
              'Health insurance',
              'Learning and development budget'
            ],
            skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'AWS'],
            status: 'active',
            applications: [],
            createdAt: new Date().toISOString(),
            postedBy: 'recruiter@example.com'
          },
          {
            _id: '3',
            title: 'Full Stack Developer',
            company: 'Digital Solutions Ltd',
            location: 'New York, NY',
            jobType: 'Full Time Position',
            salary: '140000',
            description: 'We are seeking a Full Stack Developer to work on both frontend and backend development.',
            requirements: [
              '5+ years of full stack development experience',
              'Proficiency in JavaScript/TypeScript',
              'Experience with React and Node.js',
              'Knowledge of SQL and NoSQL databases'
            ],
            responsibilities: [
              'Develop full stack features',
              'Design and implement APIs',
              'Create responsive user interfaces',
              'Optimize application performance'
            ],
            benefits: [
              'Competitive salary with bonus',
              'Health and wellness benefits',
              'Stock options',
              'Professional development'
            ],
            skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
            status: 'active',
            applications: [],
            createdAt: new Date().toISOString(),
            postedBy: 'recruiter@example.com'
          },
          {
            _id: '4',
            title: 'DevOps Engineer',
            company: 'Cloud Technologies Inc',
            location: 'Remote',
            jobType: 'Full Time Position',
            salary: '150000',
            description: 'Join our DevOps team to build and maintain our cloud infrastructure.',
            requirements: [
              '4+ years of DevOps experience',
              'Strong knowledge of AWS or Azure',
              'Experience with Docker and Kubernetes',
              'Proficiency in infrastructure as code'
            ],
            responsibilities: [
              'Design and maintain cloud infrastructure',
              'Implement and improve CI/CD pipelines',
              'Monitor system performance',
              'Implement security measures'
            ],
            benefits: [
              'Competitive salary with equity',
              'Remote work options',
              'Health insurance',
              'Cloud certification reimbursement'
            ],
            skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
            status: 'active',
            applications: [],
            createdAt: new Date().toISOString(),
            postedBy: 'recruiter@example.com'
          },
          {
            _id: '5',
            title: 'Mobile App Developer',
            company: 'App Innovations',
            location: 'Los Angeles, CA',
            jobType: 'Full Time Position',
            salary: '125000',
            description: 'We are looking for a Mobile App Developer to create beautiful and functional mobile applications.',
            requirements: [
              '3+ years of mobile development experience',
              'Proficiency in React Native or Flutter',
              'Experience with native iOS/Android development',
              'Understanding of mobile UI/UX principles'
            ],
            responsibilities: [
              'Develop cross-platform mobile applications',
              'Implement responsive UI components',
              'Integrate with backend services',
              'Optimize app performance'
            ],
            benefits: [
              'Competitive salary',
              'Health benefits',
              'Mobile device allowance',
              'Professional development'
            ],
            skills: ['React Native', 'Flutter', 'JavaScript', 'iOS', 'Android'],
            status: 'active',
            applications: [],
            createdAt: new Date().toISOString(),
            postedBy: 'recruiter@example.com'
          }
        ];
        localStorage.setItem('jobs', JSON.stringify(sampleJobs));
        storedJobs = sampleJobs;
      }

      // Always ensure we have sample jobs available
      const sampleJobs = [
        {
          _id: 'sample1',
          title: 'Data Scientist',
          company: 'AI Solutions Inc',
          location: 'Boston, MA',
          jobType: 'Full Time Position',
          salary: '145000',
          description: 'Join our data science team to build and deploy machine learning models.',
          requirements: [
            '4+ years of experience in data science',
            'Strong knowledge of Python and ML frameworks',
            'Experience with big data technologies',
            'PhD or MS in Computer Science or related field'
          ],
          responsibilities: [
            'Develop and deploy machine learning models',
            'Analyze large datasets',
            'Collaborate with product teams',
            'Present findings to stakeholders'
          ],
          benefits: [
            'Competitive salary',
            'Health insurance',
            '401(k) matching',
            'Professional development'
          ],
          skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'AWS'],
          status: 'active',
          applications: [],
          createdAt: new Date().toISOString(),
          postedBy: 'system'
        },
        {
          _id: 'sample2',
          title: 'UX/UI Designer',
          company: 'Creative Design Studio',
          location: 'Remote',
          jobType: 'Full Time Position',
          salary: '110000',
          description: 'We are seeking a talented UX/UI Designer to create beautiful and intuitive user interfaces.',
          requirements: [
            '3+ years of UX/UI design experience',
            'Strong portfolio demonstrating design skills',
            'Experience with design tools (Figma, Sketch)',
            'Understanding of user-centered design principles'
          ],
          responsibilities: [
            'Create user-centered designs',
            'Develop wireframes and prototypes',
            'Conduct user research',
            'Collaborate with development team'
          ],
          benefits: [
            'Competitive salary',
            'Remote work options',
            'Health benefits',
            'Design software subscription'
          ],
          skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping'],
          status: 'active',
          applications: [],
          createdAt: new Date().toISOString(),
          postedBy: 'system'
        },
        {
          _id: 'sample3',
          title: 'Cloud Solutions Architect',
          company: 'CloudScale Technologies',
          location: 'Seattle, WA',
          jobType: 'Full Time Position',
          salary: '180000',
          description: 'Lead the design and implementation of cloud infrastructure solutions for enterprise clients.',
          requirements: [
            '8+ years of cloud architecture experience',
            'Expert knowledge of AWS, Azure, or GCP',
            'Experience with microservices architecture',
            'Strong understanding of security best practices'
          ],
          responsibilities: [
            'Design scalable cloud architectures',
            'Lead technical discussions with clients',
            'Create technical documentation',
            'Mentor junior team members'
          ],
          benefits: [
            'Competitive salary with equity',
            'Comprehensive health coverage',
            'Cloud certification reimbursement',
            'Flexible work arrangements'
          ],
          skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes'],
          status: 'active',
          applications: [],
          createdAt: new Date().toISOString(),
          postedBy: 'system'
        },
        {
          _id: 'sample4',
          title: 'Security Engineer',
          company: 'CyberDefense Inc',
          location: 'Austin, TX',
          jobType: 'Full Time Position',
          salary: '160000',
          description: 'Join our security team to protect our systems and data from cyber threats.',
          requirements: [
            '5+ years of security engineering experience',
            'Experience with security tools and frameworks',
            'Knowledge of network security protocols',
            'Certifications (CISSP, CEH, or similar)'
          ],
          responsibilities: [
            'Implement security measures',
            'Conduct security assessments',
            'Respond to security incidents',
            'Develop security policies'
          ],
          benefits: [
            'Competitive salary',
            'Health and dental insurance',
            'Security training budget',
            'Remote work options'
          ],
          skills: ['Security', 'Networking', 'Python', 'SIEM', 'Firewall'],
          status: 'active',
          applications: [],
          createdAt: new Date().toISOString(),
          postedBy: 'system'
        },
        {
          _id: 'sample5',
          title: 'Product Manager',
          company: 'Innovation Labs',
          location: 'Chicago, IL',
          jobType: 'Full Time Position',
          salary: '135000',
          description: 'Lead product development and strategy for our enterprise software solutions.',
          requirements: [
            '5+ years of product management experience',
            'Experience with agile methodologies',
            'Strong analytical and problem-solving skills',
            'Excellent communication abilities'
          ],
          responsibilities: [
            'Define product strategy and roadmap',
            'Gather and prioritize requirements',
            'Work with development teams',
            'Analyze market trends'
          ],
          benefits: [
            'Competitive salary with bonus',
            'Health insurance',
            '401(k) matching',
            'Professional development'
          ],
          skills: ['Product Management', 'Agile', 'JIRA', 'Analytics', 'Strategy'],
          status: 'active',
          applications: [],
          createdAt: new Date().toISOString(),
          postedBy: 'system'
        },
        {
          _id: 'sample6',
          title: 'Machine Learning Engineer',
          company: 'AI Research Labs',
          location: 'San Francisco, CA',
          jobType: 'Full Time Position',
          salary: '170000',
          description: 'Join our AI team to develop and deploy cutting-edge machine learning models.',
          requirements: [
            '5+ years of ML engineering experience',
            'Strong background in deep learning',
            'Experience with PyTorch or TensorFlow',
            'PhD in Computer Science or related field'
          ],
          responsibilities: [
            'Develop ML models and algorithms',
            'Optimize model performance',
            'Deploy models to production',
            'Collaborate with research team'
          ],
          benefits: [
            'Competitive salary with equity',
            'Health and wellness benefits',
            'Research publication support',
            'Conference attendance'
          ],
          skills: ['Python', 'PyTorch', 'TensorFlow', 'MLOps', 'AWS'],
          status: 'active',
          applications: [],
          createdAt: new Date().toISOString(),
          postedBy: 'system'
        },
        {
          _id: 'sample7',
          title: 'Blockchain Developer',
          company: 'Crypto Innovations',
          location: 'Miami, FL',
          jobType: 'Full Time Position',
          salary: '150000',
          description: 'Build and maintain blockchain-based applications and smart contracts.',
          requirements: [
            '3+ years of blockchain development',
            'Experience with Solidity and Web3',
            'Understanding of DeFi protocols',
            'Knowledge of blockchain security'
          ],
          responsibilities: [
            'Develop smart contracts',
            'Build DApps',
            'Implement blockchain solutions',
            'Ensure security best practices'
          ],
          benefits: [
            'Competitive salary',
            'Crypto compensation options',
            'Remote work flexibility',
            'Learning budget'
          ],
          skills: ['Solidity', 'Web3', 'Ethereum', 'Smart Contracts', 'DeFi'],
          status: 'active',
          applications: [],
          createdAt: new Date().toISOString(),
          postedBy: 'system'
        },
        {
          _id: 'sample8',
          title: 'Game Developer',
          company: 'Game Studios Inc',
          location: 'Los Angeles, CA',
          jobType: 'Full Time Position',
          salary: '130000',
          description: 'Create engaging and innovative gaming experiences using Unity or Unreal Engine.',
          requirements: [
            '4+ years of game development experience',
            'Proficiency in Unity or Unreal Engine',
            'Strong C++ or C# skills',
            'Experience with 3D graphics'
          ],
          responsibilities: [
            'Develop game features',
            'Implement game mechanics',
            'Optimize performance',
            'Collaborate with artists'
          ],
          benefits: [
            'Competitive salary',
            'Health benefits',
            'Game development tools',
            'Creative environment'
          ],
          skills: ['Unity', 'Unreal', 'C++', 'C#', '3D Graphics'],
          status: 'active',
          applications: [],
          createdAt: new Date().toISOString(),
          postedBy: 'system'
        },
        {
          _id: 'sample9',
          title: 'AR/VR Developer',
          company: 'Immersive Tech',
          location: 'Seattle, WA',
          jobType: 'Full Time Position',
          salary: '140000',
          description: 'Create immersive augmented and virtual reality experiences.',
          requirements: [
            '3+ years of AR/VR development',
            'Experience with Unity or Unreal',
            'Knowledge of 3D modeling',
            'Understanding of spatial computing'
          ],
          responsibilities: [
            'Develop AR/VR applications',
            'Create interactive experiences',
            'Optimize performance',
            'Test on various devices'
          ],
          benefits: [
            'Competitive salary',
            'Health insurance',
            'AR/VR equipment provided',
            'Professional development'
          ],
          skills: ['Unity', 'AR/VR', '3D Modeling', 'C#', 'Spatial Computing'],
          status: 'active',
          applications: [],
          createdAt: new Date().toISOString(),
          postedBy: 'system'
        },
        {
          _id: 'sample10',
          title: 'Quantum Computing Engineer',
          company: 'Quantum Solutions',
          location: 'Boston, MA',
          jobType: 'Full Time Position',
          salary: '200000',
          description: 'Work on cutting-edge quantum computing algorithms and applications.',
          requirements: [
            'PhD in Physics, Computer Science, or related field',
            'Experience with quantum algorithms',
            'Knowledge of quantum programming',
            'Strong mathematical background'
          ],
          responsibilities: [
            'Develop quantum algorithms',
            'Implement quantum circuits',
            'Research quantum applications',
            'Collaborate with research team'
          ],
          benefits: [
            'Competitive salary with equity',
            'Health and wellness benefits',
            'Research publication support',
            'Conference attendance'
          ],
          skills: ['Quantum Computing', 'Python', 'Qiskit', 'Linear Algebra', 'Physics'],
          status: 'active',
          applications: [],
          createdAt: new Date().toISOString(),
          postedBy: 'system'
        }
      ];

      // Combine recruiter jobs with sample jobs, avoiding duplicates
      const allJobs = [...storedJobs];
      sampleJobs.forEach(sampleJob => {
        if (!allJobs.some(job => job._id === sampleJob._id)) {
          allJobs.push(sampleJob);
        }
      });

      console.log('Loaded jobs:', allJobs);
      setJobs(allJobs);

      // Load saved and applied jobs
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const saved = JSON.parse(localStorage.getItem(`savedJobs_${userData.email}`) || '[]');
        const applied = JSON.parse(localStorage.getItem(`appliedJobs_${userData.email}`) || '[]');
        setSavedJobs(saved);
        setAppliedJobs(applied);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again later.');
    }
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleJobTypeChange = (e) => {
    setJobType(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSaveJob = (jobId) => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please log in to save jobs',
        severity: 'error'
      });
      return;
    }

    const isSaved = savedJobs.includes(jobId);
    let updatedSavedJobs;

    if (isSaved) {
      updatedSavedJobs = savedJobs.filter(id => id !== jobId);
    } else {
      updatedSavedJobs = [...savedJobs, jobId];
    }

    setSavedJobs(updatedSavedJobs);
    localStorage.setItem(`savedJobs_${user.email}`, JSON.stringify(updatedSavedJobs));

    setSnackbar({
      open: true,
      message: isSaved ? 'Job removed from saved jobs' : 'Job saved successfully',
      severity: 'success'
    });
  };

  const handleApply = (job) => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please log in to apply for jobs',
        severity: 'error'
      });
      return;
    }

    if (appliedJobs.includes(job._id)) {
      setSnackbar({
        open: true,
        message: 'You have already applied for this job',
        severity: 'info'
      });
      return;
    }

    setSelectedJob(job);
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

    const updatedAppliedJobs = [...appliedJobs, selectedJob._id];
    setAppliedJobs(updatedAppliedJobs);
    localStorage.setItem(`appliedJobs_${user.email}`, JSON.stringify(updatedAppliedJobs));

    // Update job applications in localStorage
    const updatedJobs = jobs.map(job => {
      if (job._id === selectedJob._id) {
        return {
          ...job,
          applications: [...(job.applications || []), {
            applicantEmail: user.email,
            message: applicationMessage,
            status: 'pending',
            appliedAt: new Date().toISOString()
          }]
        };
      }
      return job;
    });

    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));

    setSnackbar({
      open: true,
      message: 'Application submitted successfully',
      severity: 'success'
    });

    setApplyDialogOpen(false);
    setApplicationMessage('');
  };

  const handleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  const handleSalaryRangeChange = (event, newValue) => {
    setSalaryRange(newValue);
  };

  const handleExperienceLevelChange = (event) => {
    setExperienceLevel(event.target.value);
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
        (job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (job.company?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (job.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      
      const matchesJobType = jobType === 'all' || job.jobType === jobType;
      const matchesLocation = location === 'all' || 
        (job.location?.toLowerCase().includes(location.toLowerCase()) || false);
      
      const matchesSalary = parseInt(job.salary) >= salaryRange[0] && 
        parseInt(job.salary) <= salaryRange[1];

      const matchesExperience = experienceLevel === 'all' || 
        (job.requirements?.some(req => 
          req.toLowerCase().includes(experienceLevel.toLowerCase())
        ) || false);

      return matchesSearch && matchesJobType && matchesLocation && 
        matchesSalary && matchesExperience;
    });
  };

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate pagination
  const indexOfLastJob = page * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filterJobs(sortJobs(jobs)).slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filterJobs(sortJobs(jobs)).length / jobsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Find Your Next Opportunity
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search jobs, companies, or keywords"
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => handleSort(e.target.value)}
              >
                <MenuItem value="date">Date Posted</MenuItem>
                <MenuItem value="salary">Salary</MenuItem>
                <MenuItem value="title">Job Title</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Grid>
        </Grid>

        {/* Advanced Filters */}
        {showFilters && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Job Type</InputLabel>
                  <Select
                    value={jobType}
                    label="Job Type"
                    onChange={handleJobTypeChange}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="Full Time Position">Full Time</MenuItem>
                    <MenuItem value="Part Time Position">Part Time</MenuItem>
                    <MenuItem value="Contract Position">Contract</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={location}
                    label="Location"
                    onChange={handleLocationChange}
                  >
                    <MenuItem value="all">All Locations</MenuItem>
                    <MenuItem value="remote">Remote</MenuItem>
                    <MenuItem value="new york">New York</MenuItem>
                    <MenuItem value="san francisco">San Francisco</MenuItem>
                    <MenuItem value="london">London</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    value={experienceLevel}
                    label="Experience Level"
                    onChange={handleExperienceLevelChange}
                  >
                    <MenuItem value="all">All Levels</MenuItem>
                    <MenuItem value="entry">Entry Level</MenuItem>
                    <MenuItem value="mid">Mid Level</MenuItem>
                    <MenuItem value="senior">Senior Level</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Salary Range</Typography>
                <Slider
                  value={salaryRange}
                  onChange={handleSalaryRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={200000}
                  step={10000}
                  valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    ${salaryRange[0].toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${salaryRange[1].toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

      {/* Jobs List */}
      <Grid container spacing={3}>
        {currentJobs.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" color="text.secondary">
              No jobs found matching your criteria
            </Typography>
          </Grid>
        ) : (
          currentJobs.map((job) => (
            <Grid item xs={12} key={job._id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" gutterBottom>
                          {job.title}
                        </Typography>
                        <Tooltip title={savedJobs.includes(job._id) ? "Remove from saved" : "Save job"}>
                          <IconButton 
                            onClick={() => handleSaveJob(job._id)}
                            color={savedJobs.includes(job._id) ? "primary" : "default"}
                          >
                            {savedJobs.includes(job._id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
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
                        {appliedJobs.includes(job._id) && (
                          <Chip
                            label="Applied"
                            color="success"
                            size="small"
                          />
                        )}
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
                        variant="outlined"
                        onClick={() => handleViewJob(job._id)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<SendIcon />}
                        onClick={() => handleApply(job)}
                        disabled={appliedJobs.includes(job._id)}
                      >
                        {appliedJobs.includes(job._id) ? 'Applied' : 'Apply Now'}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Application Dialog */}
      <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
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

export default Jobs; 