import React, { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './animations.css';

// Lazy load the App component to reduce initial bundle size
const App = lazy(() => import('./App.tsx'));

// Simple loading component
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '1.5rem',
    color: '#4b5563'
  }}>
    Loading...
  </div>
);

// Create root with error handling
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  
  // Render app with Suspense for lazy loading
  root.render(
    <StrictMode>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}
