import { useEffect, useState } from 'react';
import { getRecommendations } from '../services/api';
import { 
  Lightbulb, Sparkles, Filter, ShieldAlert, Clock, 
  Coins, HeartHandshake, Eye
} from 'lucide-react';
import ExplainPanel from '../components/ExplainPanel';
import toast from 'react-hot-toast';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRecommendations();
        const list = Array.isArray(data) ? data : (Array.isArray(data?.recommendations) ? data.recommendations : []);
        setRecommendations(list);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load community recommendations.');
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
          <p className="text-slate-400 text-sm animate-pulse">Calculating AI recommendations...</p>
        </div>
      </div>
    );
  }

  const categories = ['all', ...new Set(recommendations.map(r => r.category?.toLowerCase() || ''))].filter(Boolean);

  const filteredRecommendations = categoryFilter === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category?.toLowerCase() === categoryFilter);

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return {
          card: 'border-rose-500/35 hover:border-rose-500/50 bg-rose-500/5',
          badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
          bullet: 'bg-rose-500',
        };
      case 'high':
        return {
          card: 'border-amber-500/35 hover:border-amber-500/50 bg-amber-500/5',
          badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
          bullet: 'bg-amber-500',
        };
      case 'medium':
        return {
          card: 'border-sky-500/35 hover:border-sky-500/50 bg-sky-500/5',
          badge: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
          bullet: 'bg-sky-500',
        };
      default:
        return {
          card: 'border-white/10 hover:border-white/20 bg-surface-900',
          badge: 'bg-slate-500/10 text-slate-400 border border-white/10',
          bullet: 'bg-slate-500',
        };
    }
  };

  return (
    <div className="space-y-6 bg-surface-950 text-slate-100 p-1">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-slate-100">AI-Powered Action Planner</h1>
          <p className="text-xs text-slate-500">Gemini-driven recommendations to resolve issues and optimize community operations.</p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <Filter size={14} className="text-slate-500 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs capitalize font-medium border shrink-0 transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-primary-600 border-primary-500 text-white shadow-glow-primary'
                  : 'bg-surface-900 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecommendations.map((rec, index) => {
          const style = getPriorityStyle(rec.priority);
          return (
            <div 
              key={index} 
              className={`rounded-2xl border p-5 flex flex-col justify-between gap-6 transition-all duration-200 shadow-lg ${style.card}`}
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {rec.category}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${style.badge}`}>
                    {rec.priority}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-200 font-display leading-tight">{rec.title}</h3>
                <p className="text-xs text-slate-400 leading-normal">{rec.description}</p>
              </div>

              {/* Specs Grid */}
              <div className="border-t border-white/5 pt-4 space-y-4">
                {/* Expected Impact */}
                <div className="flex items-start gap-2.5">
                  <Eye size={14} className="text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-500 font-semibold block uppercase">Expected Impact</span>
                    <p className="text-[11px] text-slate-300 font-medium leading-normal">{rec.impact}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Timeframe */}
                  <div className="flex items-start gap-2.5">
                    <Clock size={14} className="text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-500 font-semibold block uppercase">Timeframe</span>
                      <p className="text-[11px] text-slate-300 font-medium">{rec.timeframe}</p>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="flex items-start gap-2.5">
                    <Coins size={14} className="text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-500 font-semibold block uppercase">Resources Required</span>
                      <p className="text-[11px] text-slate-300 font-medium leading-normal" title={rec.resources}>
                        {rec.resources}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explainability component integration */}
              <ExplainPanel 
                metric={rec.title?.toLowerCase()} 
                value={rec.priority} 
                domain={rec.category?.toLowerCase()} 
                context={rec.description} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
