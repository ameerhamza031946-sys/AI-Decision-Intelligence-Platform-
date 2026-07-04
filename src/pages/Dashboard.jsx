import { useEffect, useState } from 'react';
import { getDashboard, getMapData } from '../services/api';
import { 
  Heart, Wind, Car, Users, Bell, 
  ArrowUpRight, ArrowDownRight, Activity, AlertTriangle, ShieldAlert, Sparkles, Brain,
  CheckCircle2, Database, Wifi, CloudRain, TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import CommunityMap from '../components/CommunityMap';
import ExplainPanel from '../components/ExplainPanel';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#38bdf8', '#eab308', '#ef4444', '#10b981', '#a855f7'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [mapDistricts, setMapDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashRes, mapRes] = await Promise.all([
          getDashboard(),
          getMapData(),
        ]);
        setData(dashRes);
        setMapDistricts(mapRes.districts || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard metrics.');
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
          <p className="text-slate-400 text-sm animate-pulse">Running decision intelligence algorithms...</p>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const trends = data?.trends || [];
  const recentAlerts = data?.recentAlerts || [];
  const aiSummary = data?.aiSummary || {};
  const distribution = data?.distribution || {};

  // KPI icon selector
  const renderKpiIcon = (iconName) => {
    switch (iconName) {
      case 'heart':  return <Heart className="text-rose-400" size={16} />;
      case 'wind':   return <Wind className="text-sky-400" size={16} />;
      case 'car':    return <Car className="text-amber-400" size={16} />;
      case 'shield': return <ShieldAlert className="text-rose-400" size={16} />;
      default:       return <Bell className="text-purple-400" size={16} />;
    }
  };

  const domainTabs = ['Overview', 'Air Quality', 'Healthcare', 'Traffic', 'Safety'];

  return (
    <div className="space-y-6 bg-surface-950 text-slate-100 p-1">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-slate-100">Decision Intelligence Dashboard</h1>
          <p className="text-xs text-slate-500">Real-time indicators, geospatial monitoring, and AI-powered policy decisions.</p>
        </div>
        <div className="flex gap-2">
          {domainTabs.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeTab === t
                  ? 'border-primary-500/50 bg-primary-600/15 text-primary-400'
                  : 'border-white/5 bg-surface-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Overview' && (
        <>
          {/* AI Decision Summary Banner */}
          {aiSummary.headline && (
            <div className="bg-gradient-to-r from-rose-950/20 via-surface-900 to-surface-900 border border-rose-500/10 p-5 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-80 h-full bg-rose-500/5 rounded-full blur-[80px] pointer-events-none" />
              <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <Brain size={24} className="text-rose-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20 animate-pulse">
                      Active AI Alert
                    </span>
                    <h2 className="text-sm font-bold text-slate-100">{aiSummary.headline}</h2>
                  </div>
                  <div className="space-y-1">
                    {aiSummary.insights.map((ins, i) => (
                      <p key={i} className="text-xs text-slate-400 leading-normal flex gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        {ins}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 bg-surface-800/80 border border-white/5 p-3 rounded-xl text-center min-w-[100px]">
                  <div className="text-xs font-extrabold text-rose-400">{aiSummary.overallRiskScore}/100</div>
                  <div className="text-[9px] text-slate-500 font-semibold uppercase mt-0.5">Overall Risk</div>
                </div>
              </div>
            </div>
          )}

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(kpis).slice(0, 5).map(([key, kpi]) => {
              const isPositive = kpi.change >= 0;
              const isCritical = kpi.status === 'critical';
              const isWarning = kpi.status === 'warning';
              return (
                <div 
                  key={key} 
                  className="bg-surface-900 border border-white/5 rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:border-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-400 font-semibold truncate">{kpi.label}</span>
                    <div className="p-1.5 rounded-lg bg-white/5">
                      {renderKpiIcon(kpi.icon)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 font-display">
                      {kpi.current.toLocaleString()}{kpi.unit}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                        isCritical 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/10'
                          : isWarning
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                      }`}>
                        {isPositive ? `+${kpi.change}%` : `${kpi.change}%`}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium">vs last month</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Insights bar + Data Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Today's AI Insights */}
            <div className="lg:col-span-2 bg-gradient-to-r from-primary-600/10 to-accent-600/10 border border-primary-500/15 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-primary-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Today's AI Insights</span>
                <span className="ml-auto flex items-center gap-1 text-[9px] text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Traffic', value: '↑ 12%', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
                  { label: 'Flood Risk', value: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                  { label: 'Air Quality', value: 'Poor', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
                  { label: 'Energy', value: '↓ 4%', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                ].map((item, i) => (
                  <div key={i} className={`border rounded-xl px-3 py-2.5 ${item.bg}`}>
                    <p className="text-[10px] text-slate-500 font-medium mb-0.5">{item.label}</p>
                    <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Sources Card */}
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Database size={14} className="text-primary-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Data Sources</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Citizen Reports', icon: Users, color: 'text-primary-400' },
                  { label: 'Open-Meteo Weather API', icon: CloudRain, color: 'text-sky-400' },
                  { label: 'Air Quality Sensors', icon: Wind, color: 'text-emerald-400' },
                  { label: 'Traffic Data (ITMS)', icon: Car, color: 'text-amber-400' },
                  { label: 'Firebase (Live Alerts)', icon: Wifi, color: 'text-rose-400' },
                  { label: 'Gemini AI Analysis', icon: Brain, color: 'text-purple-400' },
                ].map((src, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={12} className={src.color} />
                    <span className="text-slate-300">{src.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Charts & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trend Area Chart */}
            <div className="lg:col-span-2 bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Activity size={16} className="text-primary-400" />
                  Predictive Index Trends
                </h2>
                <p className="text-xs text-slate-500">Comparative air quality, healthcare occupancy, and traffic congestion.</p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAir" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.02)" />
                    <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.2)" style={{ fontSize: '10px' }} />
                    <YAxis stroke="rgba(255, 255, 255, 0.2)" style={{ fontSize: '10px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', color: '#f1f5f9', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Area name="Air Quality (AQI)" type="monotone" dataKey="airQuality" stroke="#38bdf8" fillOpacity={1} fill="url(#colorAir)" />
                    <Area name="Healthcare Occupancy (%)" type="monotone" dataKey="healthcare" stroke="#ec4899" fillOpacity={1} fill="url(#colorHealth)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Distribution Chart */}
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-400" />
                  Risk Factors breakdown
                </h2>
                <p className="text-xs text-slate-500">Weight of domains contributing to community risk</p>
              </div>

              <div className="h-44 flex items-center justify-center">
                {distribution.riskByDomain && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distribution.riskByDomain}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {distribution.riskByDomain.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '11px', color: '#f1f5f9' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {distribution.riskByDomain?.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="text-slate-400 font-medium truncate">{entry.name} ({entry.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map and Warnings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                <Wind size={16} className="text-sky-400" />
                Air Quality & Risk Hotspots Map
              </h2>
              {mapDistricts.length > 0 && <CommunityMap districts={mapDistricts} height="360px" />}
            </div>

            <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg flex flex-col">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-400" />
                  Active Warnings
                </h2>
                <p className="text-xs text-slate-500">Sensor-triggered critical warnings</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[300px]">
                {recentAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="bg-white/2 hover:bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col justify-between transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        alert.type === 'Critical' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/10' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-[9px] text-slate-500">{alert.time}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 leading-normal">{alert.message}</p>
                    <span className="text-[9px] text-primary-400 mt-2 font-bold uppercase">Category: {alert.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Domain specific detail tab sheets with Explainability Panels */}
      {activeTab !== 'Overview' && (
        <div className="bg-surface-900 border border-white/5 rounded-2xl p-6 shadow-lg space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-100 font-display">{activeTab} Details</h2>
            <p className="text-xs text-slate-500">Direct analytics metrics for {activeTab} in Lahore Metropolitan Area.</p>
          </div>

          {activeTab === 'Air Quality' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-surface-800/40 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Lahore Max PM2.5</span>
                    <div className="text-2xl font-extrabold text-slate-200 mt-1">102.3 μg/m³</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/10">Critical Risk</span>
                  </div>
                </div>
                <ExplainPanel 
                  metric="shahdara pm2.5 concentration" 
                  value="102.3" 
                  domain="air quality" 
                  context="Winter smog season, emissions from nearby industrial zones, coal burning." 
                />
              </div>

              {/* District breakdown */}
              <div className="bg-surface-800/40 p-4 rounded-xl border border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">District PM2.5 Rankings</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Shahdara</span>
                    <span className="font-bold text-rose-400">102.3 μg/m³</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Gulberg</span>
                    <span className="font-bold text-rose-400">89.4 μg/m³</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Johar Town</span>
                    <span className="font-bold text-amber-400">74.8 μg/m³</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Model Town</span>
                    <span className="font-bold text-slate-200">42.1 μg/m³</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Healthcare' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-surface-800/40 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Average Bed Occupancy</span>
                    <div className="text-2xl font-extrabold text-slate-200 mt-1">94%</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/10">Near Capacity</span>
                  </div>
                </div>
                <ExplainPanel 
                  metric="abbasi shaheed hospital bed occupancy" 
                  value="95" 
                  domain="healthcare" 
                  context="Sudden dengue outbreak in Karachi, low availability of backup ventilators." 
                />
              </div>

              <div className="bg-surface-800/40 p-4 rounded-xl border border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Hospital Utilization</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Abbasi Shaheed</span>
                    <span className="font-bold text-rose-400">95% (5.6h wait)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">NICH Children</span>
                    <span className="font-bold text-rose-400">94% (6.1h wait)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Jinnah Hospital</span>
                    <span className="font-bold text-amber-400">92% (4.2h wait)</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Aga Khan Hospital</span>
                    <span className="font-bold text-slate-200">85% (1.8h wait)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Traffic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-surface-800/40 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Peak Congestion Level</span>
                    <div className="text-2xl font-extrabold text-slate-200 mt-1">92%</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/10">Gridlock</span>
                  </div>
                </div>
                <ExplainPanel 
                  metric="murree road congestion rate" 
                  value="92" 
                  domain="traffic" 
                  context="Heavy commercial mixing with private vehicles, poor signal cycles, double parking." 
                />
              </div>

              <div className="bg-surface-800/40 p-4 rounded-xl border border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Corridor Index</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Murree Road</span>
                    <span className="font-bold text-rose-400">92% Congestion</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Kashmir Highway</span>
                    <span className="font-bold text-amber-400">84% Congestion</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Islamabad Expressway</span>
                    <span className="font-bold text-amber-400">71% Congestion</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Margalla Road</span>
                    <span className="font-bold text-slate-200">38% Congestion</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Safety' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-surface-800/40 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Highest District Crime Risk</span>
                    <div className="text-2xl font-extrabold text-slate-200 mt-1">91/100</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/10">Critical Danger</span>
                  </div>
                </div>
                <ExplainPanel 
                  metric="punjab safe cities district risk score" 
                  value="91" 
                  domain="safety" 
                  context="Data Gunj district, poor police patrol, low street light illumination, high commercial footfall." 
                />
              </div>

              <div className="bg-surface-800/40 p-4 rounded-xl border border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Safety Index by District</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Data Gunj</span>
                    <span className="font-bold text-rose-400">91/100 (13.2 min response)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Shadman</span>
                    <span className="font-bold text-rose-400">84/100 (11.3 min response)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Gulberg</span>
                    <span className="font-bold text-amber-400">72/100 (8.2 min response)</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">DHA</span>
                    <span className="font-bold text-slate-200">34/100 (5.4 min response)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
