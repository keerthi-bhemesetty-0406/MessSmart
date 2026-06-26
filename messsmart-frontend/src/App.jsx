import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import MealQRCode from './pages/MealQRCode';
import PastBills from './pages/PastBills';
import QRScannerView from './pages/QRScannerView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default Authentication Base Entry Route */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/qr" element={<MealQRCode />} />
          <Route path="/student/history" element={<PastBills />} />
          <Route path="/admin/scan" element={<QRScannerView />} />

          {/* Temporary placeholder catch-all redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;