import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Bookmark as BookmarkIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem(`savedJobs_${user.email}`);
    localStorage.removeItem(`appliedJobs_${user.email}`);
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    
    // Close menu
    handleCloseUserMenu();
    
    // Redirect to login page
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main', height: '100%', width: '100%',
      }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <WorkIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            JOB-WORK
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={() => handleNavigate('/jobs')}>
                <Typography textAlign="center">Jobs</Typography>
              </MenuItem>
              {isAuthenticated && (
                <>
                  <MenuItem onClick={() => handleNavigate('/dashboard')}>
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  {user?.role === 'recruiter' && (
                    <MenuItem onClick={() => handleNavigate('/post-job')}>
                      <Typography textAlign="center">Post Job</Typography>
                    </MenuItem>
                  )}
                </>
              )}
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <WorkIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            JOB-WORK
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={() => handleNavigate('/jobs')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Jobs
            </Button>
            {isAuthenticated && (
              <>
                <Button
                  onClick={() => handleNavigate('/dashboard')}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Dashboard
                </Button>
                {user?.role === 'recruiter' && (
                  <Button
                    onClick={() => handleNavigate('/post-job')}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    Post Job
                  </Button>
                )}
              </>
            )}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.name} src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={() => handleNavigate('/profile')}>
                    <PersonIcon sx={{ mr: 1 }} />
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/dashboard')}>
                    <DashboardIcon sx={{ mr: 1 }} />
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => handleNavigate('/login')}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={() => handleNavigate('/register')}
                >
                  Register as JobSeeker
                </Button>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={() => handleNavigate('/employer-register')}
                >
                  Register as Employer
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 