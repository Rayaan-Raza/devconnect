import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BrowseProjects from './pages/BrowseProjects';

// Placeholder Pages (To be implemented if time permits or as stubs)
const ProjectDetail = () => <div className="p-20 text-center">Project Detail Page (Coming Soon)</div>;
const Jobs = () => <div className="p-20 text-center">Job Portal (Coming Soon)</div>;
const Companies = () => <div className="p-20 text-center">Companies Directory (Coming Soon)</div>;
const Messages = () => <div className="p-20 text-center">Messaging System (Coming Soon)</div>;
const Profile = () => <div className="p-20 text-center">User Profile (Coming Soon)</div>;
const AdminUsers = () => <div className="p-20 text-center">Admin: User Management (Coming Soon)</div>;
const AdminPending = () => <div className="p-20 text-center">Admin: Pending Projects (Coming Soon)</div>;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="projects" element={<BrowseProjects />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              
              {/* Protected Routes */}
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="my-projects" element={
                <ProtectedRoute roles={['student']}>
                  <Dashboard /> {/* Placeholder */}
                </ProtectedRoute>
              } />

              <Route path="jobs" element={
                <ProtectedRoute>
                  <Jobs />
                </ProtectedRoute>
              } />

              <Route path="companies" element={<Companies />} />
              <Route path="messages" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />

              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="admin/users" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="admin/pending-projects" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminPending />
                </ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
