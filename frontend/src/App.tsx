import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CVsListPage } from './pages/CVsListPage';
import { CVDetailPage } from './pages/CVDetailPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { JDMatchPage } from './pages/JDMatchPage';
import { ChatPage } from './pages/ChatPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cvs" element={<CVsListPage />} />
          <Route path="/cvs/:cvId" element={<CVDetailPage />} />
          <Route path="/cvs/:cvId/analyse" element={<AnalysisPage />} />
          <Route path="/cvs/:cvId/match" element={<JDMatchPage />} />
          <Route path="/cvs/:cvId/chat" element={<ChatPage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
