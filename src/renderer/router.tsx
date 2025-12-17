import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

// Pages (vamos criar já já, pode começar com placeholders)
import PainelPage from '../features/Painel/pages/PainelPage';
import FerramentasPage from '../features/Ferramenta/pages/FerramentasPage';
import ObrasPage from '../features/Obra/pages/ObraPage';
import ColaboradoresPage from '../features/Colaborador/pages/ColaboradorPage';
import MovimentacoesPage from '../features/Movimentacao/pages/MovimentacaoPage';

export default function AppRoutes() {
   return (
      <Routes>
         <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/painel" replace />} />

            <Route path="/painel" element={<PainelPage />} />
            <Route path="/ferramentas" element={<FerramentasPage />} />
            <Route path="/obras" element={<ObrasPage />} />
            <Route path="/colaboradores" element={<ColaboradoresPage />} />
            <Route path="/movimentacoes" element={<MovimentacoesPage />} />

            <Route path="*" element={<Navigate to="/painel" replace />} />
         </Route>
      </Routes>
   );
}
