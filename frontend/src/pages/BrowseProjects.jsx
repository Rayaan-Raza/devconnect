import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Rocket, Eye, Heart, Calendar, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const BrowseProjects = () => {
  const { api } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    department: '',
    search: '',
  });

  const categories = [
    'Artificial Intelligence', 'Web Development', 'Mobile App', 'IoT', 
    'Blockchain', 'Cybersecurity', 'Data Science', 'Game Development', 'AR/VR'
  ];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { category, department, search } = filters;
      let url = `/projects?status=approved`;
      if (category) url += `&category=${category}`;
      if (department) url += `&department=${department}`;
      if (search) url += `&search=${search}`;
      
      const res = await api.get(url);
      setProjects(res.data.projects);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filters.category, filters.department]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Final Year Projects</h1>
          <p className="text-lg text-slate-600">Discover innovative solutions from the brightest minds.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search projects, stack, etc..." 
              className="input pl-10"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 px-4 py-2 rounded-lg">
          <Filter size={16} /> Filters:
        </div>
        
        <select 
          className="input w-auto text-sm py-1.5"
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
          className="input w-auto text-sm py-1.5"
          value={filters.department}
          onChange={(e) => setFilters({...filters, department: e.target.value})}
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Computer Engineering">Computer Engineering</option>
        </select>

        {(filters.category || filters.department || filters.search) && (
          <button 
            onClick={() => setFilters({category: '', department: '', search: ''})}
            className="text-sm text-indigo-600 font-semibold hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card h-80 animate-pulse bg-slate-100"></div>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {projects.map((project, idx) => (
              <ProjectCard key={project._id} project={project} index={idx} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <Rocket size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900">No projects found</h3>
          <p className="text-slate-500">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card-hover group flex flex-col h-full"
    >
      <div className="aspect-video bg-slate-200 relative overflow-hidden">
        {project.thumbnailUrl ? (
          <img 
            src={project.thumbnailUrl} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
             <Rocket size={48} className="opacity-20" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-full text-indigo-600 shadow-sm">
            {project.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
            {project.owner?.avatar ? <img src={project.owner.avatar} alt="" /> : <User size={14} className="m-auto text-slate-500" />}
          </div>
          <span className="text-xs font-semibold text-slate-600">{project.owner?.name || 'Anonymous'}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
          {project.tagline || project.abstract}
        </p>

        <div className="flex flex-wrap gap-1 mb-6 mt-auto">
          {project.techStack?.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md">
              {tag}
            </span>
          ))}
          {project.techStack?.length > 3 && <span className="text-[10px] text-slate-400">+{project.techStack.length - 3} more</span>}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span className="text-xs font-medium">{project.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={14} />
              <span className="text-xs font-medium">{project.likes?.length || 0}</span>
            </div>
          </div>
          <Link to={`/projects/${project._id}`} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BrowseProjects;
