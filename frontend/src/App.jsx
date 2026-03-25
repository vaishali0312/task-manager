import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register'; 
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-base-100 dark:bg-slate-900">
      <Toaster />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
<Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <div className="hero min-h-64 bg-gradient-to-r from-blue-500 to-emerald-500">
                  <div className="hero-overlay bg-opacity-60"></div>
                  <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-md">
                      <img src="https://cdn-icons-png.flaticon.com/512/10590/10590836.png" alt="Dashboard" className="w-32 h-32 mx-auto mb-6 shadow-2xl" />
                      <h1 className="mb-5 text-5xl font-bold">Task Manager Pro</h1>
                      <p className="mb-5 opacity-90">Full featured task management with analytics</p>
                    </div>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route path="/dashboard/tasks" element={
          <ProtectedRoute>
            <Layout>
              <Tasks />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/analytics" element={
          <ProtectedRoute>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        } /> 
        <Route path="/" element={<Navigate to="/register" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

