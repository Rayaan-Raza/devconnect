import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, Briefcase, User, MessageSquare, Plus, 
  CheckCircle, Clock, AlertCircle, TrendingUp, Users, Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, api } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let endpoint = '';
        if (user.role === 'admin') endpoint = '/admin/stats';
        else if (user.role === 'student') endpoint = '/students/stats';
        else if (user.role === 'company') endpoint = '/companies/stats';
        
        // Some endpoints might not exist yet, so we handle that
        if (endpoint) {
          const res = await api.get(endpoint);
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, api]);

  if (loading) return <div className="p-8 text-center"><Clock className="animate-spin inline mr-2" /> Loading dashboard...</div>;

  const renderAdminDashboard = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <div className="text-sm text-slate-500">Welcome back, {user.name}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Students" value={stats?.totalStudents || 0} color="indigo" />
        <StatCard icon={Briefcase} label="Total Companies" value={stats?.totalCompanies || 0} color="pink" />
        <StatCard icon={Rocket} label="Total Projects" value={stats?.totalProjects || 0} color="purple" />
        <StatCard icon={Clock} label="Pending Projects" value={stats?.pendingProjects || 0} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <ActionButton icon={CheckCircle} label="Pending Projects" href="/admin/pending-projects" />
            <ActionButton icon={Briefcase} label="Verify Companies" href="/admin/verify-companies" />
            <ActionButton icon={User} label="Manage Users" href="/admin/users" />
            <ActionButton icon={TrendingUp} label="Platform Stats" href="/admin/reports" />
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <p className="text-slate-500 text-sm">No recent notifications.</p>
        </div>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
        <div className="text-sm text-slate-500">Academic Year: 2025-2026</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Rocket} label="My Projects" value={0} color="indigo" />
        <StatCard icon={Eye} label="Project Views" value={0} color="purple" />
        <StatCard icon={MessageSquare} label="Messages" value={0} color="pink" />
      </div>

      <div className="card p-12 text-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <Rocket size={48} className="mx-auto mb-4 opacity-80" />
        <h2 className="text-2xl font-bold mb-2">You haven't showcased a project yet!</h2>
        <p className="mb-8 opacity-90 max-w-md mx-auto">Upload your Final Year Project now to get noticed by recruiters and feature on the homepage.</p>
        <button onClick={() => navigate('/projects/new')} className="bg-white text-indigo-600 hover:bg-slate-50 px-8 py-3 rounded-xl font-bold shadow-lg transition-all">
          Upload FYP Now
        </button>
      </div>
    </div>
  );

  const renderCompanyDashboard = () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Company Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Plus} label="Jobs Posted" value={0} color="indigo" />
        <StatCard icon={Briefcase} label="Applications" value={0} color="purple" />
        <StatCard icon={Clock} label="Pending Review" value="Yes" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4">Recruitment</h3>
          <div className="space-y-4">
             <button onClick={() => navigate('/jobs/new')} className="w-full btn-primary py-3">Post New Job Opening</button>
             <button onClick={() => navigate('/projects')} className="w-full btn-outline py-3">Browse Student Projects</button>
          </div>
        </div>
      </div>
    </div>
  );

  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {user.role === 'admin' && renderAdminDashboard()}
      {user.role === 'student' && renderStudentDashboard()}
      {user.role === 'company' && renderCompanyDashboard()}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    pink: 'bg-pink-50 text-pink-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="card p-6 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors[color]}`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, label, href }) => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(href)}
      className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
    >
      <Icon size={24} className="text-slate-400 group-hover:text-indigo-600 mb-2" />
      <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-900">{label}</span>
    </button>
  );
};

export default Dashboard;
