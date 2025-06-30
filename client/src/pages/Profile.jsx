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
  Avatar,
  Chip,
  Divider,
  IconButton,
  Card,
  CardContent,
  Link,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setProfile(JSON.parse(storedUser));
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('user', JSON.stringify(profile));
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError('Failed to update profile');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAddSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    const storedUser = localStorage.getItem('user');
    setProfile(JSON.parse(storedUser));
  };

  if (!profile) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Overview Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                }}
              >
                {profile.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {profile.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {profile.role === 'recruiter' ? profile.position : profile.profession}
              </Typography>
              {profile.role === 'recruiter' && (
                <Typography variant="body1" color="primary" gutterBottom>
                  {profile.company}
                </Typography>
              )}

              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon color="action" />
                  <Typography variant="body2">{profile.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="action" />
                  <Typography variant="body2">{profile.phone}</Typography>
                </Box>
                {profile.website && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LanguageIcon color="action" />
                    <Link href={profile.website} target="_blank" rel="noopener">
                      {profile.website}
                    </Link>
                  </Box>
                )}
                {profile.linkedin && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinkedInIcon color="action" />
                    <Link href={profile.linkedin} target="_blank" rel="noopener">
                      LinkedIn Profile
                    </Link>
                  </Box>
                )}
                {profile.github && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GitHubIcon color="action" />
                    <Link href={profile.github} target="_blank" rel="noopener">
                      GitHub Profile
                    </Link>
                  </Box>
                )}
              </Box>

              <Button
                variant="contained"
                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
                sx={{ mt: 2 }}
                fullWidth
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
              {isEditing && (
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  sx={{ mt: 1 }}
                  fullWidth
                >
                  Cancel
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                sx={{ mb: 3 }}
              />
            ) : (
              <Typography variant="body1" paragraph>
                {profile.bio}
              </Typography>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {profile.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={isEditing ? () => handleRemoveSkill(skill) : undefined}
                />
              ))}
            </Box>
            {isEditing && (
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                  size="small"
                  label="Add Skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddSkill}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Experience
            </Typography>
            {profile.experience.map((exp, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {exp.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {exp.company} • {exp.duration}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {exp.description}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            {profile.education.map((edu, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {edu.degree}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {edu.school} • {edu.year}
                </Typography>
              </Box>
            ))}

            {profile.role === 'jobseeker' && profile.resume && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon color="action" />
                  <Link href={profile.resume} target="_blank" rel="noopener">
                    View Resume
                  </Link>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 