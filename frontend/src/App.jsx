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
import Jobs from './pages/Jobs';
import Companies from './pages/Companies';
import Profile from './pages/Profile';
import ProjectDetail from './pages/ProjectDetail';
import AdminUsers from './pages/AdminUsers';
import Students from './pages/Students';
import SubmitProject from './pages/SubmitProject';
import AdminPending from './pages/AdminPending';
import Messages from './pages/Messages';
import PostJob from './pages/PostJob';
import JobDetail from './pages/JobDetail';
import CompanyDetail from './pages/CompanyDetail';

// Placeholder Pages (To be implemented if time permits or as stubs)
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
              <Route path="projects/new" element={
                <ProtectedRoute roles={['student']}>
                  <SubmitProject />
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

              <Route path="jobs/new" element={
                <ProtectedRoute roles={['company']}>
                  <PostJob />
                </ProtectedRoute>
              } />

              <Route path="jobs/:id" element={
                <ProtectedRoute>
                  <JobDetail />
                </ProtectedRoute>
              } />

              <Route path="companies" element={<Companies />} />
              <Route path="companies/:id" element={<CompanyDetail />} />
              
              <Route path="students" element={
                <ProtectedRoute roles={['company', 'admin']}>
                  <Students />
                </ProtectedRoute>
              } />

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
