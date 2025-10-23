import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { uhgTheme } from './styles/theme';
import { AlexProvider } from './contexts/AlexContext';
import { DataProvider } from './contexts/DataContext';
import AlexChatbot from './components/AlexChatbot';
import Login from './pages/Login';
import Homepage from './pages/Homepage';
import ProviderProforma from './pages/ProviderProforma';
import './styles/index.css';

interface User {
  name: string;
  title: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<'homepage' | 'provider-proforma'>('homepage');
  const [appliedFilters, setAppliedFilters] = useState<{
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
  }>({});

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('homepage');
  };

  const handleNavigateToProviderProforma = (filters?: any) => {
    setCurrentPage('provider-proforma');
    if (filters) {
      setAppliedFilters(filters);
    }
  };

  const handleNavigateToHomepage = () => {
    setCurrentPage('homepage');
  };

  return (
    <ThemeProvider theme={uhgTheme}>
      <CssBaseline />
      <DataProvider>
        <AlexProvider>
          <div className="App">
            {!isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : currentPage === 'homepage' ? (
            <Homepage 
              user={user!} 
              onLogout={handleLogout}
              onNavigateToProviderProforma={handleNavigateToProviderProforma}
            />
          ) : (
            <ProviderProforma 
              user={user!} 
              onLogout={handleLogout}
              onNavigateToHomepage={handleNavigateToHomepage}
              appliedFilters={appliedFilters}
            />
            )}
            <AlexChatbot />
          </div>
        </AlexProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
