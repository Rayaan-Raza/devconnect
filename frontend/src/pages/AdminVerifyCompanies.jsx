import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CheckCircle, XCircle, Search, Mail, Building, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminVerifyCompanies = () => {
  const { api } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPendingCompanies();
  }, []);

  const fetchPendingCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/companies/pending');
      setCompanies(res.data.companies || []);
    } catch (err) {
      toast.error('Failed to fetch pending companies');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}`, { isVerified: true });
      toast.success('Company verified successfully');
      setCompanies(companies.filter(c => c._id !== userId));
    } catch (err) {
      toast.error('Failed to verify company');
    }
  };

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center"><Clock className="animate-spin inline mr-2" /> Loading pending verifications...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldCheck className="text-indigo-600" /> Company Verification
          </h1>
          <p className="text-slate-500 mt-1">Review and verify new company registrations.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search companies..." 
            className="input pl-10 w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(company => (
            <div key={company._id} className="card p-6 border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-indigo-600">
                  <Building size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{company.name}</h3>
                  <p className="text-xs text-slate-500">Joined {new Date(company.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail size={14} /> {company.email}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleVerify(company._id)}
                  className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-1"
                >
                  <CheckCircle size={16} /> Verify
                </button>
                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <XCircle size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-20 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">All caught up!</h3>
          <p className="text-slate-500 max-w-xs mx-auto mt-2">There are no pending company verifications at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default AdminVerifyCompanies;
