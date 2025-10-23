import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  TrendingFlat,
  AccountBalance,
  Assignment,
  LocalHospital,
  AttachMoney,
  TrendingUp as EconomicsIcon,
  HowToReg,
  SupportAgent,
  Person,
  Devices,
  Phone,
  PhoneCallback,
  Business,
  LocalPharmacy,
  Assessment,
  Security,
  Gavel,
  Storage,
  Groups,
  SentimentSatisfied,
  TrendingUp as GrowthIcon,
} from '@mui/icons-material';
import { DashboardTile as DashboardTileType } from '../services/api';
import { useData } from '../contexts/DataContext';

interface DashboardTileProps {
  tile: DashboardTileType;
  onClick?: (tileId: string) => void;
  viewMode?: 'grid' | 'list';
}

const DashboardTile: React.FC<DashboardTileProps> = ({ tile, onClick, viewMode = 'grid' }) => {
  const [showAllDashboards, setShowAllDashboards] = useState(false);
  const { tileMetrics } = useData();
  
  // Get metrics for this tile
  const tileMetricsData = tileMetrics.filter(metric => metric.tile_id === tile.id);

  const handleDashboardClick = (dashboardName: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent tile click
    console.log(`Opening dashboard: ${dashboardName} in category: ${tile.category}`);
    
    // Special handling for Provider Proforma
    if (dashboardName === 'Provider Proforma' && tile.category === 'payment-integrity' && onClick) {
      onClick(tile.id);
    }
    // Here you would navigate to other specific dashboards
  };

  const handleTileClick = () => {
    if (onClick) {
      onClick(tile.id);
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ fontSize: 16 }} />;
      case 'down':
        return <TrendingDown sx={{ fontSize: 16 }} />;
      case 'stable':
        return <TrendingFlat sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconProps = { sx: { fontSize: 16, color: 'primary.main' } };
    
    switch (category) {
      case 'payment-integrity':
        return <AccountBalance {...iconProps} />;
      case 'claims-management':
        return <Assignment {...iconProps} />;
      case 'clinical-quality':
        return <LocalHospital {...iconProps} />;
      case 'finance-cost':
        return <AttachMoney {...iconProps} />;
      case 'healthcare-economics':
        return <EconomicsIcon {...iconProps} />;
      case 'utilization-management':
        return <HowToReg {...iconProps} />;
      case 'provider-experience':
        return <SupportAgent {...iconProps} />;
      case 'member-experience':
        return <Person {...iconProps} />;
      case 'digital-engagement':
        return <Devices {...iconProps} />;
      case 'call-center-provider':
        return <Phone {...iconProps} />;
      case 'call-center-member':
        return <PhoneCallback {...iconProps} />;
      case 'network-contracting':
        return <Business {...iconProps} />;
      case 'pharmacy':
        return <LocalPharmacy {...iconProps} />;
      case 'risk-adjustment':
        return <Assessment {...iconProps} />;
      case 'fraud-waste-abuse':
        return <Security {...iconProps} />;
      case 'compliance-regulatory':
        return <Gavel {...iconProps} />;
      case 'data-quality':
        return <Storage {...iconProps} />;
      case 'hr-workforce':
        return <Groups {...iconProps} />;
      case 'social-reputation':
        return <SentimentSatisfied {...iconProps} />;
      case 'growth-market':
        return <GrowthIcon {...iconProps} />;
      default:
        return <Assignment {...iconProps} />;
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'positive':
        return '#10B981';
      case 'negative':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

      const getCategoryDescription = (category: string) => {
        const descriptions: { [key: string]: string } = {
          'payment-integrity': 'Payment integrity monitoring and fraud detection',
          'claims-management': 'Claims processing, adjudication, and workflow management',
          'clinical-quality': 'Clinical outcomes, quality measures, and patient care metrics',
          'finance-cost': 'Financial performance, cost analysis, and budget management',
          'healthcare-economics': 'Market analysis, economic trends, and value-based care',
          'utilization-management': 'Prior authorization, utilization review, and care management',
          'provider-experience': 'Provider satisfaction, network management, and credentialing',
          'member-experience': 'Member satisfaction, engagement, and retention metrics',
          'digital-engagement': 'Digital adoption, portal usage, and technology engagement',
          'call-center-provider': 'Provider support operations and call center performance',
          'call-center-member': 'Member support operations and customer service metrics',
          'network-contracting': 'Provider network management and contract negotiations',
          'pharmacy': 'Pharmacy operations, formulary management, and drug utilization',
          'risk-adjustment': 'Risk scoring, coding accuracy, and revenue optimization',
          'fraud-waste-abuse': 'Fraud detection, waste reduction, and abuse prevention',
          'compliance-regulatory': 'Regulatory compliance, audits, and policy management',
          'data-quality': 'Data governance, platform performance, and system reliability',
          'hr-workforce': 'Human resources, workforce analytics, and talent management',
          'social-reputation': 'Social media monitoring, reputation management, and brand intelligence',
          'growth-market': 'Market expansion, growth metrics, and competitive analysis',
        };
        return descriptions[category] || 'Specialized dashboards and analytics';
      };

      const getSubDashboards = (category: string) => {
        const subDashboards: { [key: string]: string[] } = {
          'payment-integrity': ['Provider Proforma', 'Claim Analysis', 'Fraud Detection', 'Denial Management', 'Provider Analytics', 'Cost Optimization'],
          'claims-management': ['Claims Processing', 'Adjudication', 'Workflow Management', 'Quality Assurance', 'Exception Handling'],
          'clinical-quality': ['Quality Measures', 'Outcomes Tracking', 'Patient Safety', 'Clinical Guidelines', 'Performance Metrics'],
          'finance-cost': ['Cost Analysis', 'Budget Management', 'Financial Reporting', 'Revenue Cycle', 'Cost per Member'],
          'healthcare-economics': ['Market Analysis', 'Value-Based Care', 'Economic Trends', 'Competitive Intelligence', 'ROI Analysis'],
          'utilization-management': ['Prior Authorization', 'Utilization Review', 'Care Management', 'Appeal Process', 'Clinical Guidelines'],
          'provider-experience': ['Provider Satisfaction', 'Network Management', 'Credentialing', 'Provider Relations', 'Performance Analytics'],
          'member-experience': ['Member Satisfaction', 'Engagement Metrics', 'Retention Analysis', 'Complaint Management', 'Service Quality'],
          'digital-engagement': ['Portal Analytics', 'Mobile Usage', 'Digital Adoption', 'User Experience', 'Technology Metrics'],
          'call-center-provider': ['Call Volume', 'Handle Time', 'Resolution Rate', 'Provider Support', 'Service Quality'],
          'call-center-member': ['Call Volume', 'Handle Time', 'Satisfaction Score', 'Member Support', 'Service Quality'],
          'network-contracting': ['Contract Management', 'Negotiations', 'Network Performance', 'Provider Relations', 'Market Analysis'],
          'pharmacy': ['Formulary Management', 'Drug Utilization', 'Cost Management', 'Pharmacy Network', 'Clinical Programs'],
          'risk-adjustment': ['Risk Scoring', 'Coding Accuracy', 'Revenue Optimization', 'Quality Measures', 'Compliance'],
          'fraud-waste-abuse': ['Fraud Detection', 'Waste Analysis', 'Abuse Prevention', 'Investigation', 'Recovery'],
          'compliance-regulatory': ['Regulatory Compliance', 'Audit Management', 'Policy Tracking', 'Risk Assessment', 'Reporting'],
          'data-quality': ['Data Governance', 'Platform Performance', 'System Reliability', 'Data Accuracy', 'Integration'],
          'hr-workforce': ['Workforce Analytics', 'Talent Management', 'Performance Tracking', 'Training Programs', 'Retention'],
          'social-reputation': ['Social Media Monitoring', 'Reputation Management', 'Brand Intelligence', 'Sentiment Analysis', 'Crisis Management'],
          'growth-market': ['Market Expansion', 'Growth Metrics', 'Competitive Analysis', 'Market Share', 'Performance Tracking'],
        };
        return subDashboards[category] || ['Dashboard 1', 'Dashboard 2', 'Dashboard 3'];
      };

  if (viewMode === 'list') {
    return (
      <Card
        onClick={handleTileClick}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          '&:hover .tile-overlay': {
            opacity: 1,
          },
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle, rgba(0, 128, 255, 0.1) 1px, transparent 1px),
              radial-gradient(circle, rgba(0, 128, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px, 40px 40px',
            opacity: 0.3,
          }}
        />

        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
          {/* Left side - Title and Featured badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 128, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getCategoryIcon(tile.category)}
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                  {tile.title}
                </Typography>
              </Box>
            </Box>
          </Box>

              {/* Center - Description, Metrics, Insights and Dashboards */}
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 2, justifyContent: 'center', px: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {getCategoryDescription(tile.category)}
                </Typography>
                
                {/* Metrics */}
                {tileMetricsData && tileMetricsData.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>
                      Key Metrics:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {tileMetricsData.slice(0, 3).map((metric) => (
                        <Box key={metric.metric_id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Avatar
                            sx={{
                              width: 6,
                              height: 6,
                              bgcolor: getMetricColor(metric.status),
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {metric.label}: {metric.value}
                          </Typography>
                          {getTrendIcon(metric.trend)}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Insights */}
                {tile.insights && (
                  <Box sx={{ mb: 1, p: 1, backgroundColor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
                      {tile.insights}
                    </Typography>
                  </Box>
                )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(showAllDashboards ? getSubDashboards(tile.category) : getSubDashboards(tile.category).slice(0, 3)).map((sub, index) => (
                <Chip
                  key={index}
                  label={sub}
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={(event) => handleDashboardClick(sub, event)}
                  sx={{
                    fontSize: '0.7rem',
                    height: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      borderColor: 'primary.main',
                      transform: 'translateY(-1px)',
                    },
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              ))}
              {!showAllDashboards && getSubDashboards(tile.category).length > 3 && (
                <Chip
                  label={`+${getSubDashboards(tile.category).length - 3} more`}
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowAllDashboards(true);
                  }}
                  sx={{
                    fontSize: '0.7rem',
                    height: '20px',
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      transform: 'translateY(-1px)',
                    },
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}
              {showAllDashboards && (
                <Chip
                  label="Show Less"
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowAllDashboards(false);
                  }}
                  sx={{
                    fontSize: '0.7rem',
                    height: '20px',
                    color: 'text.secondary',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                      transform: 'translateY(-1px)',
                    },
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Right side - Usage info */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 120 }}>
            <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
              {getSubDashboards(tile.category).length} dashboards
            </Typography>
            {tile.last_accessed && (
              <Typography variant="caption" color="text.disabled">
                {new Date(tile.last_accessed).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        </CardContent>

        {/* Hover Overlay */}
        <Box
          className="tile-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0, 128, 255, 0.1) 0%, rgba(0, 102, 204, 0.1) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            zIndex: 1,
          }}
        />
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card
      onClick={handleTileClick}
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover .tile-overlay': {
          opacity: 1,
        },
        '&:hover .tile-content': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle, rgba(0, 128, 255, 0.1) 1px, transparent 1px),
            radial-gradient(circle, rgba(0, 128, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px, 40px 40px',
          opacity: 0.3,
        }}
      />
      
      <CardContent sx={{ position: 'relative', zIndex: 2, pb: { xs: 3, sm: 2 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 128, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getCategoryIcon(tile.category)}
            </Box>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {tile.title}
            </Typography>
          </Box>
        </Box>

        {/* Category Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '2.5rem' }}>
          {getCategoryDescription(tile.category)}
        </Typography>

            {/* KPIs/Metrics */}
            {tileMetricsData && tileMetricsData.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  Key Metrics:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {tileMetricsData.slice(0, 3).map((metric) => (
                    <Box key={metric.metric_id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 8,
                            height: 8,
                            bgcolor: getMetricColor(metric.status),
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {metric.label}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {metric.value && (
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {metric.value}
                          </Typography>
                        )}
                        {getTrendIcon(metric.trend)}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* So What Insights */}
            {tile.insights && (
              <Box sx={{ mb: 2, p: 1.5, backgroundColor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                  {tile.insights}
                </Typography>
              </Box>
            )}

            {/* Sub-dashboards Preview */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                Available Dashboards ({getSubDashboards(tile.category).length}):
              </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(showAllDashboards ? getSubDashboards(tile.category) : getSubDashboards(tile.category).slice(0, 3)).map((sub, index) => (
              <Chip
                key={index}
                label={sub}
                size="small"
                variant="outlined"
                clickable
                onClick={(event) => handleDashboardClick(sub, event)}
                sx={{
                  fontSize: '0.7rem',
                  height: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    borderColor: 'primary.main',
                    transform: 'translateY(-1px)',
                  },
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            ))}
            {!showAllDashboards && getSubDashboards(tile.category).length > 3 && (
              <Chip
                label={`+${getSubDashboards(tile.category).length - 3} more`}
                size="small"
                variant="outlined"
                clickable
                onClick={(event) => {
                  event.stopPropagation();
                  setShowAllDashboards(true);
                }}
                sx={{
                  fontSize: '0.7rem',
                  height: '20px',
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    transform: 'translateY(-1px)',
                  },
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            )}
            {showAllDashboards && (
              <Chip
                label="Show Less"
                size="small"
                variant="outlined"
                clickable
                onClick={(event) => {
                  event.stopPropagation();
                  setShowAllDashboards(false);
                }}
                sx={{
                  fontSize: '0.7rem',
                  height: '20px',
                  color: 'text.secondary',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                    transform: 'translateY(-1px)',
                  },
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            )}
          </Box>
            </Box>
          </CardContent>

      {/* Hover Overlay */}
      <Box
        className="tile-overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 128, 255, 0.1) 0%, rgba(0, 102, 204, 0.1) 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          zIndex: 1,
        }}
      />
    </Card>
  );
};

export default DashboardTile;