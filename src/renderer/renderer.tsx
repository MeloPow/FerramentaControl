// src/renderer.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../shared/styles/tailwind.css';
import '../shared/styles/globals.css';

const container = document.getElementById('app');

if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Elemento #app não encontrado no DOM.");
}

