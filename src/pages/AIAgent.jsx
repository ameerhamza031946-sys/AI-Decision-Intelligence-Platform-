import { useState, useEffect } from 'react';
import { 
  Brain, Play, Loader2, Sparkles, AlertTriangle, ShieldCheck, 
  CheckCircle, ArrowRight, Download, BarChart2, ShieldAlert
} from 'lucide-react';
import { runAgentAnalysis, getScenarios } from '../services/api';
import toast from 'react-hot-toast';

// Hardcoded fallback so the page works even if backend is briefly unreachable
const FALLBACK_SCENARIOS = [
  { id: 'Air Quality',        label: '🌫️ Air Quality & Pollution',   description: 'AQI, PM2.5, industrial emissions analysis' },
  { id: 'Healthcare',         label: '🏥 Healthcare Demand',          description: 'Hospital capacity, disease trends, demand forecast' },
  { id: 'Traffic',            label: '🚗 Traffic & Infrastructure',   description: 'Congestion index, corridor analysis, peak hours' },
  { id: 'Safety',             label: '🚨 Community Safety',           description: 'Incident rates, response times, district risk scores' },
  { id: 'Community Overview', label: '🏘️ Community Overview',         description: 'Holistic multi-domain community health summary' },
];

export default function AIAgent() {
  const [scenarios, setScenarios] = useState(FALLBACK_SCENARIOS);
  const [selectedDomain, setSelectedDomain] = useState('Air Quality');
  const [context, setContext] = useState('');
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [agentOutput, setAgentOutput] = useState(null);

  useEffect(() => {
    async function loadScenarios() {
      try {
        const res = await getScenarios();
        if (res.scenarios?.length > 0) {
          setScenarios(res.scenarios);
          setSelectedDomain(res.scenarios[0].id);
        }
      } catch (err) {
        // Silently fall back to hardcoded scenarios — no error toast
        console.warn('Using offline scenario list:', err.message);
      }
    }
    loadScenarios();
  }, []);

  const handleRunAgent = async () => {
    setRunning(true);
    setAgentOutput(null);
    setCurrentStep(1);

    // Simulate multi-step agent reasoning progress bar
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 4) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 4500);

    try {
      const result = await runAgentAnalysis(selectedDomain, context);
      clearInterval(interval);
      setCurrentStep(4);
      setAgentOutput(result);
      toast.success('🤖 Autonomous Decision Agent completed all pipeline steps!');
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      toast.error(err.message || 'Decision Agent pipeline failed.');
      setCurrentStep(0);
    } finally {
      setRunning(false);
    }
  };

  const steps = [
    { id: 1, name: 'Data Ingestion & Summary', desc: 'Analyzing structures, missing values, and metrics' },
    { id: 2, name: 'Pattern & Anomaly Detection', desc: 'Running algorithms to isolate spikes and correlations' },
    { id: 3, name: 'Risk Assessment & 7-Day Forecast', desc: 'Running predictive models and assessing threats' },
    { id: 4, name: 'Action Plan Generation', desc: 'Crafting evidence-based operational decisions' },
  ];

  return (
    <div className="space-y-6 bg-surface-950 text-slate-100 p-1">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary-500/10 border border-primary-500/20 shadow-glow-primary">
          <Brain size={20} className="text-primary-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-display text-slate-100">Autonomous Decision Agent</h1>
          <p className="text-xs text-slate-500">Chain multi-step AI reasoning to generate city policy decisions and actions.</p>
        </div>
      </div>

      {/* Control panel */}
      <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg space-y-5">
        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-white/5 pb-4">
          <Sparkles size={16} className="text-yellow-400" />
          Agent Configurations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-1 space-y-3">
            <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Select Focus Domain</label>
            <div className="space-y-2">
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setSelectedDomain(sc.id)}
                  disabled={running}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedDomain === sc.id
                      ? 'border-primary-500/50 bg-primary-600/10 shadow-glow-primary'
                      : 'border-white/5 bg-surface-800/40 hover:border-white/10'
                  } disabled:opacity-50`}
                >
                  <div className="text-xs font-bold text-slate-200">{sc.label}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5 leading-normal">{sc.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5 flex-1">
              <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Additional Context or Constraints</label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. Include winter smog factors, focus on low-cost options first, hospital capacity is limited to 150 additional beds..."
                disabled={running}
                className="w-full h-36 bg-surface-800 border border-white/5 focus:border-primary-500/50 rounded-xl p-3 text-xs text-slate-200 focus:outline-none resize-none transition-all placeholder-slate-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleRunAgent}
                disabled={running || !selectedDomain}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-glow-primary cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {running ? (
                  <><Loader2 size={14} className="animate-spin" />Agent is Reasoning...</>
                ) : (
                  <><Play size={14} />Run Decision Agent Pipeline</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress pipeline */}
      {running && (
        <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg space-y-5 animate-pulse">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-xs font-bold text-slate-300">Decision Pipeline Status</span>
            <span className="text-[10px] font-semibold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full border border-primary-500/10">
              Agent Version 2.0
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {steps.map((st) => {
              const isActive = currentStep === st.id;
              const isCompleted = currentStep > st.id;
              return (
                <div 
                  key={st.id} 
                  className={`p-3.5 rounded-xl border transition-all ${
                    isActive 
                      ? 'border-primary-500/40 bg-primary-600/5 shadow-glow-primary scale-[1.02]' 
                      : isCompleted 
                        ? 'border-emerald-500/20 bg-emerald-500/5' 
                        : 'border-white/5 bg-surface-800/20 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400">Step {st.id}</span>
                    {isCompleted ? (
                      <CheckCircle size={12} className="text-emerald-400" />
                    ) : isActive ? (
                      <Loader2 size={12} className="text-primary-400 animate-spin" />
                    ) : null}
                  </div>
                  <div className="text-xs font-bold text-slate-200">{st.name}</div>
                  <div className="text-[9px] text-slate-500 mt-1 leading-normal">{st.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Agent Output Results */}
      {agentOutput && !running && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Main Plan & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Immediate Action Items */}
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg space-y-4">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-white/5 pb-4">
                <ShieldAlert size={16} className="text-rose-400" />
                Immediate Action Plan
              </h2>

              <div className="space-y-3">
                {agentOutput.actions?.immediateActions?.map((act, i) => (
                  <div key={i} className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 text-rose-400 font-bold text-xs">
                      {act.priority || `P${i+1}`}
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-slate-200">{act.action}</div>
                      <div className="text-[10px] text-slate-400 leading-relaxed">
                        <span className="font-semibold text-slate-300">Expected Impact:</span> {act.expectedImpact}
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] text-slate-500">
                        <div><span className="font-semibold text-slate-400">Timeline:</span> {act.timeline}</div>
                        <div><span className="font-semibold text-slate-400">Owner:</span> {act.owner}</div>
                        <div className="col-span-2"><span className="font-semibold text-slate-400">Resources:</span> {act.resources}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Short-Term & Policy Actions */}
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg space-y-4">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-white/5 pb-4">
                <CheckCircle size={16} className="text-emerald-400" />
                Policy & Mid-Term Actions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agentOutput.actions?.shortTermActions?.map((act, i) => (
                  <div key={i} className="bg-surface-800/40 border border-white/5 rounded-xl p-3.5 space-y-1.5">
                    <div className="text-xs font-bold text-slate-200 flex justify-between items-center">
                      <span>{act.action}</span>
                      <span className="text-[8px] font-bold text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded-full border border-primary-500/10">
                        {act.timeline}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">{act.expectedImpact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Forecast & Diagnostics sidebar */}
          <div className="space-y-6">
            {/* Risk Index */}
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agent Evaluation</h2>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-rose-400 font-display">{agentOutput.forecast?.riskScore}/100</div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase mt-0.5">Overall Risk Score</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-emerald-400 font-display">{agentOutput.forecast?.confidence}%</div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase mt-0.5">AI Confidence</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-rose-500 h-1.5 rounded-full transition-all" 
                  style={{ width: `${agentOutput.forecast?.riskScore}%` }}
                />
              </div>

              {/* Warnings List */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                {agentOutput.forecast?.reasoning?.map((reason, idx) => (
                  <div key={idx} className="flex gap-2 text-[10px] text-slate-400 leading-normal">
                    <span className="text-rose-400 shrink-0">⚠️</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingestion Summary */}
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg space-y-3.5">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-2.5">Ingested Metrics</h2>
              <div className="space-y-2">
                {agentOutput.summary?.keyMetrics?.map((met, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-slate-400 font-medium">{met.name}</span>
                    <span className="font-bold text-slate-200">{met.value} {met.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
