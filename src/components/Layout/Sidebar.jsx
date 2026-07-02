import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Bot, Upload, TrendingUp, Lightbulb,
  Bell, FileText, User, ShieldCheck, ChevronLeft, ChevronRight,
  Brain, LogOut, Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard',          roles: ['all'] },
  { to: '/ai-agent',       icon: Brain,           label: 'AI Agent (Decisions)',roles: ['all'] },
  { to: '/ai-assistant',   icon: Bot,             label: 'AI Assistant',        roles: ['all'] },
  { to: '/data-upload',    icon: Upload,          label: 'Data Upload',         roles: ['all'] },
  { to: '/predictions',    icon: TrendingUp,      label: 'Predictive Analytics',roles: ['all'] },
  { to: '/recommendations',icon: Lightbulb,       label: 'Recommendations',     roles: ['all'] },
  { to: '/alerts',         icon: Bell,            label: 'Community Alerts',    roles: ['all'] },
  { to: '/reports',        icon: FileText,        label: 'Reports',             roles: ['all'] },
  { to: '/profile',        icon: User,            label: 'My Profile',          roles: ['all'] },
  { to: '/admin',          icon: ShieldCheck,     label: 'Admin Panel',         roles: ['admin'] },
];

export default function Sidebar({ open, setOpen }) {
  const { userProfile, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  const visibleItems = navItems.filter(
    (item) => item.roles.includes('all') || item.roles.includes(role)
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`
        relative z-30 flex flex-col shrink-0 bg-surface-900/95 backdrop-blur-xl
        border-r border-white/5 transition-all duration-300 ease-in-out
        ${open ? 'w-64' : 'w-[70px]'}
        lg:relative fixed h-full
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 shadow-glow-primary">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {open && (
            <div className="overflow-hidden">
              <p className="font-display font-bold text-sm leading-tight text-slate-100 truncate">AI Decision</p>
              <p className="text-[10px] text-primary-400 font-medium">Intelligence Platform</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {!open && (
            <div className="mb-3 px-1">
              <div className="h-px bg-white/5" />
            </div>
          )}
          {open && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-3 mb-2">
              Navigation
            </p>
          )}
          {visibleItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={!open ? label : undefined}
              className={({ isActive }) =>
                isActive ? 'nav-item-active' : 'nav-item'
              }
            >
              <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
              {open && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="p-3 border-t border-white/5">
          {open ? (
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-800/60 transition-colors group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {userProfile?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">{userProfile?.name || 'User'}</p>
                <p className={`text-[10px] capitalize font-medium role-${userProfile?.role || 'citizen'}`}>
                  {userProfile?.role || 'citizen'}
                </p>
              </div>
              <button onClick={handleLogout} className="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost p-1.5 rounded-lg">
                <LogOut size={14} className="text-red-400" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} title="Logout" className="w-full btn-ghost flex items-center justify-center py-2">
              <LogOut size={16} className="text-red-400" />
            </button>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setOpen((p) => !p)}
          className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-surface-800 border border-white/10 flex items-center justify-center hover:bg-surface-700 transition-colors z-40"
        >
          {open ? <ChevronLeft size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
        </button>
      </aside>
    </>
  );
}
