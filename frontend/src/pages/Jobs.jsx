import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, Building, Search, Filter, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Jobs = () => {
  const { api } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        setJobs(res.data.jobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [api]);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]"><Clock className="animate-spin text-indigo-600 mr-2" /> Loading jobs...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Discover Your Next Opportunity</h1>
          <p className="text-lg text-slate-600">Browse open positions from top tech companies looking for fresh graduates.</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-12 relative">
          <div className="flex shadow-lg rounded-2xl overflow-hidden bg-white border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <div className="flex-grow flex items-center pl-6">
              <Search className="text-slate-400 mr-3" size={20} />
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 text-slate-700 focus:outline-none bg-transparent"
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 font-semibold transition-colors flex items-center">
              Search
            </button>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No jobs found</h3>
            <p className="mt-2 text-slate-500">We couldn't find any jobs matching your search.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={job._id} 
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200 overflow-hidden">
                    {job.company?.logo ? (
                      <img src={job.company.logo} alt={job.company.companyName} className="w-full h-full object-cover" />
                    ) : (
                      <Building className="text-slate-400" size={32} />
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                      {job.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-3">
                      <span className="flex items-center gap-1 font-medium text-slate-700"><Building size={16} /> {job.company?.name || 'Unknown Company'}</span>
                      <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock size={16} /> {job.type}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements?.slice(0, 3).map((req, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                          {req}
                        </span>
                      ))}
                      {job.requirements?.length > 3 && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                          +{job.requirements.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end justify-center">
                  <div className="text-lg font-bold text-emerald-600 mb-2 flex items-center gap-1">
                    <DollarSign size={18} />
                    {job.salary?.min} - {job.salary?.max} {job.salary?.currency}
                  </div>
                  <Link to={`/jobs/${job._id}`} className="px-6 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl font-semibold transition-colors w-full md:w-auto text-center">
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Jobs;
