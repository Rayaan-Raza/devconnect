import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                D
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                DevConnect
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              The ultimate platform for university final year projects. Connecting brilliant students with top-tier companies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/projects" className="hover:text-indigo-400 transition-colors">Browse Projects</Link></li>
              <li><Link to="/companies" className="hover:text-indigo-400 transition-colors">Companies</Link></li>
              <li><Link to="/jobs" className="hover:text-indigo-400 transition-colors">Job Openings</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">How it Works</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-indigo-400 transition-colors">FAQs</Link></li>
              <li><Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition-all">
                <Globe size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition-all">
                <Mail size={18} />
              </a>
            </div>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} DevConnect University. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
