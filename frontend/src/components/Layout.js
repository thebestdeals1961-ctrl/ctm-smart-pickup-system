/**
 * Layout Component
 * Sidebar navigation + main content area
 */

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  FaTachometerAlt,
  FaCar,
  FaUsers,
  FaUserTie,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaPlus
} from 'react-icons/fa';

function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/rides', label: 'Rides', icon: <FaCar /> },
    { path: '/rides/new', label: 'New Ride', icon: <FaPlus /> },
    { path: '/drivers', label: 'Drivers', icon: <FaUserTie /> },
    { path: '/passengers', label: 'Passengers', icon: <FaUsers /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile menu toggle */}
      <button
        className="mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1000,
          display: 'none',
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          background: 'var(--dark)',
          color: 'white',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          transition: 'transform 0.3s',
          zIndex: 100
        }}
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #333' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
            CTM Smart Pickup
          </h2>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
            Dispatch System
          </p>
        </div>

        {/* User info */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #333' }}>
          <p style={{ fontSize: '14px', fontWeight: 500 }}>{user?.full_name}</p>
          <p style={{ fontSize: '12px', color: '#888', textTransform: 'capitalize' }}>
            {user?.role}
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '16px 0' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                color: isActive ? 'var(--primary)' : '#aaa',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                background: isActive ? 'rgba(26,115,232,0.1)' : 'transparent',
                transition: 'all 0.2s'
              })}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #333', marginTop: 'auto' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'none',
              border: 'none',
              color: '#888',
              fontSize: '14px',
              cursor: 'pointer',
              width: '100%',
              padding: '12px 0'
            }}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: '260px',
          padding: '24px',
          minHeight: '100vh'
        }}
      >
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 768px) {
          .mobile-toggle { display: block !important; }
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          main { margin-left: 0 !important; padding-top: 60px !important; }
        }
      `}</style>
    </div>
  );
}

export default Layout;
