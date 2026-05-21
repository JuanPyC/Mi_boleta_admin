import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Ticket as TicketIcon, LayoutDashboard, Shield } from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const navItemClass = (path: string) => `
    flex items-center gap-2 p-2 rounded transition
    ${location.pathname === path ? 'text-primary bg-white bg-opacity-5' : 'text-muted hover:text-white hover:bg-white hover:bg-opacity-10'}
  `;

  return (
    <nav className="glass-panel mx-4 mt-4 mb-6 p-4 flex justify-between items-center sticky top-4 z-40">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-primary transition" style={{ textShadow: '0 0 10px rgba(139,92,246,0.5)' }}>
          <TicketIcon className="text-primary" />
          Mi Boleta
        </Link>

        <div className="hidden md:flex items-center gap-2 border-l pl-6" style={{ borderColor: 'var(--border-color)' }}>
          <Link to="/" className={navItemClass('/')}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link to="/tickets" className={navItemClass('/tickets')}>
            <TicketIcon size={18} />
            Mis Boletas
          </Link>
          {isAdmin && (
            <Link to="/admin" className={navItemClass('/admin')}>
              <Shield size={18} />
              Admin
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-sm">
          Hola, <span className="text-primary font-semibold">{user?.name}</span>
        </div>
        <Button variant="outline" onClick={handleLogout} className="!p-2">
          <LogOut size={18} />
          <span className="hidden sm:inline ml-2">Salir</span>
        </Button>
      </div>
    </nav>
  );
};
