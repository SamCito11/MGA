import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './shared/components/Navigation';
import { NavigationBar } from './shared/components/NavigationBar';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { ThemeProvider } from "./shared/contexts/ThemeContext";

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // If we're on the home page and not logged in, show only the content without navigation
  if (isHomePage && !user) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <main style={{ 
          flexGrow: 1, 
          padding: 0,
          width: '100%',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    );
  }
  
  // Otherwise show the full layout with navigation
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navigation />
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%'
      }}>
        <NavigationBar />
        <main style={{ 
          flexGrow: 1, 
          padding: '2rem',
          width: 'calc(100% - 320px)',
          marginLeft: '280px',
          marginRight: '200px',
          position: 'fixed',
          boxSizing: 'border-box',
          top: '64px', // Height of NavigationBar
          bottom: 0,
          overflowY: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <style>
          {`
            main::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
