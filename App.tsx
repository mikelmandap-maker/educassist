
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useAppData } from './hooks/useAppData';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import SubjectsPage from './pages/SubjectsPage';
import AttendancePage from './pages/AttendancePage';
import GradesPage from './pages/GradesPage';
import CalendarPage from './pages/CalendarPage';
import CommunicationPage from './pages/CommunicationPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

const AppContent: React.FC = () => {
  const { currentUser } = useAppData();

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/communication" element={<CommunicationPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
