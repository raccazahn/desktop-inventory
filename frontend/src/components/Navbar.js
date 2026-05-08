import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, getCurrentUser, getUserRole } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const role = getUserRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get navigation links based on user role
  const getNavLinks = function() {
    if (!user) return [];
    
    if (role === 'admin') {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/equipment', label: 'Equipment', icon: '💻' },
        { path: '/checkout', label: 'Checkout', icon: '📋' },
        { path: '/admin/checkouts', label: 'Checkout List', icon: '📦' },
        { path: '/reports', label: 'Reports', icon: '📈' },
        { path: '/admin/users', label: 'Users', icon: '👥' },
      ];
    }
    
    if (role === 'technician') {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/equipment', label: 'Equipment', icon: '💻' },
        { path: '/checkout', label: 'Checkout', icon: '📋' },
        { path: '/admin/checkouts', label: 'Checkouts', icon: '📦' },
        { path: '/reports', label: 'Reports', icon: '📈' },
      ];
    }
    
    if (role === 'faculty') {
      return [
        { path: '/student/equipment', label: 'Equipment', icon: '💻' },
        { path: '/checkout', label: 'Checkout', icon: '📋' },
      ];
    }
    
    // Student
    return [
      { path: '/student/equipment', label: 'Equipment', icon: '💻' },
    ];
  };

  const handleLogout = function() {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl sticky top-0 z-50 border-b border-slate-700/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate(role === 'student' ? '/student/equipment' : '/dashboard')}
          >
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-2 rounded-xl">
              <span className="text-xl">💻</span>
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">Lab Inventory</h1>
            </div>
          </div>

          {/* Desktop Navigation - FIXED: Render link.label not the whole object */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(function(link) {
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={
                    'px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ' +
                    (location.pathname === link.path 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white')
                  }
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>  {/* ✅ Render the label text, NOT the whole object */}
                </button>
              );
            })}
          </div>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <div className="text-sm">
                  <div className="font-medium text-slate-200">{user.username || user.email}</div>
                  <div className="text-xs text-indigo-400 capitalize">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-700"
          >
            <span className="text-xl">☰</span>
          </button>
        </div>

        {/* Mobile Navigation - FIXED: Render link.label not the whole object */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-700 pt-4">
            {navLinks.map(function(link) {
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={
                    'block w-full text-left px-4 py-3 rounded-lg font-medium mt-2 ' +
                    (location.pathname === link.path 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700')
                  }
                >
                  <span className="mr-2">{link.icon}</span>
                  <span>{link.label}</span>  {/* ✅ Render the label text, NOT the whole object */}
                </button>
              );
            })}
            
            {user && (
              <button
                onClick={handleLogout}
                className="w-full mt-4 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg font-medium"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;