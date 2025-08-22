import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import "@nfid/identitykit/react/styles.css";
import { IdentityKitProvider } from '@nfid/identitykit/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IdentityKitProvider>
      <App />
    </IdentityKitProvider>
  </React.StrictMode>,
);
