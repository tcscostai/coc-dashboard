export interface DashboardTile {
  id: string;
  title: string;
  category: string;
  metrics: TileMetric[];
  isFeatured: boolean;
  usageCount: number;
  lastAccessed?: Date;
  insights?: string;
}

export interface TileMetric {
  id: string;
  label: string;
  value?: string | number;
  status: 'positive' | 'negative' | 'neutral';
  trend?: 'up' | 'down' | 'stable';
}

export interface User {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type SortOption = 'featured' | 'alphabetical' | 'recent' | 'usage';
export type FilterOption = 'all' | 'payment-integrity' | 'claims-management' | 'clinical-quality' | 'finance-cost' | 'healthcare-economics' | 'utilization-management' | 'provider-experience' | 'member-experience' | 'digital-engagement' | 'call-center-provider' | 'call-center-member' | 'network-contracting' | 'pharmacy' | 'risk-adjustment' | 'fraud-waste-abuse' | 'compliance-regulatory' | 'data-quality' | 'hr-workforce' | 'social-reputation' | 'growth-market';
