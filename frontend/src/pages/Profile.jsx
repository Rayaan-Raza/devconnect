import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, GraduationCap, Building, Edit, Save, X, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const { user, api } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, [user, api, location]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const endpoint = user.role === 'student' ? '/students/me' : '/companies/me';
      const res = await api.get(endpoint);
      const p = res.data.profile;
      
      if (user.role === 'student') {
        setProfile({
          name: p.user?.name || user.name,
          email: p.user?.email || user.email,
          role: 'student',
          bio: p.bio || '',
          university: p.university || '',
          campusCity: p.campusCity || '',
          department: p.department || '',
          fatherName: p.fatherName || '',
          skills: p.skills?.join(', ') || '',
          keywords: p.keywords?.join(', ') || ''
        });
        setFormData({
          bio: p.bio || '',
          university: p.university || '',
          campusCity: p.campusCity || '',
          department: p.department || '',
          fatherName: p.fatherName || '',
          skills: p.skills?.join(', ') || '',
          keywords: p.keywords?.join(', ') || ''
        });
      } else {
        setProfile({
          name: p.companyName || user.name,
          email: p.contactEmail || user.email,
          role: 'company',
          bio: p.description || '',
          industry: p.industry || '',
          location: p.location || '',
          website: p.website || ''
        });
        setFormData({
          description: p.description || '',
          industry: p.industry || '',
          location: p.location || '',
          website: p.website || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const endpoint = user.role === 'student' ? '/students/me' : '/companies/me';
      await api.put(endpoint, formData);
      toast.success('Profile updated successfully! Refreshing to apply changes.');
      setTimeout(() => window.location.reload(), 1500); // Reload to update auth token with isProfileComplete
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div className="text-center py-20">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {!user.isProfileComplete && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-center justify-between">
          <p className="font-medium">Your profile is incomplete. Please fill out the missing details and save to unlock all platform features.</p>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold shadow hover:bg-amber-700">
              Complete Profile
            </button>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-indigo-600"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl border-4 border-white bg-slate-100 flex items-center justify-center shadow-lg">
              <User size={40} className="text-slate-400" />
            </div>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="btn-outline flex items-center gap-2 text-sm py-2"
              >
                <Edit size={16} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile(); // Reset form
                  }}
                  className="btn-ghost flex items-center gap-2 text-sm py-2"
                >
                  <X size={16} /> Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="btn-primary flex items-center gap-2 text-sm py-2"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
              <p className="text-slate-500 flex items-center gap-2 mt-1"><Mail size={16} /> {profile.email}</p>
            </div>

            <div className="border-t border-slate-100 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User size={18} className="text-indigo-600" /> {user.role === 'student' ? 'Bio' : 'Description'}
                </h3>
                {!isEditing ? (
                  <p className="text-slate-600 text-sm leading-relaxed">{profile.bio || 'No description provided.'}</p>
                ) : (
                  <textarea 
                    className="input h-32" 
                    placeholder="Write a little about yourself..."
                    value={user.role === 'student' ? formData.bio : formData.description}
                    onChange={(e) => user.role === 'student' 
                      ? setFormData({...formData, bio: e.target.value}) 
                      : setFormData({...formData, description: e.target.value})}
                  />
                )}

                {user.role === 'student' && (
                  <div className="mt-8">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Tag size={18} className="text-indigo-600" /> Profile Keywords
                    </h3>
                    {!isEditing ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.keywords ? profile.keywords.split(',').map((kw, i) => kw.trim() && (
                          <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                            {kw.trim()}
                          </span>
                        )) : <span className="text-sm text-slate-400">No keywords added.</span>}
                      </div>
                    ) : (
                      <input 
                        placeholder="Keywords (e.g. ai, frontend, research)" 
                        className="input text-sm" 
                        value={formData.keywords}
                        onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                      />
                    )}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  {user.role === 'student' ? (
                    <><GraduationCap size={18} className="text-indigo-600" /> Education & Skills</>
                  ) : (
                    <><Building size={18} className="text-indigo-600" /> Company Details</>
                  )}
                </h3>
                
                <div className="space-y-4">
                  {user.role === 'student' ? (
                    <>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        {!isEditing ? (
                          <>
                            <p className="font-semibold text-slate-900">{profile.university || 'University not specified'}</p>
                            <p className="text-sm text-slate-500 mt-1">{profile.department}</p>
                            <p className="text-xs text-slate-400 mt-1">Campus: {profile.campusCity || 'Not specified'}</p>
                            {profile.fatherName && <p className="text-xs text-slate-400 mt-1">Father: {profile.fatherName}</p>}
                          </>
                        ) : (
                          <div className="space-y-3">
                            <input 
                              placeholder="University" 
                              className="input text-sm" 
                              value={formData.university}
                              onChange={(e) => setFormData({...formData, university: e.target.value})}
                            />
                            <input 
                              placeholder="Campus City" 
                              className="input text-sm" 
                              value={formData.campusCity}
                              onChange={(e) => setFormData({...formData, campusCity: e.target.value})}
                            />
                            <input 
                              placeholder="Department" 
                              className="input text-sm" 
                              value={formData.department}
                              onChange={(e) => setFormData({...formData, department: e.target.value})}
                            />
                            <input 
                              placeholder="Father's Name" 
                              className="input text-sm" 
                              value={formData.fatherName}
                              onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                            />
                          </div>
                        )}
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-slate-900 text-sm mb-2">Technical Skills</h4>
                        {!isEditing ? (
                          <div className="flex flex-wrap gap-2">
                            {profile.skills ? profile.skills.split(',').map((skill, i) => skill.trim() && (
                              <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                                {skill.trim()}
                              </span>
                            )) : <span className="text-sm text-slate-400">No skills added.</span>}
                          </div>
                        ) : (
                          <input 
                            placeholder="e.g. React, Node.js, Python" 
                            className="input text-sm" 
                            value={formData.skills}
                            onChange={(e) => setFormData({...formData, skills: e.target.value})}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      {!isEditing ? (
                        <>
                          <p className="font-semibold text-slate-900">{profile.industry || 'Industry not specified'}</p>
                          <p className="text-sm text-slate-500 mt-1">Location: {profile.location || 'Not specified'}</p>
                          {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline mt-1 block">Visit Website</a>}
                        </>
                      ) : (
                        <div className="space-y-3">
                          <input 
                            placeholder="Industry (e.g. FinTech, Software)" 
                            className="input text-sm" 
                            value={formData.industry}
                            onChange={(e) => setFormData({...formData, industry: e.target.value})}
                          />
                          <input 
                            placeholder="Location" 
                            className="input text-sm" 
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                          />
                          <input 
                            placeholder="Website URL" 
                            className="input text-sm" 
                            value={formData.website}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
