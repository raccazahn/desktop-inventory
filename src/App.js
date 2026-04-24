import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EquipmentCatalog from './pages/EquipmentCatalog';
import CheckoutForm from './pages/CheckoutForm';
import Reports from './pages/Reports';
import AdminUsers from './pages/AdminUsers';
import CheckoutHistory from './pages/CheckoutHistory';
import StudentEquipment from './pages/StudentEquipment';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'technician']}>
            <div><Navbar /><Dashboard /></div>
          </ProtectedRoute>
        } />
        <Route path="/equipment" element={
          <ProtectedRoute allowedRoles={['admin', 'technician']}>
            <div><Navbar /><EquipmentCatalog /></div>
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute allowedRoles={['admin', 'technician', 'faculty']}>
            <div><Navbar /><CheckoutForm /></div>
          </ProtectedRoute>
        } />
        <Route path="/admin/checkouts" element={
          <ProtectedRoute allowedRoles={['admin', 'technician']}>
            <div><Navbar /><CheckoutHistory /></div>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <div><Navbar /><AdminUsers /></div>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={['admin', 'technician']}>
            <div><Navbar /><Reports /></div>
          </ProtectedRoute>
        } />

        {/* Student Routes */}
        <Route path="/student/equipment" element={
          <ProtectedRoute allowedRoles={['student', 'faculty', 'admin', 'technician']}>
            <div><Navbar /><StudentEquipment /></div>
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;