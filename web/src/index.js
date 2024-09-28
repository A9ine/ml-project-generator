import React from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import NavRoutes from './components/app/NavRoutes';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <NavRoutes />
  </React.StrictMode>
);