const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface DashboardTile {
  id: string;
  title: string;
  category: string;
  is_featured: boolean;
  usage_count: number;
  last_accessed: string | null;
  insights: string;
}

export interface TileMetric {
  tile_id: string;
  metric_id: string;
  label: string;
  value: string;
  status: 'positive' | 'negative' | 'neutral';
  trend: 'up' | 'down' | 'stable';
}

export interface TodaysSignal {
  id: string;
  text: string;
  source: string;
  type: string;
  trend: 'up' | 'down' | 'stable';
  severity: 'error' | 'warning' | 'info';
  created_at: string;
}

export interface ProviderKPI {
  id: string;
  label: string;
  value: string;
  delta: string | null;
  delta_type: 'positive' | 'negative' | 'neutral';
  index: number;
  peer_comparison: string;
  trend: 'up' | 'down' | 'flat';
}

export interface ProviderEntity {
  name: string;
  tin: string;
  volume: number;
  denial_rate: number;
  spend_per_claim: number;
  digital_maturity: 'Low' | 'Medium' | 'High';
  platform: 'TOPS' | 'Cosmos';
  opportunity: number;
  badges: string[];
}

export interface ChartDataPoint {
  month: string;
  spend_per_claim: number;
  denial_rate: number;
  overturn_rate: number;
  clean_claim_rate: number;
  tat_median: number;
  readmit_rate: number;
  er_visits_per_1k: number;
  paid_billed_ratio: number;
  pmpm: number;
  csat_score: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  // Dashboard Tiles
  async getDashboardTiles(filters?: {
    category?: string;
    sort?: 'featured' | 'alphabetical' | 'recent' | 'usage';
  }): Promise<DashboardTile[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.sort) params.append('sort', filters.sort);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/dashboard-tiles?${queryString}` : '/dashboard-tiles';
    
    return this.request<DashboardTile[]>(endpoint);
  }

  async getTileMetrics(tileId: string): Promise<TileMetric[]> {
    return this.request<TileMetric[]>(`/dashboard-tiles/${tileId}/metrics`);
  }

  async getAllTileMetrics(): Promise<TileMetric[]> {
    return this.request<TileMetric[]>('/tile-metrics');
  }

  async updateTileUsage(tileId: string): Promise<{ success: boolean; tile: DashboardTile }> {
    return this.request<{ success: boolean; tile: DashboardTile }>(`/dashboard-tiles/${tileId}/usage`, {
      method: 'POST',
    });
  }

  // Today's Signals
  async getTodaysSignals(): Promise<TodaysSignal[]> {
    return this.request<TodaysSignal[]>('/todays-signals');
  }

  // Provider Proforma
  async getProviderKPIs(): Promise<ProviderKPI[]> {
    return this.request<ProviderKPI[]>('/provider-proforma/kpis');
  }

  async getProviderEntities(): Promise<ProviderEntity[]> {
    return this.request<ProviderEntity[]>('/provider-proforma/entities');
  }

  async getChartData(): Promise<ChartDataPoint[]> {
    return this.request<ChartDataPoint[]>('/provider-proforma/chart-data');
  }

  // Health check
  async getHealthStatus(): Promise<{
    status: string;
    timestamp: string;
    dataLoaded: Record<string, number>;
  }> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
