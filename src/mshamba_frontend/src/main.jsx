import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FarmProvider } from './context/FarmContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FarmProvider>
        <App />
      </FarmProvider>
    </AuthProvider>
  </StrictMode>
);