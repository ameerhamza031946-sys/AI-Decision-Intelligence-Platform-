import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Search, Wifi } from 'lucide-react';
import { useState, useEffect } from 'react';
import { checkHealth } from '../../services/api';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/ai-assistant': 'AI Assistant',
  '/data-upload': 'Data Upload & Analysis',
  '/predictions': 'Predictive Analytics',
  '/recommendations': 'Recommendations',
  '/alerts': 'Community Alerts',
  '/reports': 'Reports',
  '/profile': 'My Profile',
  '/admin': 'Admin Panel',
};

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const { userProfile } = useAuth();
  const [apiOnline, setApiOnline] = useState(null);
  const title = PAGE_TITLES[pathname] || 'Platform';

  useEffect(() => {
    checkHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  return (
    <header className="h-14 px-4 flex items-center gap-4 border-b border-white/5 bg-surface-900/80 backdrop-blur-md shrink-0">
      {/* Menu toggle */}
      <button onClick={onMenuClick} className="btn-ghost p-2 lg:hidden">
        <Menu size={18} />
      </button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-sm font-display font-semibold text-slate-200">{title}</h1>
        <p className="text-[10px] text-slate-500">AI Decision Intelligence Platform</p>
      </div>

      {/* API status */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-800/60 border border-white/5">
        <Wifi size={11} className={apiOnline === true ? 'text-emerald-400' : apiOnline === false ? 'text-red-400' : 'text-slate-500'} />
        <span className="text-[10px] text-slate-400">
          {apiOnline === true ? 'API Online' : apiOnline === false ? 'API Offline' : 'Checking...'}
        </span>
      </div>

      {/* Notification bell */}
      <button className="btn-icon relative">
        <Bell size={16} />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold">
          3
        </span>
      </button>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer">
        {userProfile?.name?.[0]?.toUpperCase() || 'U'}
      </div>
    </header>
  );
}
