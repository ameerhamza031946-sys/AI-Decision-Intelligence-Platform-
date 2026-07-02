import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Wifi, User, Settings, LogOut, ChevronRight, Shield, BarChart2, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { checkHealth } from '../../services/api';

const PAGE_TITLES = {
  '/dashboard':       'Dashboard',
  '/ai-assistant':    'AI Assistant',
  '/data-upload':     'Data Upload & Analysis',
  '/predictions':     'Predictive Analytics',
  '/recommendations': 'Recommendations',
  '/alerts':          'Community Alerts',
  '/reports':         'Reports',
  '/profile':         'My Profile',
  '/admin':           'Admin Panel',
  '/ai-agent':        'Autonomous Decision Agent',
};

// Mock notifications data
const NOTIFICATIONS = [
  { id: 1, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', title: 'Critical Air Quality Alert', desc: 'Shahdara PM2.5 exceeded 100 μg/m³', time: '2 min ago', unread: true },
  { id: 2, icon: BarChart2,     color: 'text-yellow-400', bg: 'bg-yellow-500/10', title: 'Hospital Capacity Warning', desc: 'Abbasi Shaheed at 94% bed occupancy', time: '18 min ago', unread: true },
  { id: 3, icon: Shield,        color: 'text-blue-400',   bg: 'bg-blue-500/10',   title: 'Safety Score Updated', desc: 'Data Gunj risk score increased to 78', time: '1 hr ago', unread: true },
];

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();

  const [apiOnline,       setApiOnline]       = useState(null);
  const [showBell,        setShowBell]        = useState(false);
  const [showProfile,     setShowProfile]     = useState(false);
  const [notifications,   setNotifications]   = useState(NOTIFICATIONS);

  const bellRef    = useRef(null);
  const profileRef = useRef(null);

  const title   = PAGE_TITLES[pathname] || 'Platform';
  const unread  = notifications.filter(n => n.unread).length;
  const initial = userProfile?.name?.[0]?.toUpperCase() || 'G';

  // Health check
  useEffect(() => {
    checkHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (bellRef.current    && !bellRef.current.contains(e.target))    setShowBell(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, unread: false })));

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  return (
    <header className="h-14 px-4 flex items-center gap-3 border-b border-white/5 bg-surface-900/80 backdrop-blur-md shrink-0 relative z-50">
      {/* Mobile menu toggle */}
      <button onClick={onMenuClick} className="btn-ghost p-2 lg:hidden">
        <Menu size={18} />
      </button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-sm font-display font-semibold text-slate-200">{title}</h1>
        <p className="text-[10px] text-slate-500">AI Decision Intelligence Platform</p>
      </div>

      {/* API status badge */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-800/60 border border-white/5">
        <Wifi size={11} className={apiOnline === true ? 'text-emerald-400' : apiOnline === false ? 'text-red-400' : 'text-slate-500'} />
        <span className="text-[10px] text-slate-400">
          {apiOnline === true ? 'API Online' : apiOnline === false ? 'API Offline' : 'Checking...'}
        </span>
      </div>

      {/* ── Notification Bell ───────────────────────────────── */}
      <div className="relative" ref={bellRef}>
        <button
          onClick={() => { setShowBell(p => !p); setShowProfile(false); }}
          className="btn-icon relative"
        >
          <Bell size={16} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold animate-pulse">
              {unread}
            </span>
          )}
        </button>

        {/* Bell Dropdown */}
        {showBell && (
          <div className="absolute right-0 top-11 w-80 bg-surface-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="text-xs font-bold text-slate-200">Notifications</span>
              <button
                onClick={markAllRead}
                className="text-[10px] text-primary-400 hover:text-primary-300 font-semibold cursor-pointer transition-colors"
              >
                Mark all read
              </button>
            </div>

            {/* Notification list */}
            <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/3 ${n.unread ? 'bg-primary-500/5' : ''}`}
                  onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                >
                  <div className={`w-8 h-8 rounded-lg ${n.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <n.icon size={14} className={n.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-200 leading-tight">{n.title}</p>
                      {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0 mt-1" />}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{n.desc}</p>
                    <p className="text-[9px] text-slate-600 mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-white/5">
              <button
                onClick={() => { navigate('/alerts'); setShowBell(false); }}
                className="w-full flex items-center justify-center gap-1.5 text-[10px] text-primary-400 hover:text-primary-300 font-semibold cursor-pointer transition-colors py-1"
              >
                View all alerts <ChevronRight size={11} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Profile Avatar ──────────────────────────────────── */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => { setShowProfile(p => !p); setShowBell(false); }}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:scale-105 hover:shadow-glow-primary transition-all border-2 border-white/10"
        >
          {initial}
        </button>

        {/* Profile Dropdown */}
        {showProfile && (
          <div className="absolute right-0 top-11 w-56 bg-surface-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* User info */}
            <div className="px-4 py-3.5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{userProfile?.name || 'Guest User'}</p>
                  <p className="text-[10px] text-slate-500 truncate">{userProfile?.email || 'guest@platform.ai'}</p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1.5">
              <button
                onClick={() => { navigate('/profile'); setShowProfile(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <User size={13} className="text-slate-500" />
                My Profile
              </button>
              <button
                onClick={() => { navigate('/admin'); setShowProfile(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Settings size={13} className="text-slate-500" />
                Settings
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-white/5 py-1.5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors cursor-pointer"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
