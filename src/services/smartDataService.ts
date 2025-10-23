// Smart data service that automatically chooses between API and static data
// based on the environment (local development vs GitHub Pages)

import { apiService } from './api';
import { staticDataService } from './staticDataService';

// Check if we're in development mode (local) or production (GitHub Pages)
const isDevelopment = process.env.NODE_ENV === 'development' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Use API service for local development, static service for production
const dataService = isDevelopment ? apiService : staticDataService;

export const smartDataService = {
  // Categories
  async getCategories() {
    return dataService.getCategories();
  },

  // Dashboard Tiles
  async getDashboardTiles(filters?: {
    category?: string;
    sort?: 'featured' | 'alphabetical' | 'recent' | 'usage';
  }) {
    return dataService.getDashboardTiles(filters);
  },

  // Tile Metrics
  async getTileMetrics(tileId?: string) {
    if (isDevelopment && 'getAllTileMetrics' in dataService) {
      return (dataService as any).getAllTileMetrics();
    }
    return dataService.getTileMetrics(tileId || '');
  },

  // Today's Signals
  async getTodaysSignals() {
    return dataService.getTodaysSignals();
  },

  // Provider KPIs
  async getProviderKPIs() {
    return dataService.getProviderKPIs();
  },

  // Provider Entities
  async getProviderEntities() {
    return dataService.getProviderEntities();
  },

  // Chart Data
  async getChartData() {
    return dataService.getChartData();
  },

  // Update tile usage
  async updateTileUsage(tileId: string) {
    return dataService.updateTileUsage(tileId);
  }
};

// Export the same interfaces for compatibility
export type {
  Category,
  DashboardTile,
  TileMetric,
  TodaysSignal,
  ProviderKPI,
  ProviderEntity,
  ChartDataPoint
} from './staticDataService';
