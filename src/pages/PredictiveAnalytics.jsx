import { useEffect, useState } from 'react';
import { getPredictions } from '../services/api';
import { 
  TrendingUp, Activity, ShieldCheck, 
  Brain, AlertCircle, Sparkles, ChevronRight 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, LineChart, Line 
} from 'recharts';
import toast from 'react-hot-toast';

export default function PredictiveAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndicator, setSelectedIndicator] = useState('traffic');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getPredictions();
        setData(response);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load predictions data.');
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
          <p className="text-slate-400 text-sm animate-pulse">Loading predictive models...</p>
        </div>
      </div>
    );
  }

  const indicators = {
    traffic: {
      label: 'Traffic Congestion',
      color: '#f59e0b',
      unit: '%',
      description: 'Predicts traffic gridlocks based on historical flow, peak hours, and calendar events.',
    },
    pollution: {
      label: 'Air Pollution Index (AQI)',
      color: '#38bdf8',
      unit: ' AQI',
      description: 'Forecasts pollution spikes (PM2.5) by combining wind direction, traffic, and temperature.',
    },
    healthcare: {
      label: 'Healthcare Demand',
      color: '#ec4899',
      unit: ' patients',
      description: 'Models hospital bed capacity requirements based on weather, outbreaks, and age demographics.',
    },
    energy: {
      label: 'Energy Consumption',
      color: '#10b981',
      unit: ' MWh',
      description: 'Predicts electricity grid load by processing temperature forecasts and business cycles.',
    },
  };

  const getCombinedData = (indicatorKey) => {
    const series = data?.[indicatorKey];
    if (!series) return [];

    const historical = (series.historical || []).map((h) => ({
      month: h.month,
      Actual: h.actual,
      Range: [h.actual, h.actual], // No range for historical
    }));

    const forecast = (series.forecast || []).map((f) => ({
      month: f.month,
      Predicted: f.predicted,
      Range: [f.lower, f.upper],
    }));

    // Connect last historical point to first forecast point in chart visually
    if (historical.length > 0 && forecast.length > 0) {
      forecast.unshift({
        month: historical[historical.length - 1].month,
        Predicted: historical[historical.length - 1].Actual,
        Range: historical[historical.length - 1].Range,
      });
    }

    return [...historical, ...forecast];
  };

  const currentAccuracy = data?.modelAccuracy?.[selectedIndicator] || 90;
  const combinedChartData = getCombinedData(selectedIndicator);
  const selectedConfig = indicators[selectedIndicator];

  return (
    <div className="space-y-6 bg-surface-950 text-slate-100 p-1">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold font-display text-slate-100">Predictive Analytics & AI Forecasting</h1>
        <p className="text-xs text-slate-500">ML models trained to forecast community requirements and highlight risks.</p>
      </div>

      {/* Select Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(indicators).map(([key, config]) => {
          const isActive = selectedIndicator === key;
          const accuracy = data?.modelAccuracy?.[key] || 90;
          return (
            <button
              key={key}
              onClick={() => setSelectedIndicator(key)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-surface-900 border-primary-500/50 shadow-glow-primary' 
                  : 'bg-surface-900/60 border-white/5 hover:border-white/10'
              }`}
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Indicator</span>
                <h3 className="font-bold text-sm text-slate-200 mt-1">{config.label}</h3>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-md font-semibold">
                  {accuracy}% Accuracy
                </span>
                <ChevronRight size={14} className={isActive ? 'text-primary-400' : 'text-slate-600'} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Analysis Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Chart Card */}
        <div className="lg:col-span-2 bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <TrendingUp size={16} className="text-primary-400" />
                6-Month Outlook Trend
              </h2>
              <p className="text-[10px] text-slate-500">Historical actuals vs Machine Learning forecast (with confidence interval)</p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.02)" />
                <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.3)" style={{ fontSize: '10px' }} />
                <YAxis stroke="rgba(255, 255, 255, 0.3)" style={{ fontSize: '10px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                    fontSize: '12px'
                  }}
                  formatter={(value, name) => [
                    name === 'Range' ? `${value[0]} - ${value[1]}${selectedConfig.unit}` : `${value}${selectedConfig.unit}`,
                    name
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                {/* Forecast Confidence Interval Band */}
                <Area 
                  name="Confidence Band"
                  type="monotone" 
                  dataKey="Range" 
                  stroke="none" 
                  fill={selectedConfig.color} 
                  fillOpacity={0.08} 
                />
                {/* Historical Line */}
                <Line 
                  name="Actual (Historical)" 
                  type="monotone" 
                  dataKey="Actual" 
                  stroke="#818cf8" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, stroke: '#4f46e5', strokeWidth: 1.5, fill: '#0f172a' }}
                />
                {/* Forecast Line */}
                <Line 
                  name="AI Forecasted" 
                  type="monotone" 
                  dataKey="Predicted" 
                  stroke={selectedConfig.color} 
                  strokeWidth={2.5} 
                  strokeDasharray="5 5"
                  dot={{ r: 4, stroke: selectedConfig.color, strokeWidth: 1.5, fill: '#0f172a' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explainable AI Model Details */}
        <div className="space-y-6">
          {/* Accuracy Card */}
          <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-emerald-400" />
              Model Verification
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="34" className="stroke-surface-800" strokeWidth="6" fill="transparent" />
                  <circle cx="40" cy="40" r="34" className="stroke-emerald-500" strokeWidth="6" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - currentAccuracy / 100)} 
                  />
                </svg>
                <span className="absolute text-sm font-bold text-slate-100 font-display">{currentAccuracy}%</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Confidence Accuracy</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  Our decision algorithms calculate outcomes using continuous sensor streams and backtesting verification.
                </p>
              </div>
            </div>
          </div>

          {/* Model Specs Card */}
          <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
              <Brain size={16} className="text-primary-400" />
              Model Insights
            </h2>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-300">Model Description</h4>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">{selectedConfig.description}</p>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h4 className="text-xs font-semibold text-slate-300 mb-2.5">Key Input Parameters</h4>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-lg">
                    <Activity size={12} className="text-slate-500" />
                    <span>Real-time sensors</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-lg">
                    <Sparkles size={12} className="text-slate-500" />
                    <span>Historical files</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
