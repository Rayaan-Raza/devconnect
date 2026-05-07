import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Rocket, Briefcase, User, MessageSquare, Plus, 
  CheckCircle, Clock, AlertCircle, TrendingUp, Users, Eye, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, api } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [myProjects, setMyProjects] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === 'admin') {
          const res = await api.get('/admin/stats');
          setStats(res.data.stats || {});
        } else if (user.role === 'student') {
          const [projRes, msgRes] = await Promise.all([
            api.get('/projects/mine').catch(() => ({ data: { projects: [] } })),
            api.get('/messages/conversations').catch(() => ({ data: { conversations: [] } }))
          ]);
          setMyProjects(projRes.data.projects || []);
          setStats({
            myProjects: (projRes.data.projects || []).length,
            projectViews: (projRes.data.projects || []).reduce((sum, p) => sum + (p.views || 0), 0),
            messages: (msgRes.data.conversations || []).length
          });
        } else if (user.role === 'company') {
          const [jobRes, msgRes] = await Promise.all([
            api.get('/jobs?limit=100').catch(() => ({ data: { jobs: [] } })),
            api.get('/messages/conversations').catch(() => ({ data: { conversations: [] } }))
          ]);
          const allJobs = (jobRes.data.jobs || []).filter(j => j.company?._id === user.id || j.company === user.id);
          setMyJobs(allJobs);
          const totalApplicants = allJobs.reduce((sum, j) => sum + (j.applicants?.length || 0), 0);
          setStats({
            jobsPosted: allJobs.length,
            applications: totalApplicants,
            messages: (msgRes.data.conversations || []).length
          });
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
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
            <ActionButton icon={User} label="Manage Users" href="/admin/users" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
        <div className="text-sm text-slate-500">Welcome, {user.name}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Rocket} label="My Projects" value={stats.myProjects || 0} color="indigo" />
        <StatCard icon={Eye} label="Total Views" value={stats.projectViews || 0} color="purple" />
        <StatCard icon={MessageSquare} label="Conversations" value={stats.messages || 0} color="pink" />
      </div>

      {myProjects.length > 0 ? (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">My Projects</h3>
            <button onClick={() => navigate('/projects/new')} className="btn-primary px-4 py-2 text-sm flex items-center gap-1"><Plus size={16}/> Add New</button>
          </div>
          <div className="space-y-3">
            {myProjects.map(p => (
              <Link key={p._id} to={`/projects/${p._id}`} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-900">{p.title}</h4>
                  <p className="text-sm text-slate-500">{p.tagline}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : p.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{p.status}</span>
                  <ArrowRight size={16} className="text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <Rocket size={48} className="mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">Upload your first FYP!</h2>
          <p className="mb-8 opacity-90 max-w-md mx-auto">Showcase your Final Year Project to get noticed by recruiters.</p>
          <button onClick={() => navigate('/projects/new')} className="bg-white text-indigo-600 hover:bg-slate-50 px-8 py-3 rounded-xl font-bold shadow-lg transition-all">Upload FYP Now</button>
        </div>
      )}
    </div>
  );

  const renderCompanyDashboard = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Company Portal</h1>
        <div className="text-sm text-slate-500">Welcome, {user.name}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Briefcase} label="Jobs Posted" value={stats.jobsPosted || 0} color="indigo" />
        <StatCard icon={Users} label="Total Applicants" value={stats.applications || 0} color="purple" />
        <StatCard icon={MessageSquare} label="Conversations" value={stats.messages || 0} color="pink" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate('/jobs/new')} className="w-full btn-primary py-3 flex items-center justify-center gap-2"><Plus size={18}/> Post New Job</button>
            <button onClick={() => navigate('/students')} className="w-full btn-outline py-3 flex items-center justify-center gap-2"><Users size={18}/> Browse Talent</button>
            <button onClick={() => navigate('/projects')} className="w-full btn-outline py-3 flex items-center justify-center gap-2"><Rocket size={18}/> Browse FYPs</button>
          </div>
        </div>

        {myJobs.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4">My Job Listings</h3>
            <div className="space-y-3">
              {myJobs.map(j => (
                <Link key={j._id} to={`/jobs/${j._id}`} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{j.title}</h4>
                    <p className="text-xs text-slate-500">{j.type} · {j.location}</p>
                  </div>
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold">{j.applicants?.length || 0} applicants</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {user.role === 'admin' && renderAdminDashboard()}
      {user.role === 'student' && renderStudentDashboard()}
      {user.role === 'company' && renderCompanyDashboard()}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = { indigo: 'bg-indigo-50 text-indigo-600', pink: 'bg-pink-50 text-pink-600', purple: 'bg-purple-50 text-purple-600', orange: 'bg-orange-50 text-orange-600' };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors[color]}`}><Icon size={28} /></div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </motion.div>
  );
};

const ActionButton = ({ icon: Icon, label, href }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(href)} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group">
      <Icon size={24} className="text-slate-400 group-hover:text-indigo-600 mb-2" />
      <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-900">{label}</span>
    </button>
  );
};

export default Dashboard;
