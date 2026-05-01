import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PostJob = () => {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    type: 'full-time',
    location: '',
    salary: { min: '', max: '', currency: 'PKR' },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('salary.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({ ...prev, salary: { ...prev.salary, [key]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/jobs', {
        ...formData,
        salary: {
          min: Number(formData.salary.min),
          max: Number(formData.salary.max),
          currency: formData.salary.currency
        }
      });
      toast.success('Job posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Briefcase className="text-indigo-600" /> Post a Job Opening
        </h1>
        <p className="text-slate-500 mt-2">Find the perfect candidate from our talent pool.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="label">Job Title</label>
            <input type="text" name="title" required className="input" placeholder="e.g. Frontend Developer" value={formData.title} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" required className="input h-32" placeholder="Describe the role, responsibilities, and what you're looking for..." value={formData.description} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Requirements (Comma separated)</label>
            <input type="text" name="requirements" className="input" placeholder="e.g. React, Node.js, 2 years experience" value={formData.requirements} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Job Type</label>
              <select name="type" className="input" value={formData.type} onChange={handleChange}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <input type="text" name="location" className="input" placeholder="e.g. Lahore or Remote" value={formData.location} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">Min Salary</label>
              <input type="number" name="salary.min" className="input" placeholder="40000" value={formData.salary.min} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Max Salary</label>
              <input type="number" name="salary.max" className="input" placeholder="120000" value={formData.salary.max} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Currency</label>
              <select name="salary.currency" className="input" value={formData.salary.currency} onChange={handleChange}>
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={loading} className="btn-primary px-8 flex items-center gap-2">
              {loading ? 'Posting...' : 'Post Job'} <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
