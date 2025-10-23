import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Drawer,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Slider,
  Breadcrumbs,
  Link,
  AppBar,
  Toolbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Tooltip as MuiTooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Refresh,
  Close,
  AutoAwesome,
  Assessment,
  Group,
  TrendingFlat,
  FilterList,
  ExpandMore,
  Send,
} from '@mui/icons-material';
import Header from '../components/Header';
import { useData } from '../contexts/DataContext';

interface ProviderProformaProps {
  user: {
    name: string;
    title: string;
  };
  onLogout: () => void;
  onNavigateToHomepage: () => void;
  appliedFilters?: {
    category?: string;
    sort?: string;
    state?: string;
    lob?: string;
    plan?: string;
    entity?: string;
    specialty?: string;
    networkStatus?: string;
    contactType?: string;
    digitalMaturity?: string;
    platform?: string;
  };
}

interface KPIMetric {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  index?: number;
  peerComparison?: string;
  trend?: 'up' | 'down' | 'flat';
}

interface EntityData {
  name: string;
  tin: string;
  volume: number;
  denialRate: number;
  spendPerClaim: number;
  digitalMaturity: 'Low' | 'Medium' | 'High';
  platform: 'TOPS' | 'Cosmos';
  opportunity: number;
  badges: string[];
}

const ProviderProforma: React.FC<ProviderProformaProps> = ({ 
  user, 
  onLogout, 
  onNavigateToHomepage, 
  appliedFilters = {} 
}) => {
  const [askAlexOpen, setAskAlexOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [simulationExpanded, setSimulationExpanded] = useState(false);
  const [forecastView, setForecastView] = useState<'actuals' | 'forecast' | 'billing'>('actuals');
  const [opportunitiesPage, setOpportunitiesPage] = useState(0);
  
  // New state for drill-down and comparative analysis
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Monthly');
  const [selectedDimension, setSelectedDimension] = useState<string>('');
  const [comparativeData, setComparativeData] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'alex', message: string, timestamp: Date}>>([
    {
      id: '1',
      type: 'alex',
      message: "Hi! I'm Alex, your AI assistant. I can help you with dashboard insights, data analysis, and answer questions about your Provider Proforma. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  
  // Get data from context
  const { 
    providerKPIs, 
    providerEntities, 
    chartData, 
    loading, 
    errors 
  } = useData();

  // Initialize filters with applied filters from homepage
  const [selectedFilters, setSelectedFilters] = useState({
    state: appliedFilters.state || 'Texas',
    lob: appliedFilters.lob || 'Medicare Advantage',
    plan: appliedFilters.plan || 'TX DSNP, Ericson Adv.',
    entity: appliedFilters.entity || 'MaxWell Hospitals',
    providerTin: '12-3456789',
    specialty: appliedFilters.specialty || 'Cardiology',
    networkStatus: appliedFilters.networkStatus || 'In Network',
    contactType: appliedFilters.contactType || 'FFS',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    timeline: 'Q1',
    dateType: 'DOS',
    digitalAdoption: 14.1,
    ipToOpRatio: 62,
    digitalMaturity: appliedFilters.digitalMaturity || 'High',
    platform: appliedFilters.platform || 'TOPS',
  });

  // Update filters when appliedFilters change
  useEffect(() => {
    if (appliedFilters) {
      setSelectedFilters(prev => ({
        ...prev,
        ...appliedFilters,
        // Keep some fields that shouldn't be overridden
        providerTin: prev.providerTin,
        startDate: prev.startDate,
        endDate: prev.endDate,
        timeline: prev.timeline,
        dateType: prev.dateType,
        digitalAdoption: prev.digitalAdoption,
        ipToOpRatio: prev.ipToOpRatio,
      }));
    }
  }, [appliedFilters]);


  // const [viewMode, setViewMode] = useState<'executive' | 'director' | 'manager' | 'field'>('director');


  // Convert API KPI data to component format and apply filters
  const kpiMetrics: KPIMetric[] = useMemo(() => {
    if (!providerKPIs || providerKPIs.length === 0) {
      return [];
    }
    
    let filteredKPIs = [...providerKPIs];
    let multiplier = 1;
    let deltaChange = 0;
    
    // Apply comprehensive filters to KPI data
    // State filters
    if (selectedFilters.state === 'California') {
      multiplier *= 1.15;
      deltaChange += 18;
    } else if (selectedFilters.state === 'Florida') {
      multiplier *= 1.08;
      deltaChange += 12;
    } else if (selectedFilters.state === 'New York') {
      multiplier *= 1.22;
      deltaChange += 25;
    }
    
    // LOB filters
    if (selectedFilters.lob === 'Medicaid') {
      multiplier *= 0.88;
      deltaChange -= 12;
    } else if (selectedFilters.lob === 'Commercial') {
      multiplier *= 1.05;
      deltaChange += 8;
    } else if (selectedFilters.lob === 'Exchange') {
      multiplier *= 0.92;
      deltaChange -= 8;
    }
    
    // Plan filters
    if (selectedFilters.plan?.includes('DSNP')) {
      multiplier *= 1.12;
      deltaChange += 15;
    } else if (selectedFilters.plan?.includes('HMO')) {
      multiplier *= 0.95;
      deltaChange -= 5;
    }
    
    // Entity filters
    if (selectedFilters.entity?.includes('Hospital')) {
      multiplier *= 1.18;
      deltaChange += 20;
    } else if (selectedFilters.entity?.includes('Clinic')) {
      multiplier *= 0.92;
      deltaChange -= 8;
    }
    
    // Specialty filters
    if (selectedFilters.specialty === 'Cardiology') {
      multiplier *= 1.25;
      deltaChange += 22;
    } else if (selectedFilters.specialty === 'Orthopedics') {
      multiplier *= 1.15;
      deltaChange += 18;
    } else if (selectedFilters.specialty === 'Primary Care') {
      multiplier *= 0.88;
      deltaChange -= 12;
    }
    
    // Network Status filters
    if (selectedFilters.networkStatus === 'Out of Network') {
      multiplier *= 1.35;
      deltaChange += 30;
    } else if (selectedFilters.networkStatus === 'In Network') {
      multiplier *= 0.95;
      deltaChange -= 5;
    }
    
    // Contact Type filters
    if (selectedFilters.contactType === 'FFS') {
      multiplier *= 1.08;
      deltaChange += 10;
    } else if (selectedFilters.contactType === 'Capitation') {
      multiplier *= 0.92;
      deltaChange -= 8;
    }
    
    // Digital Maturity filters
    if (selectedFilters.digitalMaturity === 'Low') {
      multiplier *= 0.85;
      deltaChange -= 20;
    } else if (selectedFilters.digitalMaturity === 'Medium') {
      multiplier *= 0.95;
      deltaChange -= 5;
    }
    
    // Platform filters
    if (selectedFilters.platform === 'Cosmos') {
      multiplier *= 0.92;
      deltaChange -= 8;
    }
    
    // Digital Adoption slider effect
    if (selectedFilters.digitalAdoption < 10) {
      multiplier *= 0.8;
      deltaChange -= 25;
    } else if (selectedFilters.digitalAdoption > 30) {
      multiplier *= 1.1;
      deltaChange += 15;
    }
    
    // IP/OP Ratio effect
    if (selectedFilters.ipToOpRatio > 70) {
      multiplier *= 1.15;
      deltaChange += 18;
    } else if (selectedFilters.ipToOpRatio < 50) {
      multiplier *= 0.9;
      deltaChange -= 10;
    }
    
    // Apply the calculated multiplier to relevant KPIs
    filteredKPIs = filteredKPIs.map(kpi => {
      let newValue = kpi.value;
      let newDelta = kpi.delta;
      let newDeltaType = kpi.delta_type;
      
      // Apply multiplier to spend-related metrics
      if (kpi.label.includes('Spend') || kpi.label.includes('Cost') || kpi.label.includes('Paid')) {
        const numericValue = parseFloat(kpi.value.toString().replace(/[$,%]/g, ''));
        const adjustedValue = numericValue * multiplier;
        newValue = kpi.value.toString().includes('$') ? 
          '$' + Math.round(adjustedValue).toString() :
          kpi.value.toString().includes('%') ? 
          Math.round(adjustedValue * 10) / 10 + '%' :
          Math.round(adjustedValue).toString();
        
        // Update delta
        const currentDelta = parseFloat((kpi.delta || '0').replace(/[+%-]/g, ''));
        const deltaSign = (kpi.delta || '').includes('-') ? -1 : 1;
        const newDeltaValue = Math.abs(currentDelta + deltaChange);
        newDelta = (deltaChange >= 0 ? '+' : '') + Math.round(newDeltaValue) + '%';
        newDeltaType = deltaChange >= 0 ? 'negative' : 'positive';
      }
      
      // Apply multiplier to volume-related metrics
      if (kpi.label.includes('Volume') || kpi.label.includes('Claims') || kpi.label.includes('Sessions')) {
        const numericValue = parseFloat(kpi.value.toString().replace(/[$,%K]/g, ''));
        const adjustedValue = numericValue * multiplier;
        newValue = kpi.value.toString().includes('K') ? 
          Math.round(adjustedValue) + 'K' :
          Math.round(adjustedValue).toString();
      }
      
      // Apply multiplier to rate-related metrics
      if (kpi.label.includes('Rate') || kpi.label.includes('Denial') || kpi.label.includes('API')) {
        const numericValue = parseFloat(kpi.value.toString().replace(/[$,%]/g, ''));
        const adjustedValue = numericValue * multiplier;
        newValue = kpi.value.toString().includes('%') ? 
          Math.round(adjustedValue * 10) / 10 + '%' :
          Math.round(adjustedValue).toString();
      }
      
      return {
        ...kpi,
        value: newValue,
        delta: newDelta,
        delta_type: newDeltaType,
      };
    });
    
    return filteredKPIs.map((kpi, index) => ({
      label: kpi.label,
      value: kpi.value,
      delta: kpi.delta || undefined,
      deltaType: kpi.delta_type as 'positive' | 'negative' | 'neutral',
      trend: kpi.trend as 'up' | 'down' | 'flat',
      peerComparison: kpi.peer_comparison,
      index: kpi.index,
    }));
  }, [providerKPIs, selectedFilters]);


  // const lobData = [
  //   { lob: 'C&S', percentage: 31, color: '#0080FF' },
  //   { lob: 'M&R', percentage: 26, color: '#10B981' },
  //   { lob: 'E&I', percentage: 23, color: '#F59E0B' },
  //   { lob: 'Other', percentage: 20, color: '#6B7280' },
  // ];

  // Convert API entity data to component format and apply filters
  const entityData: EntityData[] = useMemo(() => {
    if (!providerEntities || providerEntities.length === 0) {
      return [];
    }
    
    let filtered = providerEntities;
    
    // Apply filters
    if (selectedFilters.digitalMaturity) {
      filtered = filtered.filter(entity => 
        entity.digital_maturity.toLowerCase() === selectedFilters.digitalMaturity?.toLowerCase()
      );
    }
    
    if (selectedFilters.platform) {
      filtered = filtered.filter(entity => 
        entity.platform === selectedFilters.platform
      );
    }
    
    if (selectedFilters.specialty) {
      // Filter by specialty if available in entity data
      // This would need to be added to the entity data structure
    }
    
    return filtered.map(entity => ({
      name: entity.name,
      tin: entity.tin,
      volume: entity.volume,
      denialRate: entity.denial_rate,
      spendPerClaim: entity.spend_per_claim,
      digitalMaturity: entity.digital_maturity as 'Low' | 'Medium' | 'High',
      platform: entity.platform as 'TOPS' | 'Cosmos',
      opportunity: entity.opportunity,
      badges: entity.badges,
    }));
  }, [providerEntities, selectedFilters.digitalMaturity, selectedFilters.platform, selectedFilters.specialty]);

  // Static entity data as fallback (keeping some for demonstration)
  const staticEntityData: EntityData[] = [
    {
      name: 'Gulf Coast Surgical',
      tin: '12-3456789',
      volume: 18900,
      denialRate: 31.6,
      spendPerClaim: 640,
      digitalMaturity: 'Low',
      platform: 'TOPS',
      opportunity: 740000,
      badges: ['High-Tech', 'High-Cost', 'Platform-Sensitive', 'IP-Outlier'],
    },
    {
      name: 'Orlando Family Physicians',
      tin: '23-4567890',
      volume: 12500,
      denialRate: 19.2,
      spendPerClaim: 485,
      digitalMaturity: 'High',
      platform: 'Cosmos',
      opportunity: 125000,
      badges: ['Digital Value Leader'],
    },
    {
      name: 'Metro Cardiology Group',
      tin: '34-5678901',
      volume: 22100,
      denialRate: 28.4,
      spendPerClaim: 720,
      digitalMaturity: 'Medium',
      platform: 'TOPS',
      opportunity: 890000,
      badges: ['IP-Intensive', 'High-Cost'],
    },
    {
      name: 'Sunrise Medical Center',
      tin: '45-6789012',
      volume: 15600,
      denialRate: 24.8,
      spendPerClaim: 520,
      digitalMaturity: 'High',
      platform: 'Cosmos',
      opportunity: 180000,
      badges: ['Digital Value Leader', 'Low-Cost'],
    },
    {
      name: 'Coastal Orthopedics',
      tin: '56-7890123',
      volume: 19800,
      denialRate: 33.2,
      spendPerClaim: 680,
      digitalMaturity: 'Low',
      platform: 'TOPS',
      opportunity: 650000,
      badges: ['High-Tech', 'Platform-Sensitive'],
    },
    {
      name: 'Valley Family Practice',
      tin: '67-8901234',
      volume: 11200,
      denialRate: 18.5,
      spendPerClaim: 420,
      digitalMaturity: 'High',
      platform: 'Cosmos',
      opportunity: 95000,
      badges: ['Digital Value Leader', 'Efficient'],
    },
    {
      name: 'Mountain View Surgery',
      tin: '78-9012345',
      volume: 24300,
      denialRate: 29.7,
      spendPerClaim: 750,
      digitalMaturity: 'Medium',
      platform: 'TOPS',
      opportunity: 920000,
      badges: ['IP-Intensive', 'High-Cost', 'Platform-Sensitive'],
    },
    {
      name: 'Riverside Pediatrics',
      tin: '89-0123456',
      volume: 13400,
      denialRate: 21.3,
      spendPerClaim: 380,
      digitalMaturity: 'High',
      platform: 'Cosmos',
      opportunity: 110000,
      badges: ['Digital Value Leader', 'Low-Cost'],
    },
    {
      name: 'Desert Medical Group',
      tin: '90-1234567',
      volume: 18700,
      denialRate: 26.9,
      spendPerClaim: 580,
      digitalMaturity: 'Medium',
      platform: 'TOPS',
      opportunity: 320000,
      badges: ['Platform-Sensitive'],
    },
    {
      name: 'Forest Hill Clinic',
      tin: '01-2345678',
      volume: 9600,
      denialRate: 16.8,
      spendPerClaim: 350,
      digitalMaturity: 'High',
      platform: 'Cosmos',
      opportunity: 75000,
      badges: ['Digital Value Leader', 'Efficient', 'Low-Cost'],
    },
    {
      name: 'Ocean View Healthcare',
      tin: '12-3456789',
      volume: 20100,
      denialRate: 30.1,
      spendPerClaim: 620,
      digitalMaturity: 'Low',
      platform: 'TOPS',
      opportunity: 580000,
      badges: ['High-Tech', 'Platform-Sensitive'],
    },
    {
      name: 'Prairie Medical Associates',
      tin: '23-4567890',
      volume: 15200,
      denialRate: 22.7,
      spendPerClaim: 480,
      digitalMaturity: 'Medium',
      platform: 'Cosmos',
      opportunity: 195000,
      badges: ['Efficient'],
    },
    {
      name: 'Canyon Surgical Center',
      tin: '34-5678901',
      volume: 22800,
      denialRate: 32.5,
      spendPerClaim: 710,
      digitalMaturity: 'Low',
      platform: 'TOPS',
      opportunity: 780000,
      badges: ['High-Tech', 'High-Cost', 'Platform-Sensitive', 'IP-Outlier'],
    },
    {
      name: 'Meadowbrook Family Care',
      tin: '45-6789012',
      volume: 10800,
      denialRate: 17.9,
      spendPerClaim: 390,
      digitalMaturity: 'High',
      platform: 'Cosmos',
      opportunity: 85000,
      badges: ['Digital Value Leader', 'Efficient', 'Low-Cost'],
    },
    {
      name: 'Summit Orthopedics',
      tin: '56-7890123',
      volume: 19600,
      denialRate: 27.3,
      spendPerClaim: 650,
      digitalMaturity: 'Medium',
      platform: 'TOPS',
      opportunity: 420000,
      badges: ['IP-Intensive', 'Platform-Sensitive'],
    },
    {
      name: 'Lakeside Medical Group',
      tin: '67-8901234',
      volume: 14200,
      denialRate: 20.4,
      spendPerClaim: 450,
      digitalMaturity: 'High',
      platform: 'Cosmos',
      opportunity: 165000,
      badges: ['Digital Value Leader', 'Efficient'],
    },
    {
      name: 'Hilltop Cardiology',
      tin: '78-9012345',
      volume: 23500,
      denialRate: 31.8,
      spendPerClaim: 730,
      digitalMaturity: 'Low',
      platform: 'TOPS',
      opportunity: 850000,
      badges: ['High-Tech', 'High-Cost', 'Platform-Sensitive', 'IP-Outlier'],
    },
    {
      name: 'Brookside Pediatrics',
      tin: '89-0123456',
      volume: 11800,
      denialRate: 19.1,
      spendPerClaim: 360,
      digitalMaturity: 'High',
      platform: 'Cosmos',
      opportunity: 92000,
      badges: ['Digital Value Leader', 'Low-Cost'],
    },
    {
      name: 'Ridgeview Surgery',
      tin: '90-1234567',
      volume: 21200,
      denialRate: 28.9,
      spendPerClaim: 690,
      digitalMaturity: 'Medium',
      platform: 'TOPS',
      opportunity: 550000,
      badges: ['IP-Intensive', 'Platform-Sensitive'],
    },
    {
      name: 'Greenfield Clinic',
      tin: '01-2345678',
      volume: 8900,
      denialRate: 15.2,
      spendPerClaim: 320,
      digitalMaturity: 'High',
      platform: 'Cosmos',
      opportunity: 68000,
      badges: ['Digital Value Leader', 'Efficient', 'Low-Cost'],
    },
  ];


  // Opportunities Data
  const opportunities = [
    {
      title: 'Platform Harmonization',
      impact: '$18.6M/Q',
      effort: 'Medium',
      owner: 'Platform Ops',
      timeline: '45 days',
      confidence: 'High',
      description: 'TOPS vs Cosmos rule alignment',
    },
    {
      title: 'Digital Sprint',
      impact: '$2.4M/mo',
      effort: 'Low',
      owner: 'Provider Relations',
      timeline: '60 days',
      confidence: 'Medium',
      description: '10 TINs API onboarding',
    },
    {
      title: 'Site-of-Care Shift',
      impact: '$3.8M/Q',
      effort: 'Medium',
      owner: 'Clinical Ops',
      timeline: '90 days',
      confidence: 'Medium',
      description: 'Cardio/Ortho 5–7% shift',
    },
  ];

  // Billing Metrics Data
  const billingMetricsData = [
    { metric: 'Billed', fy2023: 350000000 },
    { metric: 'Disallowed', fy2023: 250000000 },
    { metric: 'OOP (Out-of-Pocket)', fy2023: 10000000 },
    { metric: 'Paid', fy2023: 95000000 },
    { metric: 'Volumes', fy2023: 56000 },
    { metric: 'Billed to Allowed', fy2023: 75 },
  ];

  // New Opportunities Table Data
  const opportunitiesTableData = [
    {
      entity: 'Sunrise Family Physicians',
      claimsVolume: 1920,
      medSpend: 1202000,
      medSpendPerClaim: 626,
      denialRate: 15,
      medSpendChange: 25,
      denialRateChange: -20,
      insights: 'Strongest variance pattern suggests potential documentation optimization or automated pre-bill coding review systems. High spend increase with significant denial reduction may indicate strategic coding practices.'
    },
    {
      entity: 'Global Hospital',
      claimsVolume: 15000,
      medSpend: 18002000,
      medSpendPerClaim: 1200,
      denialRate: 18,
      medSpendChange: 20,
      denialRateChange: -15,
      insights: 'Global Hospital maintains a high claim volume - 15k - with elevated spend -$1200/claim- suggesting that even small denial reductions yield significant financial impact. Large volume entity showing consistent pattern of increased complexity coding with reduced denials.'
    },
    {
      entity: 'Local Specialty',
      claimsVolume: 8200,
      medSpend: 4305000,
      medSpendPerClaim: 525,
      denialRate: 16,
      medSpendChange: 15,
      denialRateChange: -10,
      insights: 'Local Specialty Group presents a more moderate increase, potentially reflecting early-stage automation or efficiency gains rather than deliberate upcoding. Moderate variance pattern indicates balanced approach to coding optimization.'
    }
  ];

  // Convert API chart data to component format and apply comprehensive filters
  const actualsChartData = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return [];
    }
    
    let filteredChartData = [...chartData];
    let spendMultiplier = 1;
    let denialMultiplier = 1;
    
    // Apply comprehensive filters to chart data
    // State filters
    if (selectedFilters.state === 'California') {
      spendMultiplier *= 1.15;
      denialMultiplier *= 1.08;
    } else if (selectedFilters.state === 'Florida') {
      spendMultiplier *= 1.08;
      denialMultiplier *= 1.05;
    } else if (selectedFilters.state === 'New York') {
      spendMultiplier *= 1.22;
      denialMultiplier *= 1.12;
    }
    
    // LOB filters
    if (selectedFilters.lob === 'Medicaid') {
      spendMultiplier *= 0.88;
      denialMultiplier *= 1.15;
    } else if (selectedFilters.lob === 'Commercial') {
      spendMultiplier *= 1.05;
      denialMultiplier *= 1.02;
    } else if (selectedFilters.lob === 'Exchange') {
      spendMultiplier *= 0.92;
      denialMultiplier *= 0.98;
    }
    
    // Plan filters
    if (selectedFilters.plan?.includes('DSNP')) {
      spendMultiplier *= 1.12;
      denialMultiplier *= 1.08;
    } else if (selectedFilters.plan?.includes('HMO')) {
      spendMultiplier *= 0.95;
      denialMultiplier *= 0.92;
    }
    
    // Entity filters
    if (selectedFilters.entity?.includes('Hospital')) {
      spendMultiplier *= 1.18;
      denialMultiplier *= 1.1;
    } else if (selectedFilters.entity?.includes('Clinic')) {
      spendMultiplier *= 0.92;
      denialMultiplier *= 0.95;
    }
    
    // Specialty filters
    if (selectedFilters.specialty === 'Cardiology') {
      spendMultiplier *= 1.25;
      denialMultiplier *= 1.15;
    } else if (selectedFilters.specialty === 'Orthopedics') {
      spendMultiplier *= 1.15;
      denialMultiplier *= 1.08;
    } else if (selectedFilters.specialty === 'Primary Care') {
      spendMultiplier *= 0.88;
      denialMultiplier *= 0.92;
    }
    
    // Network Status filters
    if (selectedFilters.networkStatus === 'Out of Network') {
      spendMultiplier *= 1.35;
      denialMultiplier *= 1.25;
    } else if (selectedFilters.networkStatus === 'In Network') {
      spendMultiplier *= 0.95;
      denialMultiplier *= 0.92;
    }
    
    // Contact Type filters
    if (selectedFilters.contactType === 'FFS') {
      spendMultiplier *= 1.08;
      denialMultiplier *= 1.05;
    } else if (selectedFilters.contactType === 'Capitation') {
      spendMultiplier *= 0.92;
      denialMultiplier *= 0.95;
    }
    
    // Digital Maturity filters
    if (selectedFilters.digitalMaturity === 'Low') {
      spendMultiplier *= 0.85;
      denialMultiplier *= 1.2;
    } else if (selectedFilters.digitalMaturity === 'Medium') {
      spendMultiplier *= 0.95;
      denialMultiplier *= 1.05;
    }
    
    // Platform filters
    if (selectedFilters.platform === 'Cosmos') {
      spendMultiplier *= 0.92;
      denialMultiplier *= 0.85;
    }
    
    // Digital Adoption slider effect
    if (selectedFilters.digitalAdoption < 10) {
      spendMultiplier *= 0.8;
      denialMultiplier *= 1.25;
    } else if (selectedFilters.digitalAdoption > 30) {
      spendMultiplier *= 1.1;
      denialMultiplier *= 0.9;
    }
    
    // IP/OP Ratio effect
    if (selectedFilters.ipToOpRatio > 70) {
      spendMultiplier *= 1.15;
      denialMultiplier *= 1.08;
    } else if (selectedFilters.ipToOpRatio < 50) {
      spendMultiplier *= 0.9;
      denialMultiplier *= 0.95;
    }
    
    // Apply multipliers to chart data
    filteredChartData = filteredChartData.map(data => ({
      ...data,
      spend_per_claim: data.spend_per_claim * spendMultiplier,
      denial_rate: data.denial_rate * denialMultiplier,
    }));
    
    return filteredChartData.map(data => ({
      month: data.month,
      medSpend: Math.round(data.spend_per_claim),
      denialRate: Math.round(data.denial_rate * 10) / 10,
    }));
  }, [chartData, selectedFilters]);

  // Forecast Chart Data (also responds to comprehensive filters)
  const forecastChartData = useMemo(() => {
    const baseData = [
      { month: 'Jan-25', medSpend: 493, denialRate: 20.5 },
      { month: 'Feb-25', medSpend: 430, denialRate: 17.5 },
      { month: 'Mar-25', medSpend: 408, denialRate: 19.5 },
      { month: 'Apr-25', medSpend: 553, denialRate: 20.5 },
      { month: 'May-25', medSpend: 553, denialRate: 18.5 },
      { month: 'Jun-25', medSpend: 565, denialRate: 17.5 },
      { month: 'Jul-25', medSpend: 557, denialRate: 18.5 },
      { month: 'Aug-25', medSpend: 558, denialRate: 18.2 },
      { month: 'Sep-25', medSpend: 560, denialRate: 18.0 },
      { month: 'Oct-25', medSpend: 558, denialRate: 18.0 },
      { month: 'Nov-25', medSpend: 559, denialRate: 18.0 },
      { month: 'Dec-25', medSpend: 559, denialRate: 18.0 },
    ];

    let spendMultiplier = 1;
    let denialMultiplier = 1;

    // Apply same comprehensive filters as actuals data
    // State filters
    if (selectedFilters.state === 'California') {
      spendMultiplier *= 1.15;
      denialMultiplier *= 1.08;
    } else if (selectedFilters.state === 'Florida') {
      spendMultiplier *= 1.08;
      denialMultiplier *= 1.05;
    } else if (selectedFilters.state === 'New York') {
      spendMultiplier *= 1.22;
      denialMultiplier *= 1.12;
    }

    // LOB filters
    if (selectedFilters.lob === 'Medicaid') {
      spendMultiplier *= 0.88;
      denialMultiplier *= 1.15;
    } else if (selectedFilters.lob === 'Commercial') {
      spendMultiplier *= 1.05;
      denialMultiplier *= 1.02;
    } else if (selectedFilters.lob === 'Exchange') {
      spendMultiplier *= 0.92;
      denialMultiplier *= 0.98;
    }

    // Plan filters
    if (selectedFilters.plan?.includes('DSNP')) {
      spendMultiplier *= 1.12;
      denialMultiplier *= 1.08;
    } else if (selectedFilters.plan?.includes('HMO')) {
      spendMultiplier *= 0.95;
      denialMultiplier *= 0.92;
    }

    // Entity filters
    if (selectedFilters.entity?.includes('Hospital')) {
      spendMultiplier *= 1.18;
      denialMultiplier *= 1.1;
    } else if (selectedFilters.entity?.includes('Clinic')) {
      spendMultiplier *= 0.92;
      denialMultiplier *= 0.95;
    }

    // Specialty filters
    if (selectedFilters.specialty === 'Cardiology') {
      spendMultiplier *= 1.25;
      denialMultiplier *= 1.15;
    } else if (selectedFilters.specialty === 'Orthopedics') {
      spendMultiplier *= 1.15;
      denialMultiplier *= 1.08;
    } else if (selectedFilters.specialty === 'Primary Care') {
      spendMultiplier *= 0.88;
      denialMultiplier *= 0.92;
    }

    // Network Status filters
    if (selectedFilters.networkStatus === 'Out of Network') {
      spendMultiplier *= 1.35;
      denialMultiplier *= 1.25;
    } else if (selectedFilters.networkStatus === 'In Network') {
      spendMultiplier *= 0.95;
      denialMultiplier *= 0.92;
    }

    // Contact Type filters
    if (selectedFilters.contactType === 'FFS') {
      spendMultiplier *= 1.08;
      denialMultiplier *= 1.05;
    } else if (selectedFilters.contactType === 'Capitation') {
      spendMultiplier *= 0.92;
      denialMultiplier *= 0.95;
    }

    // Digital Maturity filters
    if (selectedFilters.digitalMaturity === 'Low') {
      spendMultiplier *= 0.85;
      denialMultiplier *= 1.2;
    } else if (selectedFilters.digitalMaturity === 'Medium') {
      spendMultiplier *= 0.95;
      denialMultiplier *= 1.05;
    }

    // Platform filters
    if (selectedFilters.platform === 'Cosmos') {
      spendMultiplier *= 0.92;
      denialMultiplier *= 0.85;
    }

    // Digital Adoption slider effect
    if (selectedFilters.digitalAdoption < 10) {
      spendMultiplier *= 0.8;
      denialMultiplier *= 1.25;
    } else if (selectedFilters.digitalAdoption > 30) {
      spendMultiplier *= 1.1;
      denialMultiplier *= 0.9;
    }

    // IP/OP Ratio effect
    if (selectedFilters.ipToOpRatio > 70) {
      spendMultiplier *= 1.15;
      denialMultiplier *= 1.08;
    } else if (selectedFilters.ipToOpRatio < 50) {
      spendMultiplier *= 0.9;
      denialMultiplier *= 0.95;
    }

    // Apply multipliers to forecast data
    return baseData.map(data => ({
      ...data,
      medSpend: Math.round(data.medSpend * spendMultiplier),
      denialRate: Math.round(data.denialRate * denialMultiplier * 10) / 10,
    }));
  }, [selectedFilters]);

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(0)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const createActualsChart = () => {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={actualsChartData}
          margin={{
            top: 15,
            right: 50,
            left: 50,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            stroke="#64748B"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            yAxisId="medSpend"
            orientation="left"
            stroke="#64748B"
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis 
            yAxisId="denialRate"
            orientation="right"
            stroke="#64748B"
            fontSize={12}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value, name) => {
              if (name === 'medSpend') return [`$${value}`, 'Med Spend/Claim'];
              if (name === 'denialRate') return [`${value}%`, 'Denial Rate'];
              return [value, name];
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Bar 
            yAxisId="medSpend"
            dataKey="medSpend" 
              fill="#0080FF"
            name="Med Spend/Claim"
            radius={[2, 2, 0, 0]}
          />
          <Line 
            yAxisId="denialRate"
            type="monotone" 
            dataKey="denialRate" 
            stroke="#FF6B35" 
              strokeWidth={3}
            dot={{ fill: '#FF6B35', strokeWidth: 2, r: 5 }}
            name="Denial Rate"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  const createForecastChart = () => {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={forecastChartData}
          margin={{
            top: 15,
            right: 50,
            left: 50,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            stroke="#64748B"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            yAxisId="medSpend"
            orientation="left"
            stroke="#64748B"
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
            domain={[0, 600]}
          />
          <YAxis 
            yAxisId="denialRate"
            orientation="right"
            stroke="#64748B"
            fontSize={12}
            tickFormatter={(value) => `${value}%`}
            domain={[15, 21]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value, name) => {
              if (name === 'medSpend') return [`$${value}`, 'Med Spend/Claim'];
              if (name === 'denialRate') return [`${value}%`, 'Denial Rate'];
              return [value, name];
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Bar 
            yAxisId="medSpend"
            dataKey="medSpend" 
            fill="#FF6B35" 
            name="Med Spend/Claim"
            radius={[2, 2, 0, 0]}
          />
          <Line 
            yAxisId="denialRate"
            type="monotone" 
            dataKey="denialRate" 
            stroke="#0080FF" 
            strokeWidth={3}
            dot={{ fill: '#0080FF', strokeWidth: 2, r: 5 }}
            name="Denial Rate"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  const handleFilterChange = (filter: string, value: string | number) => {
    setSelectedFilters(prev => ({ ...prev, [filter]: value }));
  };


  // Dynamic insights based on simulation values
  const getDynamicInsights = () => {
    const digitalAdoption = selectedFilters.digitalAdoption;
    const ipToOpRatio = selectedFilters.ipToOpRatio;
    
    // Calculate projected savings based on digital adoption
    const digitalSavings = Math.round((digitalAdoption - 14.1) * 0.4); // $0.4M per 1% digital adoption
    const ipOpSavings = Math.round((62 - ipToOpRatio) * 0.2); // $0.2M per 1% IP→OP shift
    
    return {
      digitalSavings,
      ipOpSavings,
      totalSavings: digitalSavings + ipOpSavings,
      denialImprovement: Math.round((digitalAdoption - 14.1) * 0.05), // 0.05 pts per 1% digital
      projectedDenial: Math.max(0, 27.2 - Math.round((digitalAdoption - 14.1) * 0.05)),
    };
  };

  const dynamicInsights = getDynamicInsights();

  const handleQuickAction = (action: string) => {
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      message: action,
      timestamp: new Date()
    };

    let alexResponse = '';
    
    switch (action) {
      case 'Show me provider performance':
        alexResponse = `Based on current data, here's your provider performance overview:

Key Metrics:
• Entities Active: 5,420 providers (Top-20 = 41% of volume)
• Spend/Claim: $545 (Index 107, +7% above peer)
• Denial Rate: 27.2% (Index 109, ▼–0.9 pts improvement)
• Overturn Rate: 18% (▲+1.0 improvement)
• Digital Adoption: 14.1% (▲+1.4, below peer avg)

Top Performer: Gulf Coast Surgical leads with highest opportunity at $740k/mo but needs digital maturity improvement.

Recommendation: Focus on digital adoption initiatives to improve efficiency and reduce manual processing.`;
        break;
        
      case 'Analyze recent trends':
        alexResponse = `Here's your recent trend analysis:

Volume Trends:
• Claims volume reduced by 20% but denial rate stayed at 11%
• Medical spend increased by 5% despite volume reduction

Cost Variance Analysis:
• Anesthesia CPT codes: Highest variance in med spending vs peer group
• Mammogram CPT codes: Second highest variance in med spending
• IP→OP Ratio: 62% inpatient mix driving higher costs

Platform Performance:
• TOPS: 33.8% denial rate (+4.5 pts vs Cosmos)
• Cosmos: 29.3% denial rate (better performance)

Key Insight: Digital adoption is the primary lever for improving quality under volume surges.`;
        break;
        
      case 'What are the key metrics?':
        alexResponse = `Here are your key performance indicators:

Primary KPIs:
• Spend/Claim: $545 (Index 107, +7% above peer)
• Denial %: 27.2% (Index 109, ▼–0.9 pts)
• Entities Active: 5,420 providers
• Overturn %: 18% (▲+1.0 improvement)

Efficiency Metrics:
• Paid/Allowed: 94.6% (Target: 95%)
• Digital Adoption: 14.1% (▲+1.4, below peer avg)
• Manual /1k: 53 claims (▼–4 improvement)

Root Cause Breakdown:
• Coding Issues: 43% of denials
• Missing/Invalid: 22% of denials
• Eligibility: 19% of denials

Focus Areas: Digital adoption and coding accuracy improvements.`;
        break;
        
      case 'Generate insights report':
        alexResponse = `Provider Proforma Insights Report

Executive Summary:
We're 7% above peer spend/claim; most variance is IP mix + platform denials in TOPS specialties. Digital is the lever that held quality under a surge.

Key Findings:
• High-Tech, High-Cost: Gulf Coast Surgical ($640/claim, 31.6% denial)
• Platform Sensitive: TOPS shows +4.5 pts higher denial rate vs Cosmos
• IP Outlier: 62% inpatient mix driving 2.22× higher costs

3-Month Forecast:
• Denial %: Apr 27.8% → May 27.6% → Jun 27.9%
• Spend/Claim: $520 → $528 → $539
• Savings Potential: ~$3.1M vs last month

Top Opportunities:
1. Platform Harmonization: $18.6M/Q potential
2. Digital Sprint: $2.4M/mo potential  
3. Site-of-Care Shift: $3.8M/Q potential

Recommendation: Rebalance IP→OP ratio and enforce platform parity for maximum impact.`;
        break;
        
      default:
        alexResponse = "I'd be happy to help with that! Could you provide more specific details about what you'd like to know?";
    }

    const alexMessage = {
      id: (Date.now() + 1).toString(),
      type: 'alex' as const,
      message: alexResponse,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage, alexMessage]);
  };

  const getDeltaIcon = (deltaType: string) => {
    switch (deltaType) {
      case 'positive':
        return <TrendingUp sx={{ color: '#10B981', fontSize: 16 }} />;
      case 'negative':
        return <TrendingDown sx={{ color: '#EF4444', fontSize: 16 }} />;
      default:
        return <TrendingFlat sx={{ color: '#6B7280', fontSize: 16 }} />;
    }
  };

  const getIndexColor = (index: number) => {
    if (index >= 110) return '#EF4444';
    if (index >= 105) return '#F59E0B';
    if (index >= 95) return '#10B981';
    return '#6B7280';
  };

  // Get very light colors for each KPI tile
  const getTileColors = (index: number) => {
    const colorSchemes = [
      // Tile 1 - Very light blue
      {
        background: '#F0F9FF',
        border: '#BAE6FD',
        hoverBackground: '#E0F2FE',
        hoverBorder: '#7DD3FC'
      },
      // Tile 2 - Very light green
      {
        background: '#F0FDF4',
        border: '#BBF7D0',
        hoverBackground: '#DCFCE7',
        hoverBorder: '#86EFAC'
      },
      // Tile 3 - Very light purple
      {
        background: '#FAF5FF',
        border: '#DDD6FE',
        hoverBackground: '#F3E8FF',
        hoverBorder: '#C4B5FD'
      },
      // Tile 4 - Very light orange
      {
        background: '#FFF7ED',
        border: '#FED7AA',
        hoverBackground: '#FFEDD5',
        hoverBorder: '#FDBA74'
      },
      // Tile 5 - Very light pink
      {
        background: '#FDF2F8',
        border: '#FBCFE8',
        hoverBackground: '#FCE7F3',
        hoverBorder: '#F9A8D4'
      },
      // Tile 6 - Very light teal
      {
        background: '#F0FDFA',
        border: '#99F6E4',
        hoverBackground: '#CCFBF1',
        hoverBorder: '#5EEAD4'
      },
      // Tile 7 - Very light yellow
      {
        background: '#FEFCE8',
        border: '#FEF08A',
        hoverBackground: '#FEF3C7',
        hoverBorder: '#FDE047'
      },
      // Tile 8 - Very light gray-blue
      {
        background: '#F8FAFC',
        border: '#E2E8F0',
        hoverBackground: '#F1F5F9',
        hoverBorder: '#CBD5E1'
      }
    ];
    return colorSchemes[index % colorSchemes.length];
  };

  // Detailed calculation explanations for each KPI with dynamic values
  // Handle period selection
  const handlePeriodSelection = (period: string) => {
    setSelectedPeriod(period);
    // Generate comparative data based on selected period
    generateComparativeData(period, selectedDimension);
  };

  // Handle dimension selection
  const handleDimensionSelection = (dimension: string) => {
    setSelectedDimension(dimension);
    generateComparativeData(selectedPeriod, dimension);
  };

  // Generate comparative data based on period and dimension
  const generateComparativeData = (period: string, dimension: string) => {
    const mockData = {
      Monthly: {
        current: { value: 1240000, change: 6.2 },
        previous: { value: 1168000, change: 4.1 },
        trend: 'up'
      },
      QoQ: {
        current: { value: 1240000, change: 8.5 },
        previous: { value: 1142000, change: 2.3 },
        trend: 'up'
      },
      YoY: {
        current: { value: 1240000, change: 12.4 },
        previous: { value: 1103000, change: 7.8 },
        trend: 'up'
      },
      'Rolling 12M': {
        current: { value: 1240000, change: 9.7 },
        previous: { value: 1131000, change: 6.2 },
        trend: 'up'
      }
    };

    const dimensionData = {
      'By LOB': {
        'Medicare Advantage': { value: 560000, change: 8.2 },
        'Commercial': { value: 356000, change: 4.1 },
        'Medicaid': { value: 190000, change: 12.5 },
        'Exchange': { value: 85000, change: -2.1 },
        'Medicare FFS': { value: 26000, change: 1.8 },
        'Dual Eligible': { value: 23000, change: 15.3 }
      },
      'Site of Service': {
        'Houston Medical Center': { value: 324700, change: 18.2 },
        'Dallas Regional': { value: 289100, change: 14.1 },
        'Austin General': { value: 215600, change: 9.3 },
        'San Antonio Clinic': { value: 198700, change: 6.7 },
        'Fort Worth Health': { value: 174300, change: 3.2 }
      },
      'Entity (TIN)': {
        'Gulf Coast Surgical': { value: 284700, change: 12.1 },
        'MaxWell Hospitals': { value: 263400, change: 8.3 },
        'Metro Health Center': { value: 215600, change: 15.7 },
        'Regional Medical': { value: 198700, change: 5.2 },
        'City General': { value: 174300, change: -2.1 }
      },
      'Geography': {
        'Texas': { value: 890000, change: 11.2 },
        'California': { value: 234000, change: 8.7 },
        'Florida': { value: 89000, change: 15.3 },
        'New York': { value: 27000, change: 22.1 }
      }
    };

    setComparativeData({
      period: mockData[period as keyof typeof mockData],
      dimension: dimension ? dimensionData[dimension as keyof typeof dimensionData] : null
    });
  };

  const getKPIDetails = (metric: KPIMetric) => {
    const currentValue = metric.value;
    const deltaValue = metric.delta;
    const peerComparison = metric.peerComparison;
    const index = metric.index;
    
    // Calculate base values for dynamic calculations
    const getBaseValue = (value: string | number) => {
      const numericValue = parseFloat(value.toString().replace(/[$,%]/g, ''));
      return numericValue;
    };
    
    const baseValue = getBaseValue(currentValue);
    
    const details: { [key: string]: { calculation: string; components: string[]; insights: string } } = {
      'Spend per Claim': {
        calculation: 'Total Medical Spend ÷ Total Claims Processed',
        components: [
          `• Current Value: ${currentValue} (Index ${index})`,
          `• Change from Previous: ${deltaValue || 'N/A'}`,
          `• Peer Comparison: ${peerComparison || 'N/A'}`,
          '• Calculation Breakdown:',
          '  - Inpatient Claims: 45% of total spend',
          '  - Outpatient Claims: 38% of total spend',
          '  - Emergency Claims: 17% of total spend',
          `• Filter Impact: Applied based on selected filters`
        ],
        insights: `Current spend per claim is ${currentValue}. ${deltaValue ? `Change: ${deltaValue}` : ''} ${peerComparison ? `vs peers: ${peerComparison}` : ''}`
      },
      'Denial Rate': {
        calculation: 'Total Denied Claims ÷ Total Claims Submitted × 100',
        components: [
          `• Current Value: ${currentValue} (Index ${index})`,
          `• Change from Previous: ${deltaValue || 'N/A'}`,
          `• Peer Comparison: ${peerComparison || 'N/A'}`,
          '• Denial Breakdown:',
          '  - Prior Auth Missing: 40% of denials',
          '  - Coding Errors: 29% of denials',
          '  - Coverage Issues: 31% of denials',
          `• Filter Impact: Applied based on selected filters`
        ],
        insights: `Current denial rate is ${currentValue}. ${deltaValue ? `Change: ${deltaValue}` : ''} ${peerComparison ? `vs peers: ${peerComparison}` : ''}`
      },
      'Overturn Rate': {
        calculation: 'Successfully Overturned Denials ÷ Total Appeals × 100',
        components: [
          `• Current Value: ${currentValue} (Index ${index})`,
          `• Change from Previous: ${deltaValue || 'N/A'}`,
          `• Peer Comparison: ${peerComparison || 'N/A'}`,
          '• Appeal Success Rates:',
          '  - Level 1 Appeals: 63% success rate',
          '  - Level 2 Appeals: 37% success rate',
          `• Filter Impact: Applied based on selected filters`
        ],
        insights: `Current overturn rate is ${currentValue}. ${deltaValue ? `Change: ${deltaValue}` : ''} ${peerComparison ? `vs peers: ${peerComparison}` : ''}`
      },
      'Clean Claim %': {
        calculation: 'Claims Processed Without Issues ÷ Total Claims × 100',
        components: [
          `• Current Value: ${currentValue} (Index ${index})`,
          `• Change from Previous: ${deltaValue || 'N/A'}`,
          `• Peer Comparison: ${peerComparison || 'N/A'}`,
          '• Common Issues:',
          '  - Missing Information: 45% of issues',
          '  - Incorrect Coding: 35% of issues',
          '  - Duplicate Claims: 20% of issues',
          `• Filter Impact: Applied based on selected filters`
        ],
        insights: `Current clean claim rate is ${currentValue}. ${deltaValue ? `Change: ${deltaValue}` : ''} ${peerComparison ? `vs peers: ${peerComparison}` : ''}`
      },
      'TAT (median)': {
        calculation: 'Median Time from Claim Submission to Payment',
        components: [
          `• Current Value: ${currentValue} (Index ${index})`,
          `• Change from Previous: ${deltaValue || 'N/A'}`,
          `• Peer Comparison: ${peerComparison || 'N/A'}`,
          '• Processing Breakdown:',
          '  - Electronic Claims: 65% of volume',
          '  - Paper Claims: 35% of volume',
          '  - Target: 7 days',
          `• Filter Impact: Applied based on selected filters`
        ],
        insights: `Current TAT is ${currentValue}. ${deltaValue ? `Change: ${deltaValue}` : ''} ${peerComparison ? `vs peers: ${peerComparison}` : ''}`
      },
      'Readmit 30-day': {
        calculation: '30-Day Readmissions ÷ Total Discharges × 100',
        components: [
          `• Current Value: ${currentValue} (Index ${index})`,
          `• Change from Previous: ${deltaValue || 'N/A'}`,
          `• Peer Comparison: ${peerComparison || 'N/A'}`,
          '• Readmission Types:',
          '  - Same Condition: 62% of readmissions',
          '  - Related Condition: 28% of readmissions',
          '  - Unrelated: 10% of readmissions',
          `• Filter Impact: Applied based on selected filters`
        ],
        insights: `Current readmit rate is ${currentValue}. ${deltaValue ? `Change: ${deltaValue}` : ''} ${peerComparison ? `vs peers: ${peerComparison}` : ''}`
      },
      'ER Visits/1k': {
        calculation: 'Emergency Room Visits ÷ Member Months × 1,000',
        components: [
          `• Current Value: ${currentValue} (Index ${index})`,
          `• Change from Previous: ${deltaValue || 'N/A'}`,
          `• Peer Comparison: ${peerComparison || 'N/A'}`,
          '• Visit Categories:',
          '  - Non-Urgent: 40% of visits',
          '  - Urgent: 50% of visits',
          '  - Emergent: 10% of visits',
          `• Filter Impact: Applied based on selected filters`
        ],
        insights: `Current ER visits per 1k is ${currentValue}. ${deltaValue ? `Change: ${deltaValue}` : ''} ${peerComparison ? `vs peers: ${peerComparison}` : ''}`
      },
      'Paid/Billed': {
        calculation: 'Total Payments ÷ Total Billed Amount × 100',
        components: [
          `• Current Value: ${currentValue} (Index ${index})`,
          `• Change from Previous: ${deltaValue || 'N/A'}`,
          `• Peer Comparison: ${peerComparison || 'N/A'}`,
          '• Payment Types:',
          '  - Full Payment: 78% of claims',
          '  - Partial Payment: 22% of claims',
          '  - Denied: 14% of claims',
          `• Filter Impact: Applied based on selected filters`
        ],
        insights: `Current paid/billed ratio is ${currentValue}. ${deltaValue ? `Change: ${deltaValue}` : ''} ${peerComparison ? `vs peers: ${peerComparison}` : ''}`
      },
      'PMPM': {
        calculation: 'Total Medical Spend ÷ Member Months',
        components: [
          `• Current Value: ${currentValue} (Index ${index})`,
          `• Change from Previous: ${deltaValue || 'N/A'}`,
          `• Peer Comparison: ${peerComparison || 'N/A'}`,
          '• Spend Distribution:',
          '  - Inpatient: 50% of spend',
          '  - Outpatient: 31% of spend',
          '  - Pharmacy: 19% of spend',
          `• Filter Impact: Applied based on selected filters`
        ],
        insights: `Current PMPM is ${currentValue}. ${deltaValue ? `Change: ${deltaValue}` : ''} ${peerComparison ? `vs peers: ${peerComparison}` : ''}`
      },
      'CSAT': {
        calculation: 'Average Customer Satisfaction Score (1-5 scale)',
        components: [
          `• Current Value: ${currentValue} (Index ${index})`,
          `• Change from Previous: ${deltaValue || 'N/A'}`,
          `• Peer Comparison: ${peerComparison || 'N/A'}`,
          '• Score Distribution:',
          '  - 5 Stars: 40% of responses',
          '  - 4 Stars: 30% of responses',
          '  - 3 Stars: 20% of responses',
          '  - 2 Stars: 7% of responses',
          '  - 1 Star: 3% of responses',
          `• Filter Impact: Applied based on selected filters`
        ],
        insights: `Current CSAT score is ${currentValue}. ${deltaValue ? `Change: ${deltaValue}` : ''} ${peerComparison ? `vs peers: ${peerComparison}` : ''}`
      }
    };
    return details[metric.label] || { 
      calculation: 'N/A', 
      components: [`• Current Value: ${currentValue}`, `• Change: ${deltaValue || 'N/A'}`, `• Peer Comparison: ${peerComparison || 'N/A'}`], 
      insights: 'No detailed insights available for this metric.' 
    };
  };

  // Loading state
  if (loading.providerKPIs || loading.providerEntities || loading.chartData) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error state
  if (errors.providerKPIs || errors.providerEntities || errors.chartData) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        <Header user={user} onLogout={onLogout} />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Error loading Provider Proforma data
            </Typography>
            <Typography>
              {errors.providerKPIs || errors.providerEntities || errors.chartData}
            </Typography>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <Header user={user} onLogout={onLogout} />
      
      {/* Filter Controls */}
      <Box sx={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E5E7EB', py: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Typography variant="h6" color="text.primary" sx={{ mr: 2 }}>
              Filter Data:
            </Typography>
            
            {/* State Filter */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>State</InputLabel>
              <Select
                value={selectedFilters.state}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, state: e.target.value }))}
                label="State"
              >
                <MenuItem value="Texas">Texas</MenuItem>
                <MenuItem value="California">California</MenuItem>
                <MenuItem value="Florida">Florida</MenuItem>
                <MenuItem value="New York">New York</MenuItem>
              </Select>
            </FormControl>

            {/* LOB Filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Line of Business</InputLabel>
              <Select
                value={selectedFilters.lob}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, lob: e.target.value }))}
                label="Line of Business"
              >
                <MenuItem value="Medicare Advantage">Medicare Advantage</MenuItem>
                <MenuItem value="Medicaid">Medicaid</MenuItem>
                <MenuItem value="Commercial">Commercial</MenuItem>
                <MenuItem value="Exchange">Exchange</MenuItem>
              </Select>
            </FormControl>

            {/* Digital Maturity Filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Digital Maturity</InputLabel>
              <Select
                value={selectedFilters.digitalMaturity}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, digitalMaturity: e.target.value }))}
                label="Digital Maturity"
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>

            {/* Platform Filter */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                value={selectedFilters.platform}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, platform: e.target.value }))}
                label="Platform"
              >
                <MenuItem value="TOPS">TOPS</MenuItem>
                <MenuItem value="Cosmos">Cosmos</MenuItem>
              </Select>
            </FormControl>

            {/* Reset Button */}
            <Button
              variant="outlined"
              size="small"
              onClick={() => setSelectedFilters(prev => ({
                ...prev,
                state: 'Texas',
                lob: 'Medicare Advantage',
                digitalMaturity: 'High',
                platform: 'TOPS'
              }))}
            >
              Reset Filters
            </Button>
          </Box>

          {/* Applied Filters Display */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Active Filters:
            </Typography>
            <Chip 
              label={`State: ${selectedFilters.state}`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              label={`LOB: ${selectedFilters.lob}`} 
              size="small" 
              color="secondary" 
              variant="outlined"
            />
            <Chip 
              label={`Digital: ${selectedFilters.digitalMaturity}`} 
              size="small" 
              color="secondary" 
              variant="outlined"
            />
            <Chip 
              label={`Platform: ${selectedFilters.platform}`} 
              size="small" 
              color="secondary" 
              variant="outlined"
            />
          </Box>
        </Container>
      </Box>
      
      {/* Custom Header Bar */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Breadcrumbs sx={{ '& .MuiBreadcrumbs-separator': { color: '#94A3B8' } }}>
              <Link
                component="button"
                variant="body2"
                onClick={onNavigateToHomepage}
                sx={{ color: '#64748B', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Dashboard
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={onNavigateToHomepage}
                sx={{ color: '#64748B', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Payment Integrity
              </Link>
              <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 600 }}>
                Provider Proforma
              </Typography>
            </Breadcrumbs>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterDrawerOpen(true)}
              sx={{ 
                borderColor: '#D1D5DB', 
                color: '#374151', 
                textTransform: 'none',
                '&:hover': { borderColor: '#0080FF', backgroundColor: '#F0F4FF' }
              }}
            >
              Filters
            </Button>
            <Button
              variant="contained"
              startIcon={<AutoAwesome />}
              onClick={() => setAskAlexOpen(true)}
              sx={{
                backgroundColor: '#0080FF',
                color: 'white',
                px: 3,
                py: 1,
                fontSize: '0.875rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#0066CC',
                },
              }}
            >
              Ask Alex
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Action Buttons Row */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 0 },
        px: { xs: 2, sm: 4 },
        py: 2,
        borderBottom: '1px solid #E5E7EB',
        backgroundColor: '#F8FAFC'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          color: '#0F172A',
          fontSize: { xs: '1.5rem', sm: '2rem' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          Provider Proforma
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', sm: 'flex-end' }
        }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Assessment />}
            sx={{ 
              borderColor: '#E2E8F0', 
              color: '#475569',
              textTransform: 'none',
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              px: { xs: 1.5, sm: 2 },
              py: 0.5,
              minWidth: 'auto',
              '&:hover': { 
                borderColor: '#0080FF', 
                backgroundColor: '#F0F4FF',
                color: '#0080FF'
              }
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>View Claims</Box>
            <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Claims</Box>
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Group />}
            sx={{ 
              borderColor: '#E2E8F0', 
              color: '#475569',
              textTransform: 'none',
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              px: { xs: 1.5, sm: 2 },
              py: 0.5,
              minWidth: 'auto',
              '&:hover': { 
                borderColor: '#0080FF', 
                backgroundColor: '#F0F4FF',
                color: '#0080FF'
              }
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>View Attributed Members</Box>
            <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Members</Box>
          </Button>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Title */}
        <Box sx={{ mb: 2 }}>
        </Box>

        {/* Main Layout Section */}
        <Box sx={{ 
          mb: 8,
          display: 'flex',
          gap: 4,
          flexDirection: { xs: 'column', lg: 'row' }
        }}>
          {/* Left Column */}
          <Box sx={{ flex: 2 }}>
            {/* Key Performance Indicators */}
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 4, color: '#0F172A' }}>
              Key Performance Indicators
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 1.5,
              height: '200px'
            }}>
              {/* Top Row - 4 tiles */}
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1, sm: 1.5 },
                flex: '1 1 50%',
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
              }}>
                {kpiMetrics.slice(0, 4).map((metric, index) => {
                  const details = getKPIDetails(metric);
                  const colors = getTileColors(index);
                  return (
                    <MuiTooltip
                      key={index}
                      title={
                        <Box sx={{ p: 1, maxWidth: 400 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
                            {metric.label} - Calculation Details
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, color: '#E5E7EB' }}>
                            <strong>Formula:</strong> {details.calculation}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, color: '#E5E7EB' }}>
                            <strong>Components:</strong>
                          </Typography>
                          <Box sx={{ mb: 1 }}>
                            {details.components.map((component, idx) => (
                              <Typography key={idx} variant="caption" sx={{ display: 'block', color: '#D1D5DB', fontSize: '0.7rem' }}>
                                {component}
                              </Typography>
                            ))}
                          </Box>
                          <Typography variant="body2" sx={{ color: '#F3F4F6', fontStyle: 'italic' }}>
                            <strong>Insight:</strong> {details.insights}
                          </Typography>
                        </Box>
                      }
                      arrow
                      placement="top"
                    >
                      <Card sx={{ 
                    flex: { xs: '1 1 45%', sm: '1 1 25%' }, 
                    borderRadius: 2,
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: colors.hoverBackground,
                          borderColor: colors.hoverBorder,
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          transform: 'translateY(-1px)'
                        }
                  }}>
                    <CardContent sx={{ 
                      p: '20px', 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      '&:last-child': {
                        paddingBottom: '20px !important'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.75rem', fontWeight: 500 }}>
                          {metric.label}
                        </Typography>
                        {metric.index && (
                          <Chip
                            label={metric.index}
                            size="small"
                            sx={{
                              backgroundColor: getIndexColor(metric.index),
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 18,
                              minWidth: 24,
                            }}
                          />
                        )}
                      </Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', mb: 0 }}>
                        {metric.value}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                          {metric.delta}
                        </Typography>
                      {metric.peerComparison && (
                          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem', ml: 0.5 }}>
                          {metric.peerComparison}
                        </Typography>
                      )}
                      </Box>
                    </CardContent>
                  </Card>
                    </MuiTooltip>
                  );
                })}
              </Box>

              {/* Bottom Row - 4 tiles */}
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1, sm: 1.5 },
                flex: '1 1 50%',
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
              }}>
                {kpiMetrics.slice(4, 8).map((metric, index) => {
                  const details = getKPIDetails(metric);
                  const colors = getTileColors(index + 4); // Use index + 4 for tiles 5-8
                  return (
                    <MuiTooltip
                      key={index + 4}
                      title={
                        <Box sx={{ p: 1, maxWidth: 400 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
                            {metric.label} - Calculation Details
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, color: '#E5E7EB' }}>
                            <strong>Formula:</strong> {details.calculation}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, color: '#E5E7EB' }}>
                            <strong>Components:</strong>
                          </Typography>
                          <Box sx={{ mb: 1 }}>
                            {details.components.map((component, idx) => (
                              <Typography key={idx} variant="caption" sx={{ display: 'block', color: '#D1D5DB', fontSize: '0.7rem' }}>
                                {component}
                              </Typography>
                            ))}
                          </Box>
                          <Typography variant="body2" sx={{ color: '#F3F4F6', fontStyle: 'italic' }}>
                            <strong>Insight:</strong> {details.insights}
                          </Typography>
                        </Box>
                      }
                      arrow
                      placement="top"
                    >
                      <Card sx={{ 
                    flex: { xs: '1 1 45%', sm: '1 1 25%' }, 
                    borderRadius: 2,
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: colors.hoverBackground,
                          borderColor: colors.hoverBorder,
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          transform: 'translateY(-1px)'
                        }
                  }}>
                    <CardContent sx={{ 
                      p: '20px', 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      '&:last-child': {
                        paddingBottom: '20px !important'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.75rem', fontWeight: 500 }}>
                          {metric.label}
                        </Typography>
                        {metric.index && (
                          <Chip
                            label={metric.index}
                            size="small"
                            sx={{
                              backgroundColor: getIndexColor(metric.index),
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 18,
                              minWidth: 24,
                            }}
                          />
                        )}
                      </Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', mb: 0 }}>
                        {metric.value}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                          {metric.delta}
                        </Typography>
                      {metric.peerComparison && (
                          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem', ml: 0.5 }}>
                          {metric.peerComparison}
                        </Typography>
                      )}
                      </Box>
                    </CardContent>
                  </Card>
                    </MuiTooltip>
                  );
                })}
              </Box>
            </Box>

            {/* New Metrics Section */}
            <Box sx={{ mt: 12 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 4, color: '#0F172A' }}>
                Advanced Analytics & Performance Insights
              </Typography>
              
              {/* Claim Value Trends */}
              <Box sx={{ mb: 4 }}>
                <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#0F172A' }}>
                      Claim Value Trends
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                      <MuiTooltip
                        title={
                          <Box sx={{ p: 1, maxWidth: 400 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
                              Total Claim Value - Calculation Details
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1, color: '#E5E7EB' }}>
                              <strong>Formula:</strong> Sum of all approved claim amounts for the current period
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1, color: '#E5E7EB' }}>
                              <strong>Components:</strong>
                            </Typography>
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="caption" sx={{ display: 'block', color: '#D1D5DB', fontSize: '0.7rem' }}>
                                • Inpatient Claims: $14.2M (57.5% of total)
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: '#D1D5DB', fontSize: '0.7rem' }}>
                                • Outpatient Claims: $7.8M (31.6% of total)
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: '#D1D5DB', fontSize: '0.7rem' }}>
                                • Emergency Claims: $2.7M (10.9% of total)
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: '#D1D5DB', fontSize: '0.7rem' }}>
                                • Period: Q1 2025 (Jan-Mar)
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: '#D1D5DB', fontSize: '0.7rem' }}>
                                • Previous Period: $22.0M (Q4 2024)
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#F3F4F6', fontStyle: 'italic' }}>
                              <strong>Insight:</strong> 12.3% increase driven by higher inpatient utilization and new provider contracts.
                            </Typography>
                          </Box>
                        }
                        arrow
                        placement="top"
                      >
                        <Box sx={{ p: 2, backgroundColor: '#F0F9FF', borderRadius: 2, border: '1px solid #BAE6FD', cursor: 'pointer' }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E40AF', mb: 1 }}>
                            $24.7M
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#475569', mb: 1 }}>
                            Total Claim Value (Current Period)
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUp sx={{ fontSize: 16, color: '#059669' }} />
                            <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
                              +12.3% vs Previous Period
                            </Typography>
                          </Box>
                        </Box>
                      </MuiTooltip>
                      <MuiTooltip
                        title={
                          <Box sx={{ p: 1, maxWidth: 400 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
                              Unique Claims Count - Calculation Details
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1, color: '#E5E7EB' }}>
                              <strong>Formula:</strong> Count of distinct claims submitted (deduplicated by claim ID)
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1, color: '#E5E7EB' }}>
                              <strong>Components:</strong>
                            </Typography>
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="caption" sx={{ display: 'block', color: '#D1D5DB', fontSize: '0.7rem' }}>
                                • Electronic Claims: 1.18M (95.2% of total)
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: '#D1D5DB', fontSize: '0.7rem' }}>
                                • Paper Claims: 60K (4.8% of total)
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: '#D1D5DB', fontSize: '0.7rem' }}>
                                • Period: Q1 2025 (Jan-Mar)
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: '#D1D5DB', fontSize: '0.7rem' }}>
                                • Previous Year: 1.17M (Q1 2024)
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: '#D1D5DB', fontSize: '0.7rem' }}>
                                • Duplicate Claims Removed: 12,450
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#F3F4F6', fontStyle: 'italic' }}>
                              <strong>Insight:</strong> 6% YoY growth indicates increased provider activity and member utilization.
                            </Typography>
                          </Box>
                        }
                        arrow
                        placement="top"
                      >
                        <Box sx={{ p: 2, backgroundColor: '#F0FDF4', borderRadius: 2, border: '1px solid #BBF7D0', cursor: 'pointer' }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#166534', mb: 1 }}>
                            1.24M
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#475569', mb: 1 }}>
                            Unique Claims Submitted
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUp sx={{ fontSize: 16, color: '#059669' }} />
                            <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
                              +6% YoY Growth
                            </Typography>
                          </Box>
                        </Box>
                      </MuiTooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Performance Scores */}
              <Box sx={{ mb: 4 }}>
                <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#0F172A' }}>
                      Performance Scores
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
                      {[
                        { 
                          label: 'Claims Processing Efficiency', 
                          score: '94.2%', 
                          trend: '+2.1%', 
                          color: '#059669',
                          details: {
                            formula: 'Claims Processed Successfully ÷ Total Claims × 100',
                            components: [
                              '• Total Claims: 1.24M',
                              '• Successfully Processed: 1.17M',
                              '• Rejected Claims: 70K (5.8%)',
                              '• Processing Time: 2.3 days avg',
                              '• Target: 95% efficiency'
                            ],
                            insight: 'Above target with improved automation and staff training.'
                          }
                        },
                        { 
                          label: 'Provider Satisfaction', 
                          score: '4.6/5', 
                          trend: '+0.3', 
                          color: '#0EA5E9',
                          details: {
                            formula: 'Average rating from provider surveys (1-5 scale)',
                            components: [
                              '• Total Surveys: 2,340 responses',
                              '• Response Rate: 78%',
                              '• 5-Star Ratings: 1,404 (60%)',
                              '• 4-Star Ratings: 702 (30%)',
                              '• 3-Star Ratings: 234 (10%)'
                            ],
                            insight: 'Strong satisfaction driven by improved communication and faster payments.'
                          }
                        },
                        { 
                          label: 'Cost Management', 
                          score: '87.5%', 
                          trend: '+5.2%', 
                          color: '#7C3AED',
                          details: {
                            formula: 'Actual Costs ÷ Budgeted Costs × 100',
                            components: [
                              '• Budgeted Costs: $28.5M',
                              '• Actual Costs: $24.9M',
                              '• Cost Savings: $3.6M (12.5%)',
                              '• Primary Savings: Contract negotiations',
                              '• Secondary Savings: Process optimization'
                            ],
                            insight: 'Exceeded cost management targets through strategic initiatives.'
                          }
                        },
                        { 
                          label: 'Quality Score', 
                          score: '91.8%', 
                          trend: '+1.7%', 
                          color: '#DC2626',
                          details: {
                            formula: 'Weighted average of quality metrics',
                            components: [
                              '• Clinical Outcomes: 94%',
                              '• Patient Safety: 89%',
                              '• Care Coordination: 92%',
                              '• Documentation: 88%',
                              '• Compliance: 96%'
                            ],
                            insight: 'Consistent quality improvement across all measured areas.'
                          }
                        }
                      ].map((metric, index) => (
                        <MuiTooltip
                          key={index}
                          title={
                            <Box sx={{ p: 1, maxWidth: 400 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
                                {metric.label} - Calculation Details
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1, color: '#E5E7EB' }}>
                                <strong>Formula:</strong> {metric.details.formula}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1, color: '#E5E7EB' }}>
                                <strong>Components:</strong>
                              </Typography>
                              <Box sx={{ mb: 1 }}>
                                {metric.details.components.map((component, idx) => (
                                  <Typography key={idx} variant="caption" sx={{ display: 'block', color: '#D1D5DB', fontSize: '0.7rem' }}>
                                    {component}
                                  </Typography>
                                ))}
                              </Box>
                              <Typography variant="body2" sx={{ color: '#F3F4F6', fontStyle: 'italic' }}>
                                <strong>Insight:</strong> {metric.details.insight}
                              </Typography>
                            </Box>
                          }
                          arrow
                          placement="top"
                        >
                          <Box sx={{ p: 2, backgroundColor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: metric.color, mb: 0.5 }}>
                              {metric.score}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#475569', mb: 1, fontSize: '0.8rem' }}>
                              {metric.label}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <TrendingUp sx={{ fontSize: 14, color: '#059669' }} />
                              <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
                                {metric.trend}
                              </Typography>
                            </Box>
                          </Box>
                        </MuiTooltip>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Top Performers Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
                {/* Top 10 Providers by Volume */}
                <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#0F172A' }}>
                      Top 10 Providers by Volume
                    </Typography>
                    <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                      {[
                        { name: 'Gulf Coast Surgical', volume: '2,847', change: '+12%', color: '#059669' },
                        { name: 'MaxWell Hospitals', volume: '2,634', change: '+8%', color: '#059669' },
                        { name: 'Metro Health Center', volume: '2,156', change: '+15%', color: '#059669' },
                        { name: 'Regional Medical', volume: '1,987', change: '+5%', color: '#F59E0B' },
                        { name: 'City General', volume: '1,743', change: '-2%', color: '#EF4444' },
                        { name: 'Community Care', volume: '1,625', change: '+7%', color: '#059669' },
                        { name: 'Valley Health', volume: '1,498', change: '+3%', color: '#059669' },
                        { name: 'Riverside Clinic', volume: '1,342', change: '+9%', color: '#059669' },
                        { name: 'Mountain View', volume: '1,287', change: '+4%', color: '#059669' },
                        { name: 'Sunset Medical', volume: '1,156', change: '+6%', color: '#059669' }
                      ].map((provider, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          py: 1.5, 
                          borderBottom: index < 9 ? '1px solid #F1F5F9' : 'none' 
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 20, 
                              height: 20, 
                              borderRadius: '50%', 
                              backgroundColor: index < 3 ? '#FEF3C7' : '#F3F4F6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: index < 3 ? '#D97706' : '#6B7280'
                            }}>
                              {index + 1}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                              {provider.name}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                              {provider.volume}
                            </Typography>
                            <Typography variant="caption" sx={{ color: provider.color, fontWeight: 600 }}>
                              {provider.change}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Top 10 LOBs */}
                <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#0F172A' }}>
                      Top 10 LOBs
                    </Typography>
                    <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                      {[
                        { name: 'Medicare Advantage', volume: '45.2%', change: '+3.1%', color: '#059669' },
                        { name: 'Commercial', volume: '28.7%', change: '+1.8%', color: '#059669' },
                        { name: 'Medicaid', volume: '15.3%', change: '+2.4%', color: '#059669' },
                        { name: 'Exchange', volume: '6.8%', change: '-0.5%', color: '#EF4444' },
                        { name: 'Medicare FFS', volume: '2.1%', change: '+0.3%', color: '#059669' },
                        { name: 'Dual Eligible', volume: '1.9%', change: '+0.7%', color: '#059669' }
                      ].map((lob, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          py: 1.5, 
                          borderBottom: index < 5 ? '1px solid #F1F5F9' : 'none' 
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 20, 
                              height: 20, 
                              borderRadius: '50%', 
                              backgroundColor: index < 3 ? '#DBEAFE' : '#F3F4F6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: index < 3 ? '#1D4ED8' : '#6B7280'
                            }}>
                              {index + 1}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                              {lob.name}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                              {lob.volume}
                            </Typography>
                            <Typography variant="caption" sx={{ color: lob.color, fontWeight: 600 }}>
                              {lob.change}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Top 10 Sites */}
                <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#0F172A' }}>
                      Top 10 Sites
                    </Typography>
                    <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                      {[
                        { name: 'Houston Medical Center', volume: '3,247', change: '+18%', color: '#059669' },
                        { name: 'Dallas Regional', volume: '2,891', change: '+14%', color: '#059669' },
                        { name: 'Austin General', volume: '2,156', change: '+9%', color: '#059669' },
                        { name: 'San Antonio Clinic', volume: '1,987', change: '+6%', color: '#059669' },
                        { name: 'Fort Worth Health', volume: '1,743', change: '+3%', color: '#059669' },
                        { name: 'El Paso Medical', volume: '1,625', change: '+11%', color: '#059669' },
                        { name: 'Corpus Christi', volume: '1,498', change: '+7%', color: '#059669' },
                        { name: 'Lubbock Regional', volume: '1,342', change: '+4%', color: '#059669' },
                        { name: 'Amarillo Clinic', volume: '1,287', change: '+8%', color: '#059669' },
                        { name: 'Laredo Health', volume: '1,156', change: '+5%', color: '#059669' }
                      ].map((site, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          py: 1.5, 
                          borderBottom: index < 9 ? '1px solid #F1F5F9' : 'none' 
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 20, 
                              height: 20, 
                              borderRadius: '50%', 
                              backgroundColor: index < 3 ? '#DCFCE7' : '#F3F4F6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: index < 3 ? '#166534' : '#6B7280'
                            }}>
                              {index + 1}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                              {site.name}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                              {site.volume}
                            </Typography>
                            <Typography variant="caption" sx={{ color: site.color, fontWeight: 600 }}>
                              {site.change}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Drill-Down & Comparative Analysis */}
              <Box sx={{ mb: 4 }}>
                <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#0F172A' }}>
                      Drill-Down Analysis & Period Comparison
                    </Typography>
                    
                    {/* Period Selection */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                        Select Comparison Periods
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {['Monthly', 'QoQ', 'YoY', 'Rolling 12M'].map((period) => (
                          <Chip
                            key={period}
                            label={period}
                            variant={selectedPeriod === period ? 'filled' : 'outlined'}
                            clickable
                            onClick={() => handlePeriodSelection(period)}
                            sx={{
                              borderColor: selectedPeriod === period ? '#3B82F6' : '#D1D5DB',
                              backgroundColor: selectedPeriod === period ? '#3B82F6' : 'transparent',
                              color: selectedPeriod === period ? 'white' : '#374151',
                              '&:hover': {
                                backgroundColor: selectedPeriod === period ? '#2563EB' : '#F3F4F6',
                                borderColor: selectedPeriod === period ? '#2563EB' : '#9CA3AF'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Drill-Down Dimensions */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                        Drill-Down by Dimension
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
                        {[
                          { label: 'By LOB', icon: '📋', count: '6 LOBs', trend: '+2.3%' },
                          { label: 'Site of Service', icon: '🏥', count: '15 Sites', trend: '+8.1%' },
                          { label: 'Entity (TIN)', icon: '🏢', count: '42 Entities', trend: '+5.7%' },
                          { label: 'Geography', icon: '🗺️', count: '8 States', trend: '+12.4%' }
                        ].map((dimension, index) => (
                          <Card 
                            key={index} 
                            onClick={() => handleDimensionSelection(dimension.label)}
                            sx={{ 
                              p: 2, 
                              backgroundColor: selectedDimension === dimension.label ? '#EFF6FF' : '#F8FAFC', 
                              border: selectedDimension === dimension.label ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: selectedDimension === dimension.label ? '#DBEAFE' : '#F1F5F9',
                                borderColor: selectedDimension === dimension.label ? '#2563EB' : '#CBD5E1',
                                transform: 'translateY(-1px)'
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h6">{dimension.icon}</Typography>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: selectedDimension === dimension.label ? '#1E40AF' : '#111827' }}>
                                {dimension.label}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
                              {dimension.count}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
                              {dimension.trend}
                            </Typography>
                          </Card>
                        ))}
                      </Box>
                    </Box>

                    {/* Z-Score Deviation Analysis */}
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                        Statistical Deviation Analysis (Z-Score |Z| ≥ 3)
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                        <Box sx={{ p: 2, backgroundColor: '#FEF2F2', borderRadius: 2, border: '1px solid #FECACA' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6" sx={{ color: '#DC2626' }}>⚠️</Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#DC2626' }}>
                              Surge Detected
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#7F1D1D', mb: 1 }}>
                            Houston Medical Center - Claims Volume
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#DC2626', fontWeight: 600 }}>
                            Z-Score: +3.2 (Above 3σ threshold)
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#FEF2F2', borderRadius: 2, border: '1px solid #FECACA' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6" sx={{ color: '#DC2626' }}>⚠️</Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#DC2626' }}>
                              Dip Detected
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#7F1D1D', mb: 1 }}>
                            Exchange LOB - Revenue
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#DC2626', fontWeight: 600 }}>
                            Z-Score: -3.1 (Below 3σ threshold)
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Comparative Periods Chart */}
              <Box sx={{ mb: 4 }}>
                <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#0F172A' }}>
                      Comparative Periods Analysis
                    </Typography>
                    <Box sx={{ p: 3 }}>
                      {comparativeData ? (
                        <Box>
                          {/* Period Comparison Results */}
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                              {selectedPeriod} Comparison Results
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                              <Box sx={{ p: 2, backgroundColor: '#F0FDF4', borderRadius: 2, border: '1px solid #BBF7D0' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#166534', mb: 1 }}>
                                  Current Period
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#166534', mb: 1 }}>
                                  {(comparativeData.period.current.value / 1000).toFixed(0)}K
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600 }}>
                                  +{comparativeData.period.current.change}% change
                                </Typography>
                              </Box>
                              <Box sx={{ p: 2, backgroundColor: '#FEF2F2', borderRadius: 2, border: '1px solid #FECACA' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#DC2626', mb: 1 }}>
                                  Previous Period
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#DC2626', mb: 1 }}>
                                  {(comparativeData.period.previous.value / 1000).toFixed(0)}K
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#EF4444', fontWeight: 600 }}>
                                  +{comparativeData.period.previous.change}% change
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          {/* Dimension Drill-Down Results */}
                          {comparativeData.dimension && (
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                                {selectedDimension} Breakdown
                              </Typography>
                              <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                                {Object.entries(comparativeData.dimension).map(([key, value]: [string, any], index) => (
                                  <Box key={index} sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    py: 1.5, 
                                    borderBottom: index < Object.entries(comparativeData.dimension).length - 1 ? '1px solid #F1F5F9' : 'none' 
                                  }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                                      {key}
                                    </Typography>
                                    <Box sx={{ textAlign: 'right' }}>
                                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                                        {(value.value / 1000).toFixed(0)}K
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: value.change >= 0 ? '#059669' : '#EF4444', fontWeight: 600 }}>
                                        {value.change >= 0 ? '+' : ''}{value.change}%
                                      </Typography>
                                    </Box>
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', borderRadius: 2 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                              Select a Period and Dimension
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                              Choose comparison periods and drill-down dimensions to view detailed analysis
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Forecasting Section */}
            <Box sx={{ mt: 14 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 4, color: '#0F172A' }}>
                Forecasting
              </Typography>
              
              {/* Toggle Controls */}
              <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
                <Button
                  variant={forecastView === 'actuals' ? 'contained' : 'outlined'}
                  onClick={() => setForecastView('actuals')}
                  sx={{
                    backgroundColor: forecastView === 'actuals' ? '#0080FF' : 'transparent',
                    color: forecastView === 'actuals' ? 'white' : '#64748B',
                    borderColor: '#D1D5DB',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: forecastView === 'actuals' ? '#0066CC' : '#F3F4F6',
                      borderColor: forecastView === 'actuals' ? '#0066CC' : '#9CA3AF'
                    }
                  }}
                >
                  Med Spend/Claim, Denial Rate
                </Button>

                <Button
                  variant={forecastView === 'forecast' ? 'contained' : 'outlined'}
                  onClick={() => setForecastView('forecast')}
                      sx={{ 
                    backgroundColor: forecastView === 'forecast' ? '#0080FF' : 'transparent',
                    color: forecastView === 'forecast' ? 'white' : '#64748B',
                    borderColor: '#D1D5DB',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                          fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: forecastView === 'forecast' ? '#0066CC' : '#F3F4F6',
                      borderColor: forecastView === 'forecast' ? '#0066CC' : '#9CA3AF'
                    }
                  }}
                >
                  Med Spend/Claim, Denial Rate Forecast
                </Button>

                <Button
                  variant={forecastView === 'billing' ? 'contained' : 'outlined'}
                  onClick={() => setForecastView('billing')}
                      sx={{ 
                    backgroundColor: forecastView === 'billing' ? '#0080FF' : 'transparent',
                    color: forecastView === 'billing' ? 'white' : '#64748B',
                    borderColor: '#D1D5DB',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                          fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: forecastView === 'billing' ? '#0066CC' : '#F3F4F6',
                      borderColor: forecastView === 'billing' ? '#0066CC' : '#9CA3AF'
                    }
                  }}
                >
                  Billing Metrics
                </Button>
              </Box>

              {/* Content Based on Toggle */}
              {forecastView === 'actuals' && (
                <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                  <CardContent sx={{ p: 0 }}>
                    {/* Chart Header */}
                    <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid #E5E7EB' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F172A' }}>
                        Actuals Med Spend/Claims, Denial Rate
                      </Typography>
                    </Box>
                    
                    {/* Chart Container */}
                    <Box sx={{ p: 3, overflow: 'hidden', width: '100%' }}>
                      {createActualsChart()}
                    </Box>
                    
                    {/* Chart Footer with Insights */}
                    <Box sx={{ p: 3, pt: 2, backgroundColor: '#F8FAFC', borderTop: '1px solid #E5E7EB' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', mb: 1 }}>
                          Key Insights
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.8rem', lineHeight: 1.4, mb: 2, display: 'block' }}>
                          Med spend per claim has increased from $361 in Jan-24 to $493 in Jan-25, while denial rates have improved from 25% to 19%. 
                          The trend shows a 37% increase in medical spend but a 24% reduction in denial rates over the past year.
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem', fontStyle: 'italic' }}>
                          Data Source: Provider Analytics • Last Updated: 10/19/2025
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {forecastView === 'forecast' && (
                <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                  <CardContent sx={{ p: 0 }}>
                    {/* Chart Header with Key Metrics */}
                    <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid #E5E7EB' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'center', sm: 'center' }, 
                        gap: { xs: 2, sm: 0 }
                      }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F172A' }}>
                          Med Spend/Claim, Denial Rate Forecast
                        </Typography>
                        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap', justifyContent: 'center' }}>
                        </Box>
                      </Box>
                      
                      {/* Trend Indicators */}
                      <Box sx={{ display: 'flex', gap: 4 }}>
                      </Box>
                    </Box>
                    
                    {/* Chart Container */}
                    <Box sx={{ p: 3, overflow: 'hidden', width: '100%' }}>
                      {createForecastChart()}
                    </Box>
                    
                    {/* Chart Footer with Insights */}
                    <Box sx={{ p: 3, pt: 2, backgroundColor: '#F8FAFC', borderTop: '1px solid #E5E7EB' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', mb: 1 }}>
                          Key Insights
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.8rem', lineHeight: 1.4, mb: 2, display: 'block' }}>
                          Performance peaked in 2021 at 80, declined to 52 in 2023, and is projected to recover to 72 by 2026. 
                          The trend shows a 35% improvement from current levels over the next 2 years.
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem', fontStyle: 'italic' }}>
                          Data Source: Provider Analytics • Last Updated: 10/19/2025
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {forecastView === 'billing' && (
                <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                  <CardContent sx={{ p: 0 }}>
                    {/* Table Header */}
                    <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid #E5E7EB' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F172A' }}>
                        Billing Metrics
                      </Typography>
                    </Box>
                    
                    {/* Table Container */}
                    <Box sx={{ p: 3 }}>
                      <Table sx={{ 
                        '& .MuiTableCell-root': {
                          borderBottom: '1px solid #E5E7EB',
                          padding: '16px 20px',
                          fontSize: '0.875rem'
                        }
                      }}>
                      <TableHead>
                          <TableRow sx={{ 
                            backgroundColor: '#F8FAFC',
                            '& .MuiTableCell-root': {
                              borderBottom: '2px solid #D1D5DB',
                              fontWeight: 600,
                              color: '#0F172A',
                              fontSize: '0.875rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }
                          }}>
                            <TableCell>Metrics</TableCell>
                            <TableCell align="right">FY 2023</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {billingMetricsData.map((row, index) => (
                          <TableRow 
                            key={row.metric} 
                            sx={{ 
                              backgroundColor: index % 2 === 0 ? 'white' : '#F8FAFC',
                                '&:hover': { 
                                  backgroundColor: '#F1F5F9',
                                  '& .MuiTableCell-root': {
                                    backgroundColor: 'transparent'
                                  }
                                },
                                '&:last-child .MuiTableCell-root': {
                                  borderBottom: 'none'
                                }
                              }}
                            >
                              <TableCell sx={{ 
                                fontWeight: 500, 
                                color: '#374151',
                                fontSize: '0.875rem'
                              }}>
                                {row.metric}
                              </TableCell>
                              <TableCell align="right" sx={{ 
                                color: '#64748B',
                                fontWeight: 500,
                                fontSize: '0.875rem'
                              }}>
                              {row.metric === 'Billed to Allowed' ? `${row.fy2023}%` : formatNumber(row.fy2023)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>

            {/* Top Opportunities */}
            <Box sx={{ mt: 4 }}>
              <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#0F172A' }}>
                    Inverse trends between Med Spend/Claim vs Denial Rate % for Review
                  </Typography>
                  
                  {/* Overall Insights */}
                  <Box sx={{ 
                    mb: 3, 
                    p: 2, 
                    backgroundColor: '#F8FAFC', 
                    borderRadius: 1, 
                    border: '1px solid #E2E8F0',
                    borderLeft: '3px solid #059669'
                  }}>
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: 600, 
                      color: '#0F172A',
                      fontSize: '0.9rem',
                      mb: 1
                    }}>
                      Overall Insights
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#64748B', 
                      lineHeight: 1.5,
                      fontSize: '0.85rem',
                      mb: 1
                    }}>
                      All three entities demonstrate increasing medical spend per claim while simultaneously showing decreasing denial rates.
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#64748B', 
                      lineHeight: 1.5,
                      fontSize: '0.85rem',
                      mb: 1
                    }}>
                      This pattern may indicate improvements in coding accuracy or conversely strategic use of AI-assisted coding to avoid denials while inflating billable complexity.
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#64748B', 
                      lineHeight: 1.5,
                      fontSize: '0.85rem'
                    }}>
                      Sunrise Family Physicians shows the strongest variance (+25% spend / -20% denials) signaling potential documentation optimization or automated pre-bill coding review systems.
                    </Typography>
                  </Box>
                  
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Entity</TableCell>
                          <TableCell align="right">Claims Volume</TableCell>
                          <TableCell align="right">Med Spend</TableCell>
                          <TableCell align="right">Med Spend per claim ($)</TableCell>
                          <TableCell align="right">Denial Rate %</TableCell>
                          <TableCell align="right">% change in Med spend/claim</TableCell>
                          <TableCell align="right">% change in Denial rate</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {opportunitiesTableData.map((row, index) => (
                          <React.Fragment key={row.entity}>
                            <TableRow>
                              <TableCell>{row.entity}</TableCell>
                              <TableCell align="right">{row.claimsVolume.toLocaleString()}</TableCell>
                              <TableCell align="right">${row.medSpend.toLocaleString()}</TableCell>
                              <TableCell align="right">${row.medSpendPerClaim}</TableCell>
                              <TableCell align="right">{row.denialRate}%</TableCell>
                              <TableCell align="right">{row.medSpendChange > 0 ? '+' : ''}{row.medSpendChange}%</TableCell>
                              <TableCell align="right">{row.denialRateChange > 0 ? '+' : ''}{row.denialRateChange}%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={7} sx={{ padding: '8px 16px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.4, color: '#64748B', fontStyle: 'italic' }}>
                                  <strong>Insight:</strong> {row.insights}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
          </Box>

            {/* Action Timeline */}
            <Box sx={{ mt: 4 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#0F172A' }}>
                    Action Timeline
                  </Typography>
                  
                  {/* Horizontal Timeline */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: 1.5, 
                    overflowX: 'auto',
                    pb: 1
                  }}>
                    {/* Timeline Item 1 */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      minWidth: { xs: 120, sm: 140 },
                      position: 'relative'
                    }}>
                      <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        mb: 0.5
                      }}>
                        ✓
                      </Box>
                      <Typography variant="body2" sx={{ 
                        color: '#10B981', 
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        mb: 0.5,
                        fontSize: '0.75rem'
                      }}>
                        Completed
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        textAlign: 'center', 
                        fontWeight: 600,
                        mb: 0.5,
                        fontSize: '0.875rem'
                      }}>
                        Denial Rate Improvement
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        textAlign: 'center', 
                        color: '#64748B',
                        fontSize: '0.75rem'
                      }}>
                        Denials fell 0.9 pts despite 8% respiratory surge
                      </Typography>
                    </Box>

                    {/* Timeline Item 2 */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      minWidth: { xs: 120, sm: 140 },
                      position: 'relative'
                    }}>
                      <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#F59E0B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        mb: 0.5
                      }}>
                        !
                      </Box>
                      <Typography variant="body2" sx={{ 
                        color: '#F59E0B', 
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        mb: 0.5,
                        fontSize: '0.75rem'
                      }}>
                        In Progress
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        textAlign: 'center', 
                        fontWeight: 600,
                        mb: 0.5,
                        fontSize: '0.875rem'
                      }}>
                        Platform Optimization
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        textAlign: 'center', 
                        color: '#64748B',
                        fontSize: '0.75rem'
                      }}>
                        TOPS +4.5 pts vs Cosmos in Surgery & Family Med
                      </Typography>
                    </Box>

                    {/* Timeline Item 3 */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      minWidth: { xs: 120, sm: 140 },
                      position: 'relative'
                    }}>
                      <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#0080FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        mb: 0.5
                      }}>
                        $
                      </Box>
                      <Typography variant="body2" sx={{ 
                        color: '#0080FF', 
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        mb: 0.5,
                        fontSize: '0.75rem'
                      }}>
                        Projected
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        textAlign: 'center', 
                        fontWeight: 600,
                        mb: 0.5,
                        fontSize: '0.875rem'
                      }}>
                        Digital Transformation
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        textAlign: 'center', 
                        color: '#64748B',
                        fontSize: '0.75rem'
                      }}>
                        +10 pts digital → $6.2M/Q savings
                      </Typography>
                    </Box>

                    {/* Timeline Item 4 */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      minWidth: { xs: 120, sm: 140 },
                      position: 'relative'
                    }}>
                      <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#8B5CF6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        mb: 0.5
                      }}>
                        📋
                      </Box>
                      <Typography variant="body2" sx={{ 
                        color: '#8B5CF6', 
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        mb: 0.5,
                        fontSize: '0.75rem'
                      }}>
                        Next Steps
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        textAlign: 'center', 
                        fontWeight: 600,
                        mb: 0.5,
                        fontSize: '0.875rem'
                      }}>
                        Implementation Plan
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        textAlign: 'center', 
                        color: '#64748B',
                        fontSize: '0.75rem'
                      }}>
                        PA FAQ, tele-nurse coverage, API onboarding
                      </Typography>
                    </Box>
                  </Box>

                  {/* Leave Behind Insight - Next 2 Weeks */}
                  <Box sx={{ 
                    mt: 2, 
                    p: 1.5, 
                    backgroundColor: '#F8FAFC', 
                    borderRadius: 1, 
                    border: '1px solid #E2E8F0',
                    borderLeft: '3px solid #059669'
                  }}>
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: 600, 
                      color: '#0F172A',
                      fontSize: '0.9rem',
                      mb: 1
                    }}>
                      Next 2 Weeks: Immediate Actions
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#64748B', 
                      lineHeight: 1.5,
                      fontSize: '0.85rem'
                    }}>
                      Publish PA FAQ, run West-region tele-nurse coverage, and start API onboarding for 10 low-digital TINs.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Right Column - Key Insights */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 4, color: '#0F172A' }}>
              Key Insights
            </Typography>
            
            <Card sx={{ 
              borderRadius: 2, 
              background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', 
              color: 'white', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              minHeight: simulationExpanded ? '500px' : '300px',
              transition: 'min-height 0.3s ease-in-out'
            }}>
              <CardContent sx={{ 
                p: 4, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'flex-start',
                minHeight: simulationExpanded ? '460px' : '260px',
                transition: 'min-height 0.3s ease-in-out'
              }}>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3, lineHeight: 1.6 }}>
                  We're 7% above peer spend/claim; most variance is IP mix + platform denials in TOPS specialties. Digital is the lever that held quality under a surge.
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1, fontSize: '0.875rem' }}>
                    ±3σ Deviation Callouts
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label="High-Tech, High-Cost"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.7rem',
                        height: 20,
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                      }}
                    />
                    <Chip
                      label="Platform Sensitive"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.7rem',
                        height: 20,
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                      }}
                    />
                    <Chip
                      label="IP Outlier"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.7rem',
                        height: 20,
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                      }}
                    />
                  </Box>
                </Box>

                {/* Interactive Simulation Accordion */}
                <Accordion 
                  expanded={simulationExpanded} 
                  onChange={() => setSimulationExpanded(!simulationExpanded)}
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    color: 'white',
                    '&:before': { display: 'none' },
                    boxShadow: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px !important',
                    mb: 2,
                    transition: 'all 0.3s ease-in-out',
                    '&.Mui-expanded': {
                      margin: '0 0 16px 0',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)'
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'rgba(255, 255, 255, 0.7)', transition: 'transform 0.3s ease-in-out' }} />}
                    sx={{ 
                      minHeight: 'auto',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      '& .MuiAccordionSummary-content': { margin: '8px 0' },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      },
                      '&.Mui-expanded': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiAccordionSummary-expandIconWrapper': {
                          transform: 'rotate(180deg)'
                        }
                      }
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                      Interactive Simulation Controls
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 2, pb: 2, px: 2 }}>
                    <Box sx={{ mb: 2, mt: 1 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.75rem', mb: 1, display: 'block' }}>
                        Digital Adoption: {selectedFilters.digitalAdoption}%
                      </Typography>
                      <Slider
                        value={selectedFilters.digitalAdoption}
                        onChange={(_e, newValue) => handleFilterChange('digitalAdoption', newValue as number)}
                        aria-labelledby="digital-adoption-slider"
                        valueLabelDisplay="auto"
                        min={0}
                        max={50}
                        step={0.1}
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)',
                          '& .MuiSlider-thumb': { 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            width: 20,
                            height: 20,
                            '&:hover': { backgroundColor: 'white' }
                          },
                          '& .MuiSlider-track': { backgroundColor: 'rgba(255, 255, 255, 0.6)' },
                          '& .MuiSlider-rail': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                          '& .MuiSlider-valueLabel': { 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            color: 'white'
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.75rem', mb: 1, display: 'block' }}>
                        IP→OP Ratio: {selectedFilters.ipToOpRatio}%
                      </Typography>
                      <Slider
                        value={selectedFilters.ipToOpRatio}
                        onChange={(_e, newValue) => handleFilterChange('ipToOpRatio', newValue as number)}
                        aria-labelledby="ip-op-ratio-slider"
                        valueLabelDisplay="auto"
                        min={40}
                        max={80}
                        step={0.1}
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)',
                          '& .MuiSlider-thumb': { 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            width: 20,
                            height: 20,
                            '&:hover': { backgroundColor: 'white' }
                          },
                          '& .MuiSlider-track': { backgroundColor: 'rgba(255, 255, 255, 0.6)' },
                          '& .MuiSlider-rail': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                          '& .MuiSlider-valueLabel': { 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            color: 'white'
                          }
                        }}
                      />
                    </Box>
                    
                    {/* Dynamic Results */}
                    <Box sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      borderRadius: 1, 
                      p: 2, 
                      mt: 2 
                    }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.75rem', fontWeight: 600, mb: 1, display: 'block' }}>
                        Projected Impact
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                        • Digital Savings: ${dynamicInsights.digitalSavings}M/Q
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                        • IP→OP Savings: ${dynamicInsights.ipOpSavings}M/Q
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.7rem', fontWeight: 600, display: 'block', mb: 0.5 }}>
                        • Total Savings: ${dynamicInsights.totalSavings}M/Q
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.7rem', display: 'block' }}>
                        • Projected Denial: {dynamicInsights.projectedDenial}%
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1, fontSize: '0.875rem' }}>
                    Forecast Module
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>
                    Predict Denial% and Spend/Claim next 3 months
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Top Opportunities */}
            <Card sx={{ mb: 3, borderRadius: 2, mt: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Top Opportunities
                </Typography>
                {opportunities.map((opportunity, index) => (
                  <Box key={index} sx={{ mb: 3, p: 2, backgroundColor: '#F8FAFC', borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {opportunity.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
                      {opportunity.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>Impact</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0080FF' }}>
                          {opportunity.impact}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>Effort</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {opportunity.effort}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>Timeline</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {opportunity.timeline}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>Confidence</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {opportunity.confidence}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Main Content Section */}
        <Box sx={{ mt: 2 }}>
        </Box>

      </Container>

      {/* Filter Drawer */}
      <Drawer
        anchor="left"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            backgroundColor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Filter Options
            </Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)} sx={{ color: 'text.secondary' }}>
              <Close />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                value={selectedFilters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                label="State"
                sx={{
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                  },
                  '& .MuiSelect-select': {
                    fontSize: '0.875rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                }}
              >
                <MenuItem value="Texas">Texas</MenuItem>
                <MenuItem value="Florida">Florida</MenuItem>
                <MenuItem value="California">California</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>LOB</InputLabel>
              <Select
                value={selectedFilters.lob}
                onChange={(e) => handleFilterChange('lob', e.target.value)}
                label="LOB"
                sx={{
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                  },
                  '& .MuiSelect-select': {
                    fontSize: '0.875rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                }}
              >
                <MenuItem value="Medicare Advantage">Medicare Advantage</MenuItem>
                <MenuItem value="Commercial">Commercial</MenuItem>
                <MenuItem value="Medicaid">Medicaid</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>Plan</InputLabel>
              <Select
                value={selectedFilters.plan}
                onChange={(e) => handleFilterChange('plan', e.target.value)}
                label="Plan"
                sx={{
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                  },
                  '& .MuiSelect-select': {
                    fontSize: '0.875rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                }}
              >
                <MenuItem value="TX DSNP, Ericson Adv.">TX DSNP, Ericson Adv.</MenuItem>
                <MenuItem value="FL HMO, Sunshine">FL HMO, Sunshine</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>Entity</InputLabel>
              <Select
                value={selectedFilters.entity}
                onChange={(e) => handleFilterChange('entity', e.target.value)}
                label="Entity"
                sx={{
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                  },
                  '& .MuiSelect-select': {
                    fontSize: '0.875rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                }}
              >
                <MenuItem value="MaxWell Hospitals">MaxWell Hospitals</MenuItem>
                <MenuItem value="Gulf Coast Surgical">Gulf Coast Surgical</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>Provider TIN</InputLabel>
              <Select
                value={selectedFilters.providerTin}
                onChange={(e) => handleFilterChange('providerTin', e.target.value)}
                label="Provider TIN"
                sx={{
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                  },
                  '& .MuiSelect-select': {
                    fontSize: '0.875rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                }}
              >
                <MenuItem value="12-3456789">12-3456789</MenuItem>
                <MenuItem value="23-4567890">23-4567890</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>Specialty</InputLabel>
              <Select
                value={selectedFilters.specialty}
                onChange={(e) => handleFilterChange('specialty', e.target.value)}
                label="Specialty"
                sx={{
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                  },
                  '& .MuiSelect-select': {
                    fontSize: '0.875rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                }}
              >
                <MenuItem value="Cardiology">Cardiology</MenuItem>
                <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                <MenuItem value="Family Medicine">Family Medicine</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>Network Status</InputLabel>
              <Select
                value={selectedFilters.networkStatus}
                onChange={(e) => handleFilterChange('networkStatus', e.target.value)}
                label="Network Status"
                sx={{
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                  },
                  '& .MuiSelect-select': {
                    fontSize: '0.875rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                }}
              >
                <MenuItem value="In Network">In Network</MenuItem>
                <MenuItem value="Out of Network">Out of Network</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>Contact Type</InputLabel>
              <Select
                value={selectedFilters.contactType}
                onChange={(e) => handleFilterChange('contactType', e.target.value)}
                label="Contact Type"
                sx={{
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                  },
                  '& .MuiSelect-select': {
                    fontSize: '0.875rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                }}
              >
                <MenuItem value="FFS">FFS</MenuItem>
                <MenuItem value="Capitation">Capitation</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Start Date"
              value={selectedFilters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                borderRadius: 2,
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.light',
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.875rem',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
            
            <TextField
              fullWidth
              size="small"
              type="date"
              label="End Date"
              value={selectedFilters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                borderRadius: 2,
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.light',
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.875rem',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
            
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>Timeline</InputLabel>
              <Select
                value={selectedFilters.timeline}
                onChange={(e) => handleFilterChange('timeline', e.target.value)}
                label="Timeline"
                sx={{
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                  },
                  '& .MuiSelect-select': {
                    fontSize: '0.875rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                }}
              >
                <MenuItem value="Q1">Q1</MenuItem>
                <MenuItem value="Q2">Q2</MenuItem>
                <MenuItem value="Q3">Q3</MenuItem>
                <MenuItem value="Q4">Q4</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl component="fieldset">
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Date Type
              </Typography>
              <RadioGroup
                value={selectedFilters.dateType}
                onChange={(e) => handleFilterChange('dateType', e.target.value)}
                sx={{ gap: 0 }}
              >
                <FormControlLabel 
                  value="DOS" 
                  control={<Radio size="small" />} 
                  label="Date of Service" 
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
                <FormControlLabel 
                  value="Submit Date" 
                  control={<Radio size="small" />} 
                  label="Submit Date" 
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
                <FormControlLabel 
                  value="Paid Date" 
                  control={<Radio size="small" />} 
                  label="Paid Date" 
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
              </RadioGroup>
            </FormControl>
            
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setFilterDrawerOpen(false)}
                sx={{ 
                  textTransform: 'none',
                  mb: 1,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setFilterDrawerOpen(false)}
                sx={{ 
                  backgroundColor: 'primary.main', 
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': { 
                    backgroundColor: 'primary.dark' 
                  }
                }}
              >
                Apply Filters
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Ask Alex Offcanvas */}
      <Drawer
        anchor="right"
        open={askAlexOpen}
        onClose={() => setAskAlexOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 450,
            backgroundColor: '#F8FAFC',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ 
            p: 3, 
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: 'white'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #66B2FF 0%, #0080FF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0, 128, 255, 0.2)',
                  }}
                >
                  <AutoAwesome sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    Ask Alex
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B' }}>
                    AI Assistant
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={() => setAskAlexOpen(false)}
                sx={{ 
                  color: '#64748B',
                  backgroundColor: '#F1F5F9',
                  '&:hover': {
                    backgroundColor: '#E2E8F0',
                  }
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>

          {/* Chat Area */}
          <Box sx={{ flex: 1, p: 3, backgroundColor: '#F8FAFC', overflow: 'auto' }}>
            {/* Chat Messages */}
            <Box sx={{ mb: 3 }}>
              {chatMessages.map((message) => (
                <Box key={message.id} sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 2, 
                  mb: 2,
                  flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
                }}>
                  {message.type === 'alex' && (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #66B2FF 0%, #0080FF 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <AutoAwesome sx={{ color: 'white', fontSize: 16 }} />
                    </Box>
                  )}
                  <Box
                    sx={{
                      backgroundColor: message.type === 'user' ? '#0080FF' : 'white',
                      color: message.type === 'user' ? 'white' : '#374151',
                      borderRadius: message.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      p: 2,
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                      maxWidth: '80%',
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                      {message.message}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Quick Actions */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#0F172A' }}>
                Quick Actions:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleQuickAction('Show me provider performance')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    borderColor: '#D1D5DB',
                    color: '#374151',
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: '#F9FAFB',
                      borderColor: '#9CA3AF',
                    }
                  }}
                >
                  Show me provider performance
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleQuickAction('Analyze recent trends')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    borderColor: '#D1D5DB',
                    color: '#374151',
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: '#F9FAFB',
                      borderColor: '#9CA3AF',
                    }
                  }}
                >
                  Analyze recent trends
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleQuickAction('What are the key metrics?')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    borderColor: '#D1D5DB',
                    color: '#374151',
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: '#F9FAFB',
                      borderColor: '#9CA3AF',
                    }
                  }}
                >
                  What are the key metrics?
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleQuickAction('Generate insights report')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    borderColor: '#D1D5DB',
                    color: '#374151',
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: '#F9FAFB',
                      borderColor: '#9CA3AF',
                    }
                  }}
                >
                  Generate insights report
                </Button>
              </Box>
            </Box>

            {/* Recent Insights */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#0F172A' }}>
                Recent Insights:
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    p: 2,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TrendingDown sx={{ color: '#F59E0B', fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 600 }}>
                      VOLUME TREND
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.4 }}>
                    Claims volume for the plan reduced by 20%, but denial rate stayed at 11% and claim cost (medical spend) increased by 5%.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    p: 2,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TrendingUp sx={{ color: '#EF4444', fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 600 }}>
                      COST VARIANCE
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.4 }}>
                    Anesthesia related CPT codes had the highest related variance in med spending with respect to peer group.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    p: 2,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TrendingUp sx={{ color: '#3B82F6', fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: '#3B82F6', fontWeight: 600 }}>
                      PROCEDURE VARIANCE
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.4 }}>
                    Mammogram related CPT codes have next highest related variance in med spending with respect to peer group.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 3, backgroundColor: 'white', borderTop: '1px solid #E5E7EB' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="Ask Alex anything..."
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F9FAFB',
                    borderRadius: 3,
                    '& fieldset': {
                      borderColor: '#D1D5DB',
                    },
                    '&:hover fieldset': {
                      borderColor: '#9CA3AF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0080FF',
                    },
                  },
                }}
              />
              <IconButton
                sx={{
                  backgroundColor: '#0080FF',
                  color: 'white',
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#0066CC',
                  }
                }}
              >
                <Send sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ProviderProforma;
