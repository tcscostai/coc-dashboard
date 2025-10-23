import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Container,
  Avatar,
} from '@mui/material';
import {
  KeyboardArrowDown,
} from '@mui/icons-material';
import AskAlexButton from './AskAlexButton';

interface WelcomeBannerProps {
  user: {
    name: string;
    title: string;
  };
  onRefresh: () => void;
  onViewChange: (view: 'grid' | 'list') => void;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ 
  user, 
  onRefresh, 
  onViewChange 
}) => {
  return (
    <Box
      sx={{
        background: `
          radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
          radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
          radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(315deg, #66B2FF 0%, #0080FF 50%, #0066CC 100%)
        `,
        backgroundSize: '20px 20px, 30px 30px, 40px 40px, 100% 100%',
        color: 'white',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Welcome and Stock Info - Side by Side */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          {/* Left - Welcome */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              src="./images/heather-sample.jpg"
              alt={user.name}
              sx={{
                width: 80,
                height: 80,
                border: '3px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Welcome, {user.name}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {user.title}
              </Typography>
            </Box>
          </Box>

          {/* Right - Stock Info */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              UNH: 361.15 USD
            </Typography>
            <Typography variant="body2" sx={{ color: '#FEE2E2' }}>
              -2.65 (-0.33%) today
            </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Portfolio • Last updated January 16, 2025
                </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4 }}>
          <AskAlexButton
            size="large"
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.25)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontSize: '0.95rem',
              fontWeight: 500,
              textTransform: 'none',
              letterSpacing: '0.3px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              transition: 'all 0.25s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
          <Button
            variant="outlined"
            endIcon={<KeyboardArrowDown />}
            size="large"
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.25)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontSize: '0.95rem',
              fontWeight: 500,
              textTransform: 'none',
              letterSpacing: '0.3px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              transition: 'all 0.25s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
              '& .MuiButton-endIcon': {
                transition: 'transform 0.25s ease',
              },
              '&:hover .MuiButton-endIcon': {
                transform: 'rotate(180deg)',
              },
            }}
          >
            Predictive Model-Based Recommendations
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default WelcomeBanner;