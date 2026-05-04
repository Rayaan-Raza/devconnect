import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, User, Mail, GraduationCap, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Students = () => {
  const { api } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students');
      setStudents(res.data.profiles);
    } catch (err) {
      console.error('Error fetching students:', err);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const search = searchTerm.toLowerCase();
    const nameMatch = student.user?.name?.toLowerCase().includes(search);
    const skillsMatch = student.skills?.some(skill => skill.toLowerCase().includes(search));
    const keywordsMatch = student.keywords?.some(kw => kw.toLowerCase().includes(search));
    return nameMatch || skillsMatch || keywordsMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Talent Directory</h1>
          <p className="text-slate-500">Discover and connect with top student talent for your company.</p>
        </div>
        <div className="w-full md:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, expertise, or keywords..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin text-indigo-600 mr-2 border-t-2 border-indigo-600 rounded-full w-6 h-6"></div> Loading talent...
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
          <User size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900">No students found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div key={student._id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xl flex-shrink-0">
                  {student.user?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{student.user?.name}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                    <GraduationCap size={14} /> {student.department || 'Student'}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">
                {student.bio || 'No bio provided.'}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{student.university || 'University not specified'}</span>
                </div>
                {student.keywords && student.keywords.length > 0 && (
                  <div className="flex items-start gap-2 text-sm text-slate-500">
                    <Tag size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {student.keywords.slice(0, 3).map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-xs">{kw}</span>
                      ))}
                      {student.keywords.length > 3 && <span className="text-xs text-slate-400">+{student.keywords.length - 3}</span>}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  CGPA: {student.cgpa || 'N/A'}
                </span>
                <Link to={`/messages?to=${student.user?._id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  <Mail size={16} /> Contact
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;
