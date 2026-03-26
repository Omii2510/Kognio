import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', color: 'white', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ margin: 0, fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: '700', letterSpacing: '0.5px' }}>🤖 AI Smart Inventory</h2>
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ 
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px'
          }}
          className="mobile-menu-btn"
        >
          ☰
        </button>

        {/* Desktop menu */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }} className="desktop-menu">
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>Dashboard</Link>
          <Link to="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>Products</Link>
          <Link to="/stock" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>Stock</Link>
          <Link to="/voice" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>Voice</Link>
          <Link to="/chat" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>💬 Chat</Link>
          <Link to="/reports" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>Reports</Link>
          <Link to="/report-generator" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>📊 AI Report</Link>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ 
          display: 'none',
          flexDirection: 'column',
          gap: '10px',
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '1px solid #555'
        }} className="mobile-menu-items">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', padding: '10px', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>Dashboard</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', padding: '10px', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>Products</Link>
          <Link to="/stock" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', padding: '10px', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>Stock</Link>
          <Link to="/voice" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', padding: '10px', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>Voice</Link>
          <Link to="/chat" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', padding: '10px', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>💬 Chat</Link>
          <Link to="/reports" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', padding: '10px', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>Reports</Link>
          <Link to="/report-generator" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', padding: '10px', borderRadius: '8px', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>📊 AI Report</Link>
        </div>
      )}

      <style>{
        `@media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-items {
            display: flex !important;
          }
        }`
      }</style>
    </nav>
  );
}
