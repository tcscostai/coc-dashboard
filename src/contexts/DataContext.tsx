import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, Category, DashboardTile, TileMetric, TodaysSignal, ProviderKPI, ProviderEntity, ChartDataPoint } from '../services/api';

interface DataContextType {
  // Data
  categories: Category[];
  dashboardTiles: DashboardTile[];
  tileMetrics: TileMetric[];
  todaysSignals: TodaysSignal[];
  providerKPIs: ProviderKPI[];
  providerEntities: ProviderEntity[];
  chartData: ChartDataPoint[];
  
  // Loading states
  loading: {
    categories: boolean;
    dashboardTiles: boolean;
    tileMetrics: boolean;
    todaysSignals: boolean;
    providerKPIs: boolean;
    providerEntities: boolean;
    chartData: boolean;
  };
  
  // Error states
  errors: {
    categories: string | null;
    dashboardTiles: string | null;
    tileMetrics: string | null;
    todaysSignals: string | null;
    providerKPIs: string | null;
    providerEntities: string | null;
    chartData: string | null;
  };
  
  // Actions
  refreshDashboardTiles: (filters?: { category?: string; sort?: 'featured' | 'alphabetical' | 'recent' | 'usage' }) => Promise<void>;
  refreshTodaysSignals: () => Promise<void>;
  updateTileUsage: (tileId: string) => Promise<void>;
  refreshAll: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dashboardTiles, setDashboardTiles] = useState<DashboardTile[]>([]);
  const [tileMetrics, setTileMetrics] = useState<TileMetric[]>([]);
  const [todaysSignals, setTodaysSignals] = useState<TodaysSignal[]>([]);
  const [providerKPIs, setProviderKPIs] = useState<ProviderKPI[]>([]);
  const [providerEntities, setProviderEntities] = useState<ProviderEntity[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  const [loading, setLoading] = useState({
    categories: false,
    dashboardTiles: false,
    tileMetrics: false,
    todaysSignals: false,
    providerKPIs: false,
    providerEntities: false,
    chartData: false,
  });
  
  const [errors, setErrors] = useState({
    categories: null as string | null,
    dashboardTiles: null as string | null,
    tileMetrics: null as string | null,
    todaysSignals: null as string | null,
    providerKPIs: null as string | null,
    providerEntities: null as string | null,
    chartData: null as string | null,
  });

  const loadCategories = async () => {
    setLoading(prev => ({ ...prev, categories: true }));
    setErrors(prev => ({ ...prev, categories: null }));
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, categories: error instanceof Error ? error.message : 'Failed to load categories' }));
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const loadDashboardTiles = async (filters?: { category?: string; sort?: 'featured' | 'alphabetical' | 'recent' | 'usage' }) => {
    setLoading(prev => ({ ...prev, dashboardTiles: true }));
    setErrors(prev => ({ ...prev, dashboardTiles: null }));
    try {
      const data = await apiService.getDashboardTiles(filters);
      setDashboardTiles(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, dashboardTiles: error instanceof Error ? error.message : 'Failed to load dashboard tiles' }));
    } finally {
      setLoading(prev => ({ ...prev, dashboardTiles: false }));
    }
  };

  const loadTileMetrics = async () => {
    setLoading(prev => ({ ...prev, tileMetrics: true }));
    setErrors(prev => ({ ...prev, tileMetrics: null }));
    try {
      const data = await apiService.getAllTileMetrics();
      setTileMetrics(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, tileMetrics: error instanceof Error ? error.message : 'Failed to load tile metrics' }));
    } finally {
      setLoading(prev => ({ ...prev, tileMetrics: false }));
    }
  };

  const loadTodaysSignals = async () => {
    setLoading(prev => ({ ...prev, todaysSignals: true }));
    setErrors(prev => ({ ...prev, todaysSignals: null }));
    try {
      const data = await apiService.getTodaysSignals();
      setTodaysSignals(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, todaysSignals: error instanceof Error ? error.message : 'Failed to load today\'s signals' }));
    } finally {
      setLoading(prev => ({ ...prev, todaysSignals: false }));
    }
  };

  const loadProviderKPIs = async () => {
    setLoading(prev => ({ ...prev, providerKPIs: true }));
    setErrors(prev => ({ ...prev, providerKPIs: null }));
    try {
      const data = await apiService.getProviderKPIs();
      setProviderKPIs(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, providerKPIs: error instanceof Error ? error.message : 'Failed to load provider KPIs' }));
    } finally {
      setLoading(prev => ({ ...prev, providerKPIs: false }));
    }
  };

  const loadProviderEntities = async () => {
    setLoading(prev => ({ ...prev, providerEntities: true }));
    setErrors(prev => ({ ...prev, providerEntities: null }));
    try {
      const data = await apiService.getProviderEntities();
      setProviderEntities(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, providerEntities: error instanceof Error ? error.message : 'Failed to load provider entities' }));
    } finally {
      setLoading(prev => ({ ...prev, providerEntities: false }));
    }
  };

  const loadChartData = async () => {
    setLoading(prev => ({ ...prev, chartData: true }));
    setErrors(prev => ({ ...prev, chartData: null }));
    try {
      const data = await apiService.getChartData();
      setChartData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, chartData: error instanceof Error ? error.message : 'Failed to load chart data' }));
    } finally {
      setLoading(prev => ({ ...prev, chartData: false }));
    }
  };

  const refreshDashboardTiles = async (filters?: { category?: string; sort?: 'featured' | 'alphabetical' | 'recent' | 'usage' }) => {
    await loadDashboardTiles(filters);
  };

  const refreshTodaysSignals = async () => {
    await loadTodaysSignals();
  };

  const updateTileUsage = async (tileId: string) => {
    try {
      await apiService.updateTileUsage(tileId);
      // Refresh dashboard tiles to get updated usage count
      await loadDashboardTiles();
    } catch (error) {
      console.error('Failed to update tile usage:', error);
    }
  };

  const refreshAll = async () => {
    await Promise.all([
      loadCategories(),
      loadDashboardTiles(),
      loadTileMetrics(),
      loadTodaysSignals(),
      loadProviderKPIs(),
      loadProviderEntities(),
      loadChartData(),
    ]);
  };

  // Load initial data
  useEffect(() => {
    refreshAll();
  }, []);

  const value: DataContextType = {
    categories,
    dashboardTiles,
    tileMetrics,
    todaysSignals,
    providerKPIs,
    providerEntities,
    chartData,
    loading,
    errors,
    refreshDashboardTiles,
    refreshTodaysSignals,
    updateTileUsage,
    refreshAll,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
