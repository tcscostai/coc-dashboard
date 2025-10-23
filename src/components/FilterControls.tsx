import React from 'react';
import {
  Box,
  Paper,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Container,
} from '@mui/material';
import { GridView, ViewList } from '@mui/icons-material';
import { FilterOption, SortOption } from '../types';

interface FilterControlsProps {
  activeFilter: FilterOption;
  activeSort: SortOption;
  onFilterChange: (filter: FilterOption) => void;
  onSortChange: (sort: SortOption) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  currentView: 'grid' | 'list';
}

const FilterControls: React.FC<FilterControlsProps> = ({
  activeFilter,
  activeSort,
  onFilterChange,
  onSortChange,
  onViewChange,
  currentView,
}) => {
      const filterOptions: { value: FilterOption; label: string }[] = [
        { value: 'all', label: 'All' },
        { value: 'payment-integrity', label: 'Payment Integrity' },
        { value: 'claims-management', label: 'Claims Management' },
        { value: 'clinical-quality', label: 'Clinical Management' },
        { value: 'finance-cost', label: 'Cost of Care' },
        { value: 'healthcare-economics', label: 'Healthcare Economics' },
        { value: 'utilization-management', label: 'Utilization Management' },
        { value: 'provider-experience', label: 'Provider Experience' },
        { value: 'member-experience', label: 'Member Experience' },
        { value: 'digital-engagement', label: 'Digital Engagement' },
        { value: 'call-center-provider', label: 'Call Center - Provider' },
        { value: 'call-center-member', label: 'Call Center - Member' },
        { value: 'network-contracting', label: 'Network & Contracting' },
        { value: 'pharmacy', label: 'Pharmacy' },
        { value: 'risk-adjustment', label: 'Risk Adjustment' },
        { value: 'fraud-waste-abuse', label: 'Fraud, Waste, Abuse' },
        { value: 'compliance-regulatory', label: 'Compliance & Regulatory' },
        { value: 'data-quality', label: 'Data Quality' },
        { value: 'hr-workforce', label: 'HR/Workforce' },
        { value: 'social-reputation', label: 'Reputation Intelligence' },
        { value: 'growth-market', label: 'Market Performance' },
      ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'alphabetical', label: 'A-Z' },
    { value: 'recent', label: 'Recent' },
    { value: 'usage', label: 'Most Used' },
  ];

  return (
    <Paper elevation={0} sx={{ 
      borderBottom: 1, 
      borderColor: 'divider',
      backgroundColor: 'background.paper',
    }}>
      <Container maxWidth="xl">
        <Box sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          {/* Category Filter Dropdown */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <Select
              value={activeFilter}
              onChange={(e) => onFilterChange(e.target.value as FilterOption)}
              displayEmpty
              inputProps={{ 'aria-label': 'select category' }}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.light',
                },
              }}
            >
              {filterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sort and View Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Sort Dropdown */}
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <Select
                value={activeSort}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                displayEmpty
                inputProps={{ 'aria-label': 'sort by' }}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                  },
                }}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    Sort by: {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* View Toggle */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                color={currentView === 'grid' ? 'primary' : 'default'}
                onClick={() => onViewChange('grid')}
                sx={{
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <GridView />
              </IconButton>
              <IconButton
                color={currentView === 'list' ? 'primary' : 'default'}
                onClick={() => onViewChange('list')}
                sx={{
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ViewList />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export default FilterControls;