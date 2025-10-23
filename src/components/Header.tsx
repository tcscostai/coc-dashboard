import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  InputBase,
  Paper,
  Fade,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import AskAlexButton from './AskAlexButton';

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const ExpandedSearch = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  padding: theme.spacing(1, 2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  zIndex: 1000,
}));

interface HeaderProps {
  user: {
    name: string;
    title: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) {
      setSearchQuery('');
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // In a real app, this would trigger search functionality
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
        setSearchQuery('');
      }
    };

    if (isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpanded]);

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
        <Toolbar>
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 0 }}>
            <img 
              src="./images/logo.svg" 
              alt="UHG Logo" 
              style={{ 
                height: 40,
                width: 'auto',
                maxWidth: '200px'
              }} 
            />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
              OCC Cove
            </Typography>
          </Box>

          {/* Search */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Box ref={searchRef} sx={{ position: 'relative' }}>
              {!isSearchExpanded ? (
                <IconButton onClick={handleSearchToggle} sx={{ color: 'text.secondary' }}>
                  <SearchIcon />
                </IconButton>
              ) : (
                <Fade in={isSearchExpanded} timeout={300}>
                  <ExpandedSearch elevation={8}>
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                    <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
                      <StyledInputBase
                        placeholder="Search dashboards, reports, or data..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        sx={{ width: '100%' }}
                      />
                    </form>
                    <IconButton onClick={handleSearchToggle} size="small">
                      <CloseIcon />
                    </IconButton>
                  </ExpandedSearch>
                </Fade>
              )}
            </Box>
          </Box>

          {/* Right side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Status Indicator */}
            <Chip
              label="System Active"
              icon={<span style={{ fontSize: '1rem' }}>⚡</span>}
              size="small"
              sx={{
                backgroundColor: 'primary.light',
                color: 'white',
                fontWeight: 500,
              }}
            />

            {/* Action buttons */}
            <IconButton color="inherit" sx={{ color: 'text.secondary' }}>
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit" sx={{ color: 'text.secondary' }}>
              <HelpIcon />
            </IconButton>

            <AskAlexButton variant="icon" size="small" />

            {/* User profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.300' }}>
                <img 
                  src="./images/heather-sample.jpg" 
                  alt={user.name} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }} 
                />
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {user.name}
              </Typography>
            </Box>

            {/* Menu */}
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ color: 'text.secondary' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => {
                handleMenuClose();
                onLogout?.();
              }}>Sign Out</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;