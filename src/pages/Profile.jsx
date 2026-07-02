import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, ShieldCheck, Save, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { userProfile, updateUserProfile } = useAuth();
  const [name, setName] = useState(userProfile?.name || '');
  const [notifications, setNotifications] = useState(userProfile?.notifications !== false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setSaving(true);
    try {
      await updateUserProfile({ name: name.trim(), notifications });
      setSaved(true);
      toast.success('Profile updated!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const roleLabel = userProfile?.role || 'citizen';
  const roleColors = {
    admin: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    government: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    ngo: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    citizen: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };
  const roleBadge = roleColors[roleLabel] || roleColors.citizen;

  return (
    <div className="max-w-2xl mx-auto space-y-6 bg-surface-950 text-slate-100 p-1">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold font-display text-slate-100">My Profile</h1>
        <p className="text-xs text-slate-500">Manage your account information and preferences.</p>
      </div>

      {/* Avatar & Role Card */}
      <div className="bg-surface-900 border border-white/5 rounded-2xl p-6 flex items-center gap-5 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-glow-primary">
          {userProfile?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100 font-display">{userProfile?.name || 'User'}</h2>
          <p className="text-xs text-slate-400">{userProfile?.email}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize border ${roleBadge}`}>
              <ShieldCheck size={10} className="inline mr-1" />
              {roleLabel} Role
            </span>
            {userProfile?.isMock && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-amber-400 bg-amber-500/10 border border-amber-500/20">
                Demo Mode
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg space-y-5">
        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-white/5 pb-4">
          <User size={16} className="text-primary-400" />
          Edit Information
        </h2>

        <div className="space-y-4">
          {/* Display Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-semibold uppercase">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-surface-800 border border-white/5 focus:border-primary-500/50 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-semibold uppercase">Email Address</label>
            <input
              type="email"
              value={userProfile?.email || ''}
              disabled
              className="w-full bg-surface-800/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-500">Email cannot be changed here.</p>
          </div>

          {/* Role (read-only) */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-semibold uppercase">Platform Role</label>
            <input
              type="text"
              value={roleLabel.charAt(0).toUpperCase() + roleLabel.slice(1)}
              disabled
              className="w-full bg-surface-800/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed capitalize"
            />
            <p className="text-[10px] text-slate-500">Roles are assigned by administrators.</p>
          </div>
        </div>

        {/* Notifications Toggle */}
        <div className="border-t border-white/5 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={16} className="text-primary-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">Community Notifications</p>
              <p className="text-[10px] text-slate-500">Receive alerts and insights from the platform.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNotifications((p) => !p)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all cursor-pointer ${
              notifications ? 'bg-primary-600' : 'bg-surface-700'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-glow-primary cursor-pointer transition-all disabled:opacity-50"
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" />Saving...</>
            ) : saved ? (
              <><CheckCircle2 size={14} />Saved!</>
            ) : (
              <><Save size={14} />Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
