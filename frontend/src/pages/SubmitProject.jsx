import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Rocket, FileText, Code, Link as LinkIcon, Users, Image as ImageIcon, Video, ArrowRight, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SubmitProject = () => {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    abstract: '',
    category: 'Web Development',
    department: 'Computer Science',
    githubRepo: '',
    demoVideoUrl: '',
    demoHtmlUrl: '',
    posterUrl: '',
    tags: '',
    collaboratorEmails: '',
  });

  const categories = [
    'Artificial Intelligence', 'Web Development', 'Mobile App', 'IoT', 
    'Blockchain', 'Cybersecurity', 'Data Science', 'Game Development', 'AR/VR', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/projects', formData);
      toast.success('Project submitted successfully! It is now pending admin review.');
      navigate('/dashboard'); // or /my-projects
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Rocket className="text-indigo-600" /> Submit Final Year Project
        </h1>
        <p className="text-slate-500 mt-2">Showcase your hard work to top companies and peers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">1. Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="label">Project Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  className="input" 
                  placeholder="e.g. AI-Powered Medical Diagnosis System"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2">
                <label className="label">Tagline / Short Description</label>
                <input 
                  type="text" 
                  name="tagline"
                  required
                  className="input" 
                  placeholder="One sentence explaining what it does"
                  value={formData.tagline}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2">
                <label className="label">Abstract / Full Description</label>
                <textarea 
                  name="abstract"
                  required
                  className="input h-32" 
                  placeholder="Detailed description of the problem, solution, and methodology..."
                  value={formData.abstract}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">Category</label>
                <select 
                  name="category"
                  required
                  className="input"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Department</label>
                <input 
                  type="text" 
                  name="department"
                  required
                  className="input" 
                  placeholder="e.g. Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2">
                <label className="label flex items-center gap-2"><Tag size={16}/> Tags (Comma separated, 5-10 recommended)</label>
                <input 
                  type="text" 
                  name="tags"
                  className="input" 
                  placeholder="e.g. computer vision, automation, healthcare, python"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">2. Links & Media</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label flex items-center gap-2"><Code size={16}/> GitHub Repository URL</label>
                <input 
                  type="url" 
                  name="githubRepo"
                  className="input" 
                  placeholder="https://github.com/..."
                  value={formData.githubRepo}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label flex items-center gap-2"><Video size={16}/> Demo Video URL</label>
                <input 
                  type="url" 
                  name="demoVideoUrl"
                  className="input" 
                  placeholder="YouTube, Vimeo, etc."
                  value={formData.demoVideoUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2">
                <label className="label flex items-center gap-2"><FileText size={16}/> Static Demo Page URL</label>
                <input 
                  type="url" 
                  name="demoHtmlUrl"
                  className="input" 
                  placeholder="Link to a hosted HTML file (e.g. GitHub Pages) for live demo"
                  value={formData.demoHtmlUrl}
                  onChange={handleChange}
                />
                <p className="text-xs text-slate-500 mt-1">Provide a single HTML page with static data so companies can instantly view the concept.</p>
              </div>

              <div className="col-span-2">
                <label className="label flex items-center gap-2"><ImageIcon size={16}/> Poster URL</label>
                <input 
                  type="url" 
                  name="posterUrl"
                  className="input" 
                  placeholder="Link to your project poster image"
                  value={formData.posterUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">3. Team</h3>
            
            <div>
              <label className="label flex items-center gap-2"><Users size={16}/> Collaborators (Comma separated emails)</label>
              <input 
                type="text" 
                name="collaboratorEmails"
                className="input" 
                placeholder="e.g. student2@domain.com, student3@domain.com"
                value={formData.collaboratorEmails}
                onChange={handleChange}
              />
              <p className="text-xs text-slate-500 mt-1">Add other registered students to this project by their email addresses.</p>
            </div>
          </div>

          <div className="pt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary px-8 flex items-center gap-2"
            >
              {loading ? 'Submitting...' : 'Submit Project'} <ArrowRight size={18} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SubmitProject;
