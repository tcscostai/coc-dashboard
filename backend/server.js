const express = require('express');
const cors = require('cors');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Data storage
let categories = [];
let dashboardTiles = [];
let tileMetrics = [];
let todaysSignals = [];
let providerProformaKPIs = [];
let providerEntities = [];
let chartData = [];
let additionalDashboardTiles = [];
let additionalMetrics = [];

// Load CSV data
function loadCSVData() {
  const dataDir = path.join(__dirname, '../data');
  
  // Load categories
  fs.createReadStream(path.join(dataDir, 'categories.csv'))
    .pipe(csv())
    .on('data', (row) => categories.push(row))
    .on('end', () => console.log('Categories loaded:', categories.length));

  // Load dashboard tiles
  fs.createReadStream(path.join(dataDir, 'dashboard_tiles.csv'))
    .pipe(csv())
    .on('data', (row) => {
      // Convert string booleans and numbers
      row.is_featured = row.is_featured === 'true';
      row.usage_count = parseInt(row.usage_count);
      row.last_accessed = row.last_accessed ? new Date(row.last_accessed) : null;
      dashboardTiles.push(row);
    })
    .on('end', () => console.log('Dashboard tiles loaded:', dashboardTiles.length));

  // Load additional dashboard tiles
  fs.createReadStream(path.join(dataDir, 'additional_dashboard_tiles.csv'))
    .pipe(csv())
    .on('data', (row) => {
      row.is_featured = row.is_featured === 'true';
      row.usage_count = parseInt(row.usage_count);
      row.last_accessed = row.last_accessed ? new Date(row.last_accessed) : null;
      additionalDashboardTiles.push(row);
    })
    .on('end', () => console.log('Additional dashboard tiles loaded:', additionalDashboardTiles.length));

  // Load tile metrics
  fs.createReadStream(path.join(dataDir, 'tile_metrics.csv'))
    .pipe(csv())
    .on('data', (row) => tileMetrics.push(row))
    .on('end', () => console.log('Tile metrics loaded:', tileMetrics.length));

  // Load additional metrics
  fs.createReadStream(path.join(dataDir, 'additional_metrics.csv'))
    .pipe(csv())
    .on('data', (row) => additionalMetrics.push(row))
    .on('end', () => console.log('Additional metrics loaded:', additionalMetrics.length));

  // Load today's signals
  fs.createReadStream(path.join(dataDir, 'todays_signals.csv'))
    .pipe(csv())
    .on('data', (row) => {
      row.created_at = new Date(row.created_at);
      todaysSignals.push(row);
    })
    .on('end', () => console.log('Today\'s signals loaded:', todaysSignals.length));

  // Load provider proforma KPIs
  fs.createReadStream(path.join(dataDir, 'provider_proforma_kpis.csv'))
    .pipe(csv())
    .on('data', (row) => {
      row.delta = row.delta || null;
      row.index = parseInt(row.index);
      providerProformaKPIs.push(row);
    })
    .on('end', () => console.log('Provider proforma KPIs loaded:', providerProformaKPIs.length));

  // Load provider entities
  fs.createReadStream(path.join(dataDir, 'provider_entities.csv'))
    .pipe(csv())
    .on('data', (row) => {
      row.volume = parseInt(row.volume);
      row.denial_rate = parseFloat(row.denial_rate.replace('%', ''));
      row.spend_per_claim = parseFloat(row.spend_per_claim.replace('$', ''));
      row.opportunity = parseFloat(row.opportunity.replace('M', '')) * 1000000;
      row.badges = row.badges.split(',').map(b => b.trim());
      providerEntities.push(row);
    })
    .on('end', () => console.log('Provider entities loaded:', providerEntities.length));

  // Load chart data
  fs.createReadStream(path.join(dataDir, 'chart_data.csv'))
    .pipe(csv())
    .on('data', (row) => {
      // Convert numeric fields
      Object.keys(row).forEach(key => {
        if (key !== 'month' && row[key]) {
          row[key] = parseFloat(row[key]);
        }
      });
      chartData.push(row);
    })
    .on('end', () => console.log('Chart data loaded:', chartData.length));
}

// API Routes

// Get all categories
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// Get all dashboard tiles with optional filtering and sorting
app.get('/api/dashboard-tiles', (req, res) => {
  let tiles = [...dashboardTiles, ...additionalDashboardTiles];
  
  // Apply category filter
  if (req.query.category && req.query.category !== 'all') {
    tiles = tiles.filter(tile => tile.category === req.query.category);
  }
  
  // Apply sorting
  const sortBy = req.query.sort || 'featured';
  switch (sortBy) {
    case 'featured':
      tiles.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return b.usage_count - a.usage_count;
      });
      break;
    case 'alphabetical':
      tiles.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'recent':
      tiles.sort((a, b) => {
        if (!a.last_accessed && !b.last_accessed) return 0;
        if (!a.last_accessed) return 1;
        if (!b.last_accessed) return -1;
        return b.last_accessed.getTime() - a.last_accessed.getTime();
      });
      break;
    case 'usage':
      tiles.sort((a, b) => b.usage_count - a.usage_count);
      break;
  }
  
  res.json(tiles);
});

// Get metrics for a specific tile
app.get('/api/dashboard-tiles/:tileId/metrics', (req, res) => {
  const tileId = req.params.tileId;
  const metrics = [...tileMetrics, ...additionalMetrics].filter(metric => metric.tile_id === tileId);
  res.json(metrics);
});

// Get all metrics for all tiles
app.get('/api/tile-metrics', (req, res) => {
  const allMetrics = [...tileMetrics, ...additionalMetrics];
  res.json(allMetrics);
});

// Get today's signals
app.get('/api/todays-signals', (req, res) => {
  res.json(todaysSignals);
});

// Get provider proforma KPIs
app.get('/api/provider-proforma/kpis', (req, res) => {
  res.json(providerProformaKPIs);
});

// Get provider entities
app.get('/api/provider-proforma/entities', (req, res) => {
  res.json(providerEntities);
});

// Get chart data
app.get('/api/provider-proforma/chart-data', (req, res) => {
  res.json(chartData);
});

// Update tile usage (simulate user interaction)
app.post('/api/dashboard-tiles/:tileId/usage', (req, res) => {
  const tileId = req.params.tileId;
  const allTiles = [...dashboardTiles, ...additionalDashboardTiles];
  const tile = allTiles.find(t => t.id === tileId);
  
  if (tile) {
    tile.usage_count += 1;
    tile.last_accessed = new Date();
    res.json({ success: true, tile });
  } else {
    res.status(404).json({ error: 'Tile not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    dataLoaded: {
      categories: categories.length,
      dashboardTiles: dashboardTiles.length,
      additionalTiles: additionalDashboardTiles.length,
      metrics: tileMetrics.length + additionalMetrics.length,
      signals: todaysSignals.length,
      kpis: providerProformaKPIs.length,
      entities: providerEntities.length,
      chartData: chartData.length
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  loadCSVData();
});
