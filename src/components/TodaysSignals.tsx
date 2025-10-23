import React from 'react';
import {
  Box,
  Container,
  Chip,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { TrendingUp, TrendingDown, Info } from '@mui/icons-material';
import { useData } from '../contexts/DataContext';

const TodaysSignals: React.FC = () => {
  const { todaysSignals, loading, errors } = useData();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ fontSize: 16 }} />;
      case 'down':
        return <TrendingDown sx={{ fontSize: 16 }} />;
      default:
        return <Info sx={{ fontSize: 16 }} />;
    }
  };

  if (loading.todaysSignals) {
    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        </Container>
      </Paper>
    );
  }

  if (errors.todaysSignals) {
    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Alert severity="error" sx={{ mb: 0 }}>
            Failed to load today's signals: {errors.todaysSignals}
          </Alert>
        </Container>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        py: 2,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          {todaysSignals.map((signal, index) => (
            <Chip
              key={signal.id || index}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {getTrendIcon(signal.trend)}
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {signal.text}
                  </Typography>
                  {signal.source && (
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      ({signal.source})
                    </Typography>
                  )}
                </Box>
              }
              variant="outlined"
              sx={{
                backgroundColor: `${getSeverityColor(signal.severity)}10`,
                borderColor: getSeverityColor(signal.severity),
                color: getSeverityColor(signal.severity),
                fontWeight: 500,
                px: 1,
                py: 0.5,
                height: 'auto',
                '& .MuiChip-label': {
                  px: 1,
                  py: 0.5,
                },
                '&:hover': {
                  backgroundColor: `${getSeverityColor(signal.severity)}20`,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            />
          ))}
        </Box>
      </Container>
    </Paper>
  );
};

export default TodaysSignals;
