# OCC Dashboard - Provider Proforma Analytics

A comprehensive React TypeScript dashboard application for healthcare provider performance analytics and payment integrity monitoring.

## 🚀 Live Demo

**🌐 [View Live Application](https://tcscostai.github.io/coc-dashboard/)**

## 📊 Features

### Dashboard Overview
- **Payment Integrity Tile** - Navigate to detailed Provider Proforma analytics
- **Interactive KPI Tiles** - 8 key performance indicators with detailed tooltips
- **Real-time Data Visualization** - Dynamic charts and metrics

### Provider Proforma Analytics
- **Key Performance Indicators** - 8 KPI tiles with different light colors and comprehensive tooltips
- **Advanced Analytics & Performance Insights**:
  - **Claim Value Trends** - Total claim value and unique claims with calculation details
  - **Performance Scores** - Claims processing efficiency, provider satisfaction, cost management, and quality scores
  - **Top 10 Rankings** - Providers by volume, LOBs, and Sites
  - **Drill-Down Analysis** - Interactive period comparison (Monthly, QoQ, YoY, Rolling 12M)
  - **Comparative Periods Analysis** - Functional comparison with dimension breakdown
  - **Statistical Deviation Analysis** - Z-score flagging for surges and dips

### Technical Features
- **Responsive Design** - Works seamlessly across all devices
- **Interactive Tooltips** - Detailed calculation explanations for all metrics
- **Dynamic Filtering** - Real-time data updates based on user selections
- **Professional UI/UX** - Clean, corporate design with Material-UI components

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Material-UI
- **Charts**: Recharts for data visualization
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Icons**: Lucide React, Material-UI Icons
- **Backend**: Node.js, Express
- **Data**: CSV-based mock data system

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tcscostai/coc-dashboard.git
   cd coc-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Start the backend server** (optional)
   ```bash
   npm run backend
   ```

5. **Start both frontend and backend**
   ```bash
   npm run start:full
   ```

### Available Scripts

- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm run backend` - Start backend server
- `npm run start:full` - Start both frontend and backend
- `npm run deploy` - Deploy to GitHub Pages

## 📁 Project Structure

```
occ-dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React Context providers
│   ├── pages/              # Main application pages
│   ├── services/           # API services
│   ├── styles/             # Styling and themes
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── backend/                # Node.js backend server
├── data/                   # CSV data files
├── public/                 # Static assets
└── deployment/             # Production build files
```

## 🎯 Key Components

- **DashboardTile** - Individual dashboard tiles with navigation
- **ProviderProforma** - Main analytics page with KPIs and insights
- **AlexChatbot** - AI assistant for dashboard insights
- **FilterControls** - Data filtering and selection controls
- **DataContext** - Centralized data management

## 📊 Data Sources

The application uses mock CSV data files for demonstration:
- `provider_proforma_kpis.csv` - KPI metrics data
- `provider_entities.csv` - Provider entity information
- `chart_data.csv` - Chart visualization data
- `dashboard_tiles.csv` - Dashboard tile configurations

## 🚀 Deployment

### GitHub Pages
The application is automatically deployed to GitHub Pages:
- **URL**: https://tcscostai.github.io/coc-dashboard/
- **Deploy Command**: `npm run deploy`

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `build/` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is private and proprietary.

## 📞 Support

For support or questions, please contact the development team.

---

**Built with ❤️ for healthcare analytics and provider performance monitoring**