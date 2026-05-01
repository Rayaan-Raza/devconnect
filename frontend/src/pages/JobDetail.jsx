import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building, MapPin, Clock, DollarSign, ArrowLeft, Briefcase, CheckCircle, Users, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const { api, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
        if (user && res.data.job.applicants) {
          setApplied(res.data.job.applicants.some(a => {
            const sid = a.student?._id || a.student;
            return sid?.toString() === user.id;
          }));
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchJob();
  }, [id, api, user]);

  const handleApply = async () => {
    try {
      setApplying(true);
      await api.post(`/jobs/${id}/apply`, { coverLetter: 'I am very interested in this position and believe my skills are a great fit.' });
      toast.success('Application submitted successfully!');
      setApplied(true);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to apply'); } finally { setApplying(false); }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[50vh]"><div className="animate-spin text-indigo-600 mr-2 border-t-2 border-indigo-600 rounded-full w-6 h-6"></div> Loading job...</div>;
  if (!job) return <div className="text-center py-20"><h2 className="text-2xl font-bold">Job Not Found</h2><Link to="/jobs" className="btn-primary mt-4 inline-block">Back to Jobs</Link></div>;

  const isOwner = user && (job.company?._id === user.id || job.company === user.id);

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/jobs" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Jobs
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 flex-shrink-0">
                <Briefcase className="text-slate-400" size={36} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700"><Building size={16} /> {job.company?.name || 'Unknown'}</span>
                  <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={16} /> {job.type}</span>
                </div>
              </div>
            </div>

            {job.salary && (
              <div className="bg-emerald-50 rounded-xl p-4 mb-8 flex items-center gap-2">
                <DollarSign className="text-emerald-600" size={20} />
                <span className="text-lg font-bold text-emerald-700">{job.salary.min?.toLocaleString()} - {job.salary.max?.toLocaleString()} {job.salary.currency}</span>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Job Description</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {job.requirements?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Requirements</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium">{req}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Student: Apply button */}
            {user && user.role === 'student' && (
              <div className="pt-6 border-t border-slate-100">
                {applied ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-lg">
                    <CheckCircle size={24} /> You've already applied to this job
                  </div>
                ) : (
                  <button onClick={handleApply} disabled={applying} className="btn-primary px-10 py-3 text-lg">
                    {applying ? 'Submitting...' : 'Apply Now'}
                  </button>
                )}
              </div>
            )}

            {/* Company Owner: View Applicants */}
            {isOwner && job.applicants?.length > 0 && (
              <div className="pt-6 border-t border-slate-100 mt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Users size={22} /> Applicants ({job.applicants.length})
                </h3>
                <div className="space-y-3">
                  {job.applicants.map((app, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{app.student?.name || 'Student'}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1"><Mail size={12} /> {app.student?.email || 'N/A'}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : app.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                        {app.status || 'pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isOwner && (!job.applicants || job.applicants.length === 0) && (
              <div className="pt-6 border-t border-slate-100 mt-8 text-center py-8">
                <Users size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">No applicants yet for this position.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetail;
