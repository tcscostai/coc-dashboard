# OCC Dashboard - Dynamic Data System

This project has been transformed from using static mock data to a dynamic system with a backend server that reads data from CSV files and serves it via REST API.

## Architecture

- **Frontend**: React TypeScript application with Material-UI
- **Backend**: Node.js/Express server
- **Data Source**: CSV files (simulating SQL Server data)
- **API**: RESTful endpoints for data access

## Project Structure

```
occ-dashboard/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── contexts/          # React contexts (DataContext, AlexContext)
│   ├── services/          # API service layer
│   ├── pages/             # Page components
│   └── styles/            # Styling files
├── backend/               # Backend server
│   ├── server.js          # Express server
│   └── package.json       # Backend dependencies
├── data/                  # CSV data files
│   ├── categories.csv
│   ├── dashboard_tiles.csv
│   ├── tile_metrics.csv
│   ├── todays_signals.csv
│   ├── provider_proforma_kpis.csv
│   ├── provider_entities.csv
│   ├── chart_data.csv
│   ├── additional_dashboard_tiles.csv
│   └── additional_metrics.csv
└── README.md
```

## Data Structure

### Dashboard Tiles
- Main dashboard tiles with metrics, insights, and usage tracking
- Categories for filtering (Payment Integrity, Claims Management, etc.)
- Featured tiles and usage statistics

### Metrics
- Key performance indicators for each dashboard tile
- Status indicators (positive, negative, neutral)
- Trend data (up, down, stable)

### Today's Signals
- Real-time alerts and notifications
- Different severity levels (error, warning, info)
- Source attribution and timestamps

### Provider Proforma Data
- KPI metrics with peer comparisons
- Provider entity data with performance metrics
- Chart data for historical trends

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
# From project root
npm install
```

### 3. Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on port 5001 by default.

### 4. Start the Frontend Application

```bash
# From project root
npm start
```

The frontend will start on port 3000 and automatically connect to the backend on port 5001.

## API Endpoints

### Dashboard Data
- `GET /api/categories` - Get all categories
- `GET /api/dashboard-tiles` - Get dashboard tiles (with optional filtering)
- `GET /api/dashboard-tiles/:tileId/metrics` - Get metrics for specific tile
- `GET /api/tile-metrics` - Get all tile metrics
- `POST /api/dashboard-tiles/:tileId/usage` - Update tile usage count

### Today's Signals
- `GET /api/todays-signals` - Get today's signals/alerts

### Provider Proforma
- `GET /api/provider-proforma/kpis` - Get KPI metrics
- `GET /api/provider-proforma/entities` - Get provider entities
- `GET /api/provider-proforma/chart-data` - Get chart data

### Health Check
- `GET /api/health` - Server health and data status

## Features

### Dynamic Data Loading
- All data is loaded from CSV files via the backend API
- Real-time data updates when tiles are clicked
- Loading states and error handling

### Filtering and Sorting
- Category-based filtering (All, Payment Integrity, Claims Management, etc.)
- Multiple sorting options (Featured, A-Z, Recent, Most Used)
- Real-time filter updates via API calls

### Responsive Design
- Grid and list view modes
- Mobile-responsive layout
- Material-UI components

### Data Persistence
- Usage counts are tracked and updated
- Last accessed timestamps
- Tile interaction history

## Adding New Data

### 1. Add New CSV Data
- Create or update CSV files in the `data/` directory
- Follow the existing CSV structure and column names
- Restart the backend server to load new data

### 2. Add New API Endpoints
- Modify `backend/server.js` to add new endpoints
- Update `src/services/api.ts` to add new API methods
- Update `src/contexts/DataContext.tsx` to manage new data

### 3. Add New Frontend Features
- Create new components in `src/components/`
- Add new pages in `src/pages/`
- Update the routing in `src/App.tsx`

## Environment Variables

Create a `.env` file in the project root:

```
REACT_APP_API_URL=http://localhost:5001/api
```

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
npm start  # React development server with hot reload
```

## Production Deployment

### Build Frontend
```bash
npm run build
```

### Deploy Backend
```bash
cd backend
npm start
```

## Data Customization

The CSV files can be easily modified to:
- Add new dashboard tiles
- Update metrics and KPIs
- Modify categories and filters
- Add new signals and alerts
- Update provider data

All changes will be reflected in the UI without code changes, making it easy to customize the dashboard for different use cases.

## Troubleshooting

### Backend Issues
- Check that port 5001 is available
- Verify CSV files are in the correct format
- Check console logs for data loading errors

### Frontend Issues
- Ensure backend is running on port 5001
- Check browser console for API errors
- Verify CORS settings if running on different ports

### Data Issues
- Verify CSV file format and column names
- Check that all required fields are present
- Restart backend server after CSV changes