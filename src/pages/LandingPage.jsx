import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Users, BarChartBig, Zap, ShieldCheck, TrendingUp,
  AlertTriangle, CheckCircle, ChevronRight, Globe, Sparkles
} from 'lucide-react';

const CLOUD_BADGES = [
  { name: 'Gemini AI', color: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30', icon: '✦', text: 'text-blue-300' },
  { name: 'Firebase', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', icon: '🔥', text: 'text-amber-300' },
  { name: 'Cloud Run', color: 'from-sky-500/20 to-cyan-500/20', border: 'border-sky-500/30', icon: '⚡', text: 'text-sky-300' },
  { name: 'Vertex AI', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', icon: '🧠', text: 'text-purple-300' },
  { name: 'BigQuery', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', icon: '📊', text: 'text-emerald-300' },
  { name: 'Cloud Storage', color: 'from-rose-500/20 to-red-500/20', border: 'border-rose-500/30', icon: '☁️', text: 'text-rose-300' },
];

const AI_INSIGHTS = [
  { label: 'Traffic', value: '↑ 12%', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  { label: 'Flood Risk', value: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { label: 'Air Quality', value: 'Poor', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  { label: 'Energy', value: '↓ 4%', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
];

const FEATURES = [
  { icon: Users, title: 'Community Collaboration', description: 'Citizens, NGOs, and authorities share data and recommendations in a unified workspace.' },
  { icon: BarChartBig, title: 'Predictive Analytics', description: 'Real-time dashboards, KPI tracking, and AI-powered trend predictions for traffic, health, and energy.' },
  { icon: Brain, title: 'Gemini AI + RAG', description: "Context-aware AI reads your platform's live data to generate accurate, localized decisions." },
  { icon: ShieldCheck, title: 'Decision Intelligence', description: 'Risk scores, action plans, confidence scores, and responsible departments — all AI-generated.' },
  { icon: TrendingUp, title: 'Live Data Sources', description: 'Weather API, air quality sensors, citizen reports, and hospital data — all real-time.' },
  { icon: AlertTriangle, title: 'Emergency Alerts', description: 'Firebase-powered live alerts broadcast instantly to citizens and government authorities.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-slate-100 overflow-x-hidden">

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-br from-[#0d1117] via-surface-900 to-[#0a0f1e]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div className="absolute w-[500px] h-[500px] bg-primary-600/15 rounded-full filter blur-[140px] top-1/3 left-1/4"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          />
          <motion.div className="absolute w-[400px] h-[400px] bg-accent-600/15 rounded-full filter blur-[140px] bottom-1/3 right-1/4"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 text-xs text-primary-300 font-semibold mb-6"
          >
            <Sparkles size={12} className="text-primary-400" />
            Powered by Google Gemini AI + Firebase
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6"
          >
            <span className="text-slate-100">AI Decision</span>{' '}
            <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-300 bg-clip-text text-transparent">Intelligence</span>{' '}
            <span className="text-slate-100">Platform</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto text-slate-400 text-base md:text-lg leading-relaxed mb-10"
          >
            Empowering citizens, governments, and NGOs with AI-driven insights, real-time risk analysis, and actionable decisions to build smarter, safer communities.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <Link to="/dashboard"
              className="group flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold px-8 py-4 rounded-2xl shadow-glow-primary transition-all duration-300 hover:scale-105 text-sm"
            >
              <Zap size={16} />
              Try Demo — No Login Needed
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login"
              className="flex items-center gap-2 bg-surface-800/80 border border-white/10 hover:border-primary-500/30 hover:bg-surface-800 text-slate-200 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 text-sm"
            >
              Login / Sign Up
            </Link>
          </motion.div>

          {/* Today's AI Insights Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
            className="bg-surface-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 max-w-2xl mx-auto mb-8"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
              Today's AI Insights — Live
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AI_INSIGHTS.map((item, i) => (
                <div key={i} className={`border rounded-xl px-3 py-2.5 ${item.bg}`}>
                  <p className="text-[10px] text-slate-500 font-medium mb-0.5">{item.label}</p>
                  <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Community Health Score */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="inline-flex flex-wrap items-center justify-center gap-5 bg-surface-900/60 border border-white/5 rounded-2xl px-8 py-4"
          >
            <div className="text-center">
              <div className="text-3xl font-extrabold font-display text-emerald-400">82<span className="text-slate-500 text-xl">/100</span></div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Community Health Score</div>
            </div>
            <div className="h-10 w-px bg-white/5" />
            <div className="flex gap-2 items-end">
              {[
                { label: 'Safety', score: 72, color: 'bg-amber-400' },
                { label: 'Health', score: 85, color: 'bg-emerald-400' },
                { label: 'Air', score: 48, color: 'bg-rose-400' },
                { label: 'Traffic', score: 61, color: 'bg-amber-400' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="h-12 w-4 bg-white/5 rounded-full overflow-hidden flex flex-col justify-end">
                    <div className={`${item.color} rounded-full transition-all`} style={{ height: `${item.score}%` }} />
                  </div>
                  <span className="text-[8px] text-slate-500 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="h-10 w-px bg-white/5" />
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle size={14} />
              Status: Good
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Google Cloud Badges ─── */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-8 flex items-center justify-center gap-2">
            <Globe size={12} />
            Powered by Google Cloud Technologies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {CLOUD_BADGES.map((badge, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-center gap-2 bg-gradient-to-r ${badge.color} border ${badge.border} rounded-xl px-5 py-2.5 text-xs font-bold ${badge.text} hover:scale-105 transition-transform cursor-default shadow-lg`}
              >
                <span>{badge.icon}</span>
                {badge.name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Feature Grid ─── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-100 mb-3">Built for Real Community Decisions</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Not just a chatbot — a full Decision Intelligence Platform with Gemini AI, Firebase, and live sensor data.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="group bg-surface-900 hover:bg-surface-800/80 border border-white/5 hover:border-primary-500/20 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <Icon className="text-primary-400" size={18} />
                </div>
                <h3 className="text-sm font-bold text-slate-200 mb-2">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-20 px-4 text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-100 mb-4">See It In Action</h2>
          <p className="text-slate-400 text-sm mb-8">No account needed. Jump directly into the dashboard and explore AI-driven community analytics powered by Gemini.</p>
          <Link to="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold px-10 py-4 rounded-2xl shadow-glow-primary transition-all hover:scale-105 text-sm"
          >
            <Zap size={16} />
            Explore the Platform Demo
          </Link>
        </div>
        <p className="mt-12 text-[10px] text-slate-600">© 2025 AI Decision Intelligence Platform · Built with Google Cloud</p>
      </section>
    </div>
  );
}
