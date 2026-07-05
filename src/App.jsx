import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import BookToken from './pages/BookToken';
import QueueManagement from './pages/QueueManagement';
import QRScanner from './pages/QRScanner';
import Settings from './pages/Settings';
import QueueHistory from './pages/QueueHistory';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import { Toaster } from 'react-hot-toast';
import { Ticket, Menu } from 'lucide-react';

// Wrapper layout for Dashboards
function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto max-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  // Unified Dashboard router depending on user role
  const renderDashboardByRole = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'staff':
        return <StaffDashboard />;
      case 'customer':
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            user ? (
              <>
                <Navbar />
                <LandingPage />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* User Dashboard Router */}
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <DashboardLayout>
                {renderDashboardByRole()}
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Auth routes */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
        


        {/* Customer Only Routes */}
        <Route 
          path="/book" 
          element={
            user && user.role === 'customer' ? (
              <DashboardLayout>
                <BookToken />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/my-queue" 
          element={
            user && user.role === 'customer' ? (
              <DashboardLayout>
                <CustomerDashboard />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/history" 
          element={
            user && user.role === 'customer' ? (
              <DashboardLayout>
                <QueueHistory />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Shared / Role restricted routes */}
        <Route 
          path="/manage" 
          element={
            user && (user.role === 'admin' || user.role === 'staff') ? (
              <DashboardLayout>
                <QueueManagement />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/scanner" 
          element={
            user && user.role === 'admin' ? (
              <DashboardLayout>
                <QRScanner />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/settings" 
          element={
            user && user.role === 'admin' ? (
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/profile" 
          element={
            user ? (
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}


