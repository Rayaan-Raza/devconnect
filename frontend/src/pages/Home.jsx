import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Briefcase, ShieldCheck, Users, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const stats = [
    { label: 'Total Projects', value: '500+', icon: Rocket },
    { label: 'Partner Companies', value: '50+', icon: Briefcase },
    { label: 'Students Placed', value: '200+', icon: Users },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-pink-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full">
                The Future of FYP Portfolios
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
                Showcase Your <span className="text-indigo-600">Innovation</span> to the World
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                DevConnect is where final year students transform their boring posters into interactive digital showcases. Get noticed by top companies and kickstart your career.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="btn-primary text-lg px-8 py-3 w-full sm:w-auto">
                  Get Started for Free
                </Link>
                <Link to="/projects" className="btn-outline text-lg px-8 py-3 w-full sm:w-auto">
                  Browse Projects
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Featured Cards / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="card p-8 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                  <stat.icon size={32} />
                </div>
                <h3 className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</h3>
                <p className="text-slate-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Built Specifically for <span className="text-pink-600">University Excellence</span></h2>
              <p className="text-lg text-slate-600 mb-8">
                We understand the struggle of presenting complex engineering projects. DevConnect provides all the tools you need to stand out.
              </p>
              
              <ul className="space-y-6">
                {[
                  { title: 'Rich Media Support', desc: 'Upload videos, posters, and multiple screenshots to give a complete picture of your work.' },
                  { title: 'Industry Connections', desc: 'Verified companies can directly message you and offer job opportunities.' },
                  { title: 'Verified Profiles', desc: 'University-only email registration ensures only legitimate students are on the platform.' },
                  { title: 'Admin Oversight', desc: 'Placement officers curate and feature the best projects for maximum visibility.' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="aspect-video bg-indigo-600 rounded-3xl overflow-hidden shadow-2xl relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
                  alt="Students working" 
                  className="w-full h-full object-cover mix-blend-overlay opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-xl cursor-pointer hover:scale-110 transition-transform">
                    <Rocket size={32} />
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-pink-100 rounded-full -z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-100 rounded-full -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Showcase Your Project?</h2>
          <p className="text-xl text-indigo-100 mb-10">
            Join hundreds of students who have already launched their careers through DevConnect.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-4 rounded-xl font-bold text-lg shadow-xl transition-all w-full sm:w-auto">
              Create Student Account
            </Link>
            <Link to="/register?role=company" className="bg-indigo-700 text-white hover:bg-indigo-800 border border-indigo-500 px-10 py-4 rounded-xl font-bold text-lg transition-all w-full sm:w-auto">
              Join as Company
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
