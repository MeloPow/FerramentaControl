// src/renderer/App.tsx
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import AppRoutes from './router';

export default function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}