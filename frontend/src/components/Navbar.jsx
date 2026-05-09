import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, Rocket, LayoutDashboard, Briefcase, MessageSquare, ShieldCheck, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = {
    guest: [
      { name: 'Home', href: '/' },
      { name: 'Browse Projects', href: '/projects' },
      { name: 'About', href: '/about' },
    ],
    student: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'My Projects', href: '/my-projects', icon: Rocket },
      { name: 'Companies', href: '/companies', icon: Briefcase },
      { name: 'Jobs', href: '/jobs', icon: Briefcase },
      { name: 'Messages', href: '/messages', icon: MessageSquare },
    ],
    company: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Post Job', href: '/jobs/new', icon: PlusCircle },
      { name: 'Students', href: '/students', icon: User },
      { name: 'Browse Projects', href: '/projects', icon: Rocket },
      { name: 'Messages', href: '/messages', icon: MessageSquare },
    ],
    admin: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Users', href: '/admin/users', icon: User },
      { name: 'Review Projects', href: '/admin/pending-projects', icon: Rocket },
      { name: 'Verify Companies', href: '/admin/verify-companies', icon: ShieldCheck },
    ],
  };

  const currentLinks = user ? navLinks[user.role] : navLinks.guest;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
                D
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 hidden lg:block">
                Dev<span className="text-indigo-600">Connect</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {currentLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-slate-600 hover:text-indigo-600 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                <div className="text-right hidden lg:block mr-2">
                  <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                  title="Profile"
                >
                  <User size={20} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm px-5">Join Now</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50"
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600"
                >
                  Sign Up
                </Link>
              </>
            )}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
