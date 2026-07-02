import { useState, useRef } from 'react';
import { generateReport } from '../services/api';
import { FileText, Download, Loader2, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

const REPORT_TYPES = [
  { key: 'Community Overview', label: 'Community Overview', icon: '🏘️', description: 'General health, safety, and economic summary.' },
  { key: 'Environmental Impact', label: 'Environmental Impact', icon: '🌿', description: 'Air quality, pollution, climate, and sustainability.' },
  { key: 'Public Health Analysis', label: 'Public Health Analysis', icon: '🏥', description: 'Healthcare access, disease trends, hospital capacity.' },
  { key: 'Infrastructure Status', label: 'Infrastructure Status', icon: '🏗️', description: 'Traffic, roads, utilities, energy consumption.' },
  { key: 'Safety & Emergency', label: 'Safety & Emergency', icon: '🚨', description: 'Incident rates, emergency response, crime index.' },
  { key: 'Economic Development', label: 'Economic Development', icon: '📈', description: 'Employment, poverty, local business, and investment.' },
];

export default function Reports() {
  const [reportType, setReportType] = useState('Community Overview');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [generating, setGenerating] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [reportMeta, setReportMeta] = useState(null);
  const reportRef = useRef(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setReportContent('');
    try {
      const response = await generateReport(reportType, dateRange, null);
      setReportContent(response.report || response);
      setReportMeta({ reportType: response.reportType, dateRange: response.dateRange });
      toast.success('✅ AI Report generated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Report generation failed. Check Gemini API key.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportContent) return;
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const element = reportRef.current;
      const options = {
        margin: [20, 20, 20, 20],
        filename: `${reportType.replace(/\s+/g, '-')}-Report-${dateRange.start}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#020617' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      toast.promise(
        html2pdf().set(options).from(element).save(),
        { loading: 'Preparing PDF...', success: 'Report PDF saved!', error: 'PDF export failed.' }
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to export PDF.');
    }
  };

  return (
    <div className="space-y-6 bg-surface-950 text-slate-100 p-1">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold font-display text-slate-100">AI Decision Reports</h1>
        <p className="text-xs text-slate-500">Generate comprehensive, evidence-based AI reports for any time period and download as PDF.</p>
      </div>

      {/* Configuration Panel */}
      <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg space-y-5">
        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-white/5 pb-4">
          <Sparkles size={16} className="text-yellow-400" />
          Report Configuration
        </h2>

        {/* Report Type Selection Grid */}
        <div>
          <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-3">Select Report Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REPORT_TYPES.map((type) => (
              <button
                key={type.key}
                onClick={() => setReportType(type.key)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  reportType === type.key
                    ? 'border-primary-500/50 bg-primary-600/10 shadow-glow-primary'
                    : 'border-white/5 bg-surface-800/60 hover:border-white/10'
                }`}
              >
                <div className="text-lg mb-1">{type.icon}</div>
                <div className="text-xs font-bold text-slate-200">{type.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-normal">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1.5">
              <Calendar size={11} />
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full bg-surface-800 border border-white/5 focus:border-primary-500/40 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1.5">
              <Calendar size={11} />
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full bg-surface-800 border border-white/5 focus:border-primary-500/40 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-glow-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <><Loader2 size={14} className="animate-spin" />Generating with Gemini AI...</>
            ) : (
              <><Sparkles size={14} />Generate Report</>
            )}
          </button>
        </div>
      </div>

      {/* Report Output */}
      {(generating || reportContent) && (
        <div className="bg-surface-900 border border-white/5 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-primary-400" />
              <div>
                <h2 className="text-sm font-bold text-slate-200">{reportType} Report</h2>
                {reportMeta?.dateRange && (
                  <p className="text-[10px] text-slate-500">
                    {reportMeta.dateRange.start} → {reportMeta.dateRange.end}
                  </p>
                )}
              </div>
            </div>
            {reportContent && (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 size={11} />
                  Generated
                </span>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg text-xs text-slate-300 font-semibold cursor-pointer transition-all"
                >
                  <Download size={13} />
                  Download PDF
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 max-h-[600px] overflow-y-auto" ref={reportRef}>
            {generating ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 size={28} className="text-primary-400 animate-spin" />
                <p className="text-sm text-slate-400 animate-pulse font-medium">Gemini is analyzing community metrics and writing the report...</p>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                <ReactMarkdown>{reportContent}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
