import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Clock, BookOpen, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminPending = () => {
  const { api } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingProjects();
  }, []);

  const fetchPendingProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects?status=pending');
      setProjects(res.data.projects);
    } catch (err) {
      console.error('Error fetching pending projects:', err);
      toast.error('Failed to load pending projects');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (projectId, status) => {
    try {
      await api.put(`/projects/${projectId}/status`, { status });
      toast.success(`Project ${status} successfully`);
      fetchPendingProjects();
    } catch (err) {
      toast.error(`Failed to update project status`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Pending Projects Review</h1>
        <p className="text-slate-500">Review and approve final year projects submitted by students.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Clock className="animate-spin text-indigo-600 mr-2" /> Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-900">All caught up!</h3>
          <p className="text-slate-500 mt-2">There are no pending projects to review at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map(project => (
            <div key={project._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold uppercase">
                    Pending
                  </span>
                  <span className="text-sm font-medium text-indigo-600">{project.category}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{project.title}</h2>
                <p className="text-slate-600 mb-4">{project.abstract}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <User size={16} /> {project.owner?.name || 'Unknown'}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={16} /> {project.department}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[140px]">
                <button 
                  onClick={() => handleStatusUpdate(project._id, 'approved')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg font-medium transition-colors"
                >
                  <CheckCircle size={18} /> Approve
                </button>
                <button 
                  onClick={() => handleStatusUpdate(project._id, 'rejected')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white rounded-lg font-medium transition-colors"
                >
                  <XCircle size={18} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPending;
