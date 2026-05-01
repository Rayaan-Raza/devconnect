import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building, MapPin, Globe, Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Companies = () => {
  const { api } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/companies');
        setCompanies(res.data.profiles || []);
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [api]);

  const filteredCompanies = companies.filter(company => 
    company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]"><div className="animate-spin text-indigo-600 mr-2 border-t-2 border-indigo-600 rounded-full w-6 h-6"></div> Loading companies...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Partner Companies</h1>
          <p className="text-lg text-slate-600">Discover top organizations hiring from our university network.</p>
        </div>

        <div className="max-w-4xl mx-auto mb-12 relative">
          <div className="flex shadow-lg rounded-2xl overflow-hidden bg-white border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <div className="flex-grow flex items-center pl-6">
              <Search className="text-slate-400 mr-3" size={20} />
              <input
                type="text"
                placeholder="Search by company name or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 text-slate-700 focus:outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Building className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No companies found</h3>
            <p className="mt-2 text-slate-500">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map((company, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={company._id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col h-full"
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200 overflow-hidden">
                      {company.logo ? (
                        <img src={company.logo} alt={company.companyName} className="w-full h-full object-cover" />
                      ) : (
                        <Building className="text-slate-400" size={32} />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {company.companyName}
                      </h2>
                      <p className="text-sm font-medium text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded-md mt-1">
                        {company.industry}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                    {company.description || 'No description provided.'}
                  </p>
                  
                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={16} className="text-slate-400" />
                      {company.location || 'Location not specified'}
                    </div>
                    {company.website && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Globe size={16} className="text-slate-400" />
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 truncate">
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <Link to={`/companies/${company.user?._id || company.user}`} className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center group-hover:bg-indigo-50 transition-colors">
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700">View Profile</span>
                  <ArrowRight size={18} className="text-slate-400 group-hover:text-indigo-600" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Companies;
