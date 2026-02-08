import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Home from './pages/Home';
import Discover from './pages/Discover';
import GameDetail from './pages/GameDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Avatar from './pages/Avatar';
import Friends from './pages/Friends';
import Settings from './pages/Settings';
import Create from './pages/Create';
import Robux from './pages/Robux';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

// Layout wrapper for authenticated pages
function AuthenticatedLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <AuthenticatedLayout><Home /></AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/discover" element={
        <ProtectedRoute>
          <AuthenticatedLayout><Discover /></AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/games/:gameId" element={
        <ProtectedRoute>
          <AuthenticatedLayout><GameDetail /></AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile/:userId?" element={
        <ProtectedRoute>
          <AuthenticatedLayout><Profile /></AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/avatar" element={
        <ProtectedRoute>
          <AuthenticatedLayout><Avatar /></AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/friends" element={
        <ProtectedRoute>
          <AuthenticatedLayout><Friends /></AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path ="/settings" element={<Settings />} />
      <Route path ="/create" element={<Create />} />
      <Route path ="/robux" element={<Robux />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
