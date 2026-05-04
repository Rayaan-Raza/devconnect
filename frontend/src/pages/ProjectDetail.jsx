import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Tag, Calendar, Globe, BookOpen, Layers, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectDetail = () => {
  const { id } = useParams();
  const { api } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data.project);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, api]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]"><div className="animate-spin text-indigo-600 mr-2 border-t-2 border-indigo-600 rounded-full w-6 h-6"></div> Loading project...</div>;
  }

  if (!project) {
    return (
      <div className="text-center py-20 bg-slate-50 min-h-[calc(100vh-64px)]">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
        <p className="text-slate-500 mb-6">The project you're looking for doesn't exist or has been removed.</p>
        <Link to="/projects" className="btn-primary">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/projects" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Projects
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 md:p-12 border-b border-slate-100">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                {project.category}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                {project.status}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
              {project.title}
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-3xl">
              {project.tagline}
            </p>
          </div>

          {/* Image/Media Placeholder (if any) */}
          {project.images && project.images.length > 0 && (
            <div className="w-full h-64 md:h-96 bg-slate-100 overflow-hidden border-b border-slate-100">
              <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Left Column (Content) */}
            <div className="col-span-2 p-8 md:p-12 border-r border-slate-100">
              
              <section className="mb-10">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-600" /> Abstract
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {project.abstract}
                </p>
              </section>

              {project.problemStatement && (
                <section className="mb-10">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Layers size={20} className="text-indigo-600" /> Problem Statement
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {project.problemStatement}
                  </p>
                </section>
              )}

              {project.solution && (
                <section>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Globe size={20} className="text-indigo-600" /> Proposed Solution
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {project.solution}
                  </p>
                </section>
              )}
            </div>

            {/* Right Column (Sidebar) */}
            <div className="p-8 md:p-12 bg-slate-50">
              <div className="space-y-8">
                
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Tech Stack & Tags</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack?.map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium shadow-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {(project.githubRepo || project.demoVideoUrl || project.demoHtmlUrl) && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Links & Demo</h4>
                    <div className="space-y-3">
                      {project.githubRepo && (
                        <a href={project.githubRepo} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                          <Globe size={16} /> GitHub Repository
                        </a>
                      )}
                      {project.demoVideoUrl && (
                        <a href={project.demoVideoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                          <Globe size={16} /> Demo Video
                        </a>
                      )}
                      {project.demoHtmlUrl && (
                        <a href={project.demoHtmlUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline font-bold">
                          <Globe size={16} /> View Static Demo HTML
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Project Info</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm">
                      <User size={18} className="text-slate-400 mt-0.5" />
                      <div>
                        <span className="block font-medium text-slate-900">Owner</span>
                        <span className="text-slate-500">{project.owner?.name || 'Unknown'}</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <Tag size={18} className="text-slate-400 mt-0.5" />
                      <div>
                        <span className="block font-medium text-slate-900">Department</span>
                        <span className="text-slate-500">{project.department}</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <Calendar size={18} className="text-slate-400 mt-0.5" />
                      <div>
                        <span className="block font-medium text-slate-900">Academic Year</span>
                        <span className="text-slate-500">{project.academicYear || '2025-2026'}</span>
                      </div>
                    </li>
                  </ul>
                </div>

                {project.teamMembers && project.teamMembers.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Team Members</h4>
                    <ul className="space-y-3">
                      {project.teamMembers.map((member, i) => (
                        <li key={i} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-slate-700">{member.name}</span>
                          <span className="text-slate-500">{member.role || 'Member'}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.collaboratorEmails && project.collaboratorEmails.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Collaborators</h4>
                    <ul className="space-y-2">
                      {project.collaboratorEmails.map((email, i) => (
                        <li key={i} className="text-sm text-slate-600 truncate">
                          {email}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;
