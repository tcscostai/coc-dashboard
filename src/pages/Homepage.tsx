import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import Header from '../components/Header';
import WelcomeBanner from '../components/WelcomeBanner';
import FilterControls from '../components/FilterControls';
import TodaysSignals from '../components/TodaysSignals';
import DashboardTile from '../components/DashboardTile';
import { useData } from '../contexts/DataContext';
import { FilterOption, SortOption } from '../types';

interface HomepageProps {
  user: {
    name: string;
    title: string;
  };
  onLogout: () => void;
  onNavigateToProviderProforma: (filters?: any) => void;
}

const Homepage: React.FC<HomepageProps> = ({ user, onLogout, onNavigateToProviderProforma }) => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [activeSort, setActiveSort] = useState<SortOption>('featured');
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  
  const { 
    dashboardTiles, 
    loading, 
    errors, 
    refreshDashboardTiles, 
    updateTileUsage 
  } = useData();

  const filteredAndSortedTiles = useMemo(() => {
    let filtered = dashboardTiles;

    // Apply category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(tile => tile.category === activeFilter);
    }

    // Apply sorting
    switch (activeSort) {
      case 'featured':
        filtered = [...filtered].sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return b.usage_count - a.usage_count;
        });
        break;
      case 'alphabetical':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'recent':
        filtered = [...filtered].sort((a, b) => {
          if (!a.last_accessed && !b.last_accessed) return 0;
          if (!a.last_accessed) return 1;
          if (!b.last_accessed) return -1;
          return new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime();
        });
        break;
      case 'usage':
        filtered = [...filtered].sort((a, b) => b.usage_count - a.usage_count);
        break;
    }

    return filtered;
  }, [dashboardTiles, activeFilter, activeSort]);

  const handleTileClick = async (tileId: string) => {
    console.log('Tile clicked:', tileId);
    
    // Update usage count via API
    await updateTileUsage(tileId);
    
    // Navigate to specific dashboards
    if (tileId === 'payment-integrity') {
      console.log('Navigating to Provider Proforma...');
      // Pass current filter state to Provider Proforma
      const currentFilters = {
        category: activeFilter,
        sort: activeSort,
        // Add more filter mappings as needed
        state: 'Texas', // Default values for Provider Proforma specific filters
        lob: 'Medicare Advantage',
        plan: 'TX DSNP, Ericson Adv.',
        entity: 'MaxWell Hospitals',
        specialty: 'Cardiology',
        networkStatus: 'In Network',
        contactType: 'FFS',
        digitalMaturity: 'High',
        platform: 'TOPS',
      };
      onNavigateToProviderProforma(currentFilters);
    } else {
      // In a real app, this would navigate to other specific dashboards
      console.log(`Navigating to dashboard: ${tileId}`);
      alert(`This would navigate to the ${tileId} dashboard`);
    }
  };

  const handleRefresh = async () => {
    console.log('Refreshing dashboard data...');
    await refreshDashboardTiles({ category: activeFilter, sort: activeSort });
  };

  const handleViewChange = (view: 'grid' | 'list') => {
    setCurrentView(view);
  };

  // Handle filter and sort changes
  const handleFilterChange = async (filter: FilterOption) => {
    setActiveFilter(filter);
    await refreshDashboardTiles({ category: filter, sort: activeSort });
  };

  const handleSortChange = async (sort: SortOption) => {
    setActiveSort(sort);
    await refreshDashboardTiles({ category: activeFilter, sort });
  };

  if (loading.dashboardTiles) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errors.dashboardTiles) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Error loading dashboard data
          </Typography>
          <Typography>
            {errors.dashboardTiles}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: { xs: '80px', sm: 0 } }}>
      <Header user={user} onLogout={onLogout} />
      
          <WelcomeBanner 
            user={user}
            onRefresh={handleRefresh}
            onViewChange={handleViewChange}
          />
          
          <FilterControls
            activeFilter={activeFilter}
            activeSort={activeSort}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onViewChange={handleViewChange}
            currentView={currentView}
          />
          
          <TodaysSignals />
          
          <Container maxWidth="xl" sx={{ py: 4, pb: { xs: 6, sm: 4 } }}>
        {filteredAndSortedTiles.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              No dashboards found
            </Typography>
            <Typography>
              Try adjusting your filters or search criteria.
            </Typography>
          </Alert>
        ) : (
          <Box
            sx={{
              display: currentView === 'grid' ? 'grid' : 'flex',
              flexDirection: currentView === 'list' ? 'column' : 'unset',
              gridTemplateColumns: currentView === 'grid' ? {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              } : 'unset',
              gap: 3,
              mb: { xs: 8, sm: 0 },
            }}
          >
            {filteredAndSortedTiles.map((tile) => (
              <DashboardTile
                key={tile.id}
                tile={tile}
                onClick={handleTileClick}
                viewMode={currentView}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Homepage;