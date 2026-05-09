import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building, MapPin, Globe, ArrowLeft, Mail, Users, Briefcase, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const CompanyDetail = () => {
  const { id } = useParams();
  const { api, user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, jobsRes] = await Promise.all([
          api.get(`/companies/${id}`),
          api.get('/jobs?limit=100')
        ]);
        setCompany(companyRes.data.profile);
        // Filter jobs for this company
        const companyJobs = (jobsRes.data.jobs || []).filter(j => j.company?._id === id || j.company === id);
        setJobs(companyJobs);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, [id, api]);

  if (loading) return <div className="flex justify-center items-center min-h-[50vh]"><div className="animate-spin text-indigo-600 mr-2 border-t-2 border-indigo-600 rounded-full w-6 h-6"></div> Loading...</div>;
  if (!company) return <div className="text-center py-20"><h2 className="text-2xl font-bold">Company Not Found</h2><Link to="/companies" className="btn-primary mt-4 inline-block">Back</Link></div>;

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/companies" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Companies
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                {company.logo ? <img src={company.logo} alt={company.companyName} className="w-full h-full object-cover rounded-2xl" /> : <Building className="text-white" size={48} />}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold mb-1">{company.companyName}</h1>
                <p className="text-white/80 text-lg">{company.industry}</p>
                <div className="flex gap-4 mt-2 text-sm text-white/70">
                  {company.location && <span className="flex items-center gap-1"><MapPin size={14} /> {company.location}</span>}
                  {company.size && <span className="flex items-center gap-1"><Users size={14} /> {company.size} employees</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-8">
            {company.description && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">About</h3>
                <p className="text-slate-600 leading-relaxed">{company.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-indigo-50 transition-colors">
                  <Globe className="text-indigo-600" size={20} />
                  <span className="text-sm text-slate-700 truncate">{company.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
              {company.contactEmail && (
                <a href={`mailto:${company.contactEmail}`} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-indigo-50 transition-colors">
                  <Mail className="text-indigo-600" size={20} />
                  <span className="text-sm text-slate-700">{company.contactEmail}</span>
                </a>
              )}
            </div>

            {user && (
              <Link to={`/messages?userId=${company.user?._id || id}`} className="inline-flex items-center gap-2 btn-primary px-6 py-3 shadow-lg shadow-indigo-200">
                <MessageSquare size={18} /> Send Message
              </Link>
            )}

            {/* Jobs */}
            {jobs.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Open Positions ({jobs.length})</h3>
                <div className="space-y-3">
                  {jobs.map(job => (
                    <Link key={job._id} to={`/jobs/${job._id}`} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center"><Briefcase className="text-indigo-600" size={18} /></div>
                        <div>
                          <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600">{job.title}</h4>
                          <p className="text-xs text-slate-500">{job.type} · {job.location}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">{job.salary?.min?.toLocaleString()} - {job.salary?.max?.toLocaleString()} {job.salary?.currency}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyDetail;
