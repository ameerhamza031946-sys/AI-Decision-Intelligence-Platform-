import { useEffect, useState } from 'react';
import { getUsers, getSystemHealth, getAdminStats, getActivity } from '../services/api';
import { 
  ShieldCheck, Users, Activity, Server, 
  HardDrive, Zap, Clock, ArrowUpRight, CheckCircle2, Database
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('system');

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersData, healthData, statsData, activityData] = await Promise.all([
          getUsers(),
          getSystemHealth(),
          getAdminStats(),
          getActivity(),
        ]);
        setUsers(usersData.users || []);
        setHealth(healthData);
        setStats(statsData);
        setActivity(activityData.activity || []);
      } catch (err) {
        console.error(err);
        toast.error('Could not load admin panel data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center bg-surface-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm animate-pulse">Accessing admin panel...</p>
        </div>
      </div>
    );
  }

  const roleColors = {
    admin: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    government: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    ngo: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    citizen: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };

  const statusColors = {
    operational: 'text-emerald-400',
    degraded: 'text-amber-400',
    down: 'text-rose-400',
  };

  return (
    <div className="space-y-6 bg-surface-950 text-slate-100 p-1">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <ShieldCheck size={20} className="text-rose-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-display text-slate-100">Admin Control Panel</h1>
          <p className="text-xs text-slate-500">System health, user management, and operational monitoring.</p>
        </div>
      </div>

      {/* Stats overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-900 border border-white/5 rounded-2xl p-4 shadow-lg">
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-2 flex items-center gap-1.5"><Users size={12} />Total Users</div>
            <div className="text-2xl font-bold text-slate-100 font-display">{stats.totalUsers}</div>
          </div>
          <div className="bg-surface-900 border border-white/5 rounded-2xl p-4 shadow-lg">
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-2 flex items-center gap-1.5"><Activity size={12} />Active Users</div>
            <div className="text-2xl font-bold text-emerald-400 font-display">{stats.activeUsers}</div>
          </div>
          <div className="bg-surface-900 border border-white/5 rounded-2xl p-4 shadow-lg">
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-2 flex items-center gap-1.5"><Database size={12} />Total Uploads</div>
            <div className="text-2xl font-bold text-sky-400 font-display">{stats.totalUploads}</div>
          </div>
          <div className="bg-surface-900 border border-white/5 rounded-2xl p-4 shadow-lg">
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-2 flex items-center gap-1.5"><ArrowUpRight size={12} />Total Queries</div>
            <div className="text-2xl font-bold text-primary-400 font-display">{stats.totalQueries}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-0">
        {[
          { key: 'system', label: 'System Health', icon: Server },
          { key: 'users', label: 'User Management', icon: Users },
          { key: 'activity', label: 'Activity Log', icon: Clock },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === key
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* System Health Tab */}
      {activeTab === 'system' && health && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg">
              <div className="text-[10px] text-slate-400 font-semibold uppercase mb-3 flex items-center gap-1.5"><Server size={12} />System Uptime</div>
              <div className="text-3xl font-bold text-emerald-400 font-display">{health.uptime}</div>
              <p className="text-[10px] text-slate-500 mt-1">30-day rolling window</p>
            </div>
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg">
              <div className="text-[10px] text-slate-400 font-semibold uppercase mb-3 flex items-center gap-1.5"><Zap size={12} />API Response Time</div>
              <div className="text-3xl font-bold text-sky-400 font-display">{health.responseTime}</div>
              <p className="text-[10px] text-slate-500 mt-1">Average over last hour</p>
            </div>
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg">
              <div className="text-[10px] text-slate-400 font-semibold uppercase mb-3 flex items-center gap-1.5"><HardDrive size={12} />Storage Used</div>
              <div className="text-3xl font-bold text-amber-400 font-display">{health.storageUsed}</div>
              <p className="text-[10px] text-slate-500 mt-1">of {health.storageTotal} total</p>
            </div>
          </div>

          {/* Services Status */}
          <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Service Status (All Systems)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(health.services || {}).map(([service, status]) => (
                <div key={service} className="bg-surface-800/60 border border-white/5 rounded-xl p-3 text-center">
                  <div className={`text-xs font-bold capitalize ${statusColors[status] || statusColors.operational}`}>
                    ● {status}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 capitalize font-medium">{service}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini API Usage */}
          {health.geminiApiUsage !== undefined && (
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg">
              <h3 className="text-sm font-bold text-slate-200 mb-4">Gemini AI API Usage Today</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
                    <span>{health.geminiApiUsage.toLocaleString()} requests</span>
                    <span>Limit: {health.geminiApiLimit.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-surface-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary-600 to-accent-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${Math.min((health.geminiApiUsage / health.geminiApiLimit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-primary-400 shrink-0">
                  {((health.geminiApiUsage / health.geminiApiLimit) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Users Management Tab */}
      {activeTab === 'users' && (
        <div className="bg-surface-900 border border-white/5 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-800 border-b border-white/5 text-slate-400 font-semibold uppercase tracking-wide text-[10px]">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Uploads</th>
                  <th className="p-4">Queries</th>
                  <th className="p-4">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">{user.name}</p>
                          <p className="text-slate-500 text-[10px]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize border ${roleColors[user.role] || roleColors.citizen}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold ${user.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {user.status === 'active' ? '● Active' : '○ Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{user.uploads}</td>
                    <td className="p-4 text-slate-300 font-medium">{user.queries}</td>
                    <td className="p-4 text-slate-400 text-[10px]">
                      {new Date(user.lastLogin).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Log Tab */}
      {activeTab === 'activity' && (
        <div className="bg-surface-900 border border-white/5 rounded-2xl overflow-hidden shadow-lg">
          <div className="divide-y divide-white/5">
            {activity.map((log) => (
              <div key={log.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/2 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {log.user?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{log.user}</p>
                    <p className="text-[10px] text-slate-400">{log.action}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-semibold text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
