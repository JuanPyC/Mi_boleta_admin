import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket as TicketIcon, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MobileNav: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
      <div className="glass-panel p-2 flex justify-around items-center border-white border-opacity-10 shadow-2xl">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg transition-all ${isActive ? 'text-primary bg-white bg-opacity-5' : 'text-muted'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] mt-1 font-medium">Dash</span>
        </NavLink>
        
        <NavLink 
          to="/tickets" 
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg transition-all ${isActive ? 'text-primary bg-white bg-opacity-5' : 'text-muted'}`}
        >
          <TicketIcon size={20} />
          <span className="text-[10px] mt-1 font-medium">Boletas</span>
        </NavLink>

        {isAdmin && (
          <NavLink 
            to="/admin" 
            className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg transition-all ${isActive ? 'text-primary bg-white bg-opacity-5' : 'text-muted'}`}
          >
            <Shield size={20} />
            <span className="text-[10px] mt-1 font-medium">Admin</span>
          </NavLink>
        )}
      </div>
    </div>
  );
};
