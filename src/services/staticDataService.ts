// Static data service for GitHub Pages deployment
// This service loads data from static CSV files instead of API calls

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

class StaticDataService {
  private async loadCSVData<T>(csvPath: string, transform: (row: any) => T): Promise<T[]> {
    try {
      const response = await fetch(csvPath);
      const csvText = await response.text();
      const lines = csvText.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data: T[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim());
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          data.push(transform(row));
        }
      }
      return data;
    } catch (error) {
      console.error(`Error loading CSV from ${csvPath}:`, error);
      return [];
    }
  }

  // Categories - Static data
  async getCategories(): Promise<Category[]> {
    return [
      {
        id: 'payment-integrity',
        name: 'Payment Integrity',
        color: '#3B82F6',
        description: 'Monitor payment accuracy and fraud detection'
      },
      {
        id: 'provider-performance',
        name: 'Provider Performance',
        color: '#10B981',
        description: 'Track provider quality and efficiency metrics'
      },
      {
        id: 'cost-management',
        name: 'Cost Management',
        color: '#F59E0B',
        description: 'Analyze cost trends and optimization opportunities'
      },
      {
        id: 'quality-metrics',
        name: 'Quality Metrics',
        color: '#EF4444',
        description: 'Measure care quality and patient outcomes'
      }
    ];
  }

  // Dashboard Tiles
  async getDashboardTiles(filters?: {
    category?: string;
    sort?: 'featured' | 'alphabetical' | 'recent' | 'usage';
  }): Promise<DashboardTile[]> {
    const csvPath = process.env.PUBLIC_URL + '/data/dashboard_tiles.csv';
    return this.loadCSVData(csvPath, (row) => ({
      id: row.id || '',
      title: row.title || '',
      category: row.category || '',
      is_featured: row.is_featured === 'true',
      usage_count: parseInt(row.usage_count) || 0,
      last_accessed: row.last_accessed || null,
      insights: row.insights || ''
    }));
  }

  // Tile Metrics
  async getTileMetrics(tileId?: string): Promise<TileMetric[]> {
    const csvPath = process.env.PUBLIC_URL + '/data/tile_metrics.csv';
    return this.loadCSVData(csvPath, (row) => ({
      tile_id: row.tile_id || '',
      metric_id: row.metric_id || '',
      label: row.label || '',
      value: row.value || '',
      status: (row.status as 'positive' | 'negative' | 'neutral') || 'neutral',
      trend: (row.trend as 'up' | 'down' | 'stable') || 'stable'
    }));
  }

  // Today's Signals
  async getTodaysSignals(): Promise<TodaysSignal[]> {
    const csvPath = process.env.PUBLIC_URL + '/data/todays_signals.csv';
    return this.loadCSVData(csvPath, (row) => ({
      id: row.id || '',
      text: row.text || '',
      source: row.source || '',
      type: row.type || '',
      trend: (row.trend as 'up' | 'down' | 'stable') || 'stable',
      severity: (row.severity as 'error' | 'warning' | 'info') || 'info',
      created_at: row.created_at || new Date().toISOString()
    }));
  }

  // Provider KPIs
  async getProviderKPIs(): Promise<ProviderKPI[]> {
    const csvPath = process.env.PUBLIC_URL + '/data/provider_proforma_kpis.csv';
    return this.loadCSVData(csvPath, (row) => ({
      id: row.id || '',
      label: row.label || '',
      value: row.value || '',
      delta: row.delta || null,
      delta_type: (row.delta_type as 'positive' | 'negative' | 'neutral') || 'neutral',
      index: parseInt(row.index) || 0,
      peer_comparison: row.peer_comparison || '',
      trend: (row.trend as 'up' | 'down' | 'flat') || 'flat'
    }));
  }

  // Provider Entities
  async getProviderEntities(): Promise<ProviderEntity[]> {
    const csvPath = process.env.PUBLIC_URL + '/data/provider_entities.csv';
    return this.loadCSVData(csvPath, (row) => ({
      name: row.name || '',
      tin: row.tin || '',
      volume: parseFloat(row.volume) || 0,
      denial_rate: parseFloat(row.denial_rate) || 0,
      spend_per_claim: parseFloat(row.spend_per_claim) || 0,
      digital_maturity: (row.digital_maturity as 'Low' | 'Medium' | 'High') || 'Low',
      platform: (row.platform as 'TOPS' | 'Cosmos') || 'TOPS',
      opportunity: parseFloat(row.opportunity) || 0,
      badges: row.badges ? row.badges.split(';') : []
    }));
  }

  // Chart Data
  async getChartData(): Promise<ChartDataPoint[]> {
    const csvPath = process.env.PUBLIC_URL + '/data/chart_data.csv';
    return this.loadCSVData(csvPath, (row) => ({
      month: row.month || '',
      spend_per_claim: parseFloat(row.spend_per_claim) || 0,
      denial_rate: parseFloat(row.denial_rate) || 0,
      overturn_rate: parseFloat(row.overturn_rate) || 0,
      clean_claim_rate: parseFloat(row.clean_claim_rate) || 0,
      tat_median: parseFloat(row.tat_median) || 0,
      readmit_rate: parseFloat(row.readmit_rate) || 0,
      er_visits_per_1k: parseFloat(row.er_visits_per_1k) || 0,
      paid_billed_ratio: parseFloat(row.paid_billed_ratio) || 0,
      pmpm: parseFloat(row.pmpm) || 0,
      csat_score: parseFloat(row.csat_score) || 0
    }));
  }

  // Update tile usage (mock implementation)
  async updateTileUsage(tileId: string): Promise<void> {
    // Mock implementation - in a real app, this would update the backend
    console.log(`Updating usage for tile: ${tileId}`);
  }
}

export const staticDataService = new StaticDataService();
