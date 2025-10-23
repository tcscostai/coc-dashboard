import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Chip,
  Container,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
} from '@mui/icons-material';

interface LoginProps {
  onLogin: (user: { name: string; title: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      onLogin({
        name: 'Heather Cianfrocco',
        title: 'EVP of Governance, Compliance and Information Security',
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
          radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
          radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(315deg, #66B2FF 0%, #0080FF 50%, #0066CC 100%)
        `,
        backgroundSize: '20px 20px, 30px 30px, 40px 40px, 100% 100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
      }}
    >
      {/* Background watermark */}
      <Box
        component="img"
        src="./images/logo.svg"
        alt="UHG Background Logo"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 250,
          height: 'auto',
          opacity: 0.05,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm">
        <Card
          elevation={8}
          sx={{
            borderRadius: 3,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                component="img"
                src="./images/logo.svg"
                alt="UHG Logo"
                sx={{
                  height: 56,
                  width: 'auto',
                  maxWidth: '280px',
                  mb: 2,
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                }}
              />
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                OCC Cove
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enterprise Command Center
              </Typography>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', borderTop: 1, borderColor: 'divider', pt: 2 }}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                UnitedHealth Group Enterprise Command Center
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                <Chip label="🔒 Secure" size="small" color="primary" variant="outlined" />
                <Chip label="🛡️ Protected" size="small" color="primary" variant="outlined" />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;