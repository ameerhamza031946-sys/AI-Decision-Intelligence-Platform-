import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile, analyzeData } from '../services/api';
import { Upload, FileText, Database, Sparkles, AlertCircle, CheckCircle2, Loader2, Table } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

export default function DataUpload() {
  const [fileInfo, setFileInfo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [previewData, setPreviewData] = useState([]);
  const [columns, setColumns] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setFileInfo(null);
    setAnalysisResult('');
    setPreviewData([]);
    setColumns([]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload File
      const response = await uploadFile(formData, (percent) => {
        setProgress(percent);
      });

      if (response.success) {
        setFileInfo(response);
        setPreviewData(response.preview || []);
        setColumns(response.columns || []);
        toast.success('File uploaded and parsed successfully!');
        
        // 2. Automatically trigger AI Analysis if it is a data file
        if (response.type === 'data') {
          await triggerAiAnalysis(response.preview, response.filename);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  }, []);

  const triggerAiAnalysis = async (data, filename) => {
    setAnalyzing(true);
    try {
      const result = await analyzeData(data, filename);
      setAnalysisResult(result.analysis || result);
      toast.success('AI Decision analysis complete!');
    } catch (err) {
      console.error(err);
      toast.error('AI analysis failed. Please verify Gemini API key.');
      setAnalysisResult('AI service could not process this file. Please verify your Gemini API key inside the backend configuration.');
    } finally {
      setAnalyzing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  return (
    <div className="space-y-6 bg-surface-950 text-slate-100 p-1">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold font-display text-slate-100">Community Data Upload</h1>
        <p className="text-xs text-slate-500">Upload CSV, Excel, or JSON datasets to get instant AI decision intelligence reports.</p>
      </div>

      {/* Drag & Drop Zone */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 relative overflow-hidden ${
          isDragActive 
            ? 'border-primary-500 bg-primary-500/5' 
            : 'border-white/10 bg-surface-900/60 hover:border-white/20'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="p-4 rounded-full bg-white/5 text-primary-400">
            <Upload size={32} />
          </div>
          <div>
            <p className="font-semibold text-sm text-slate-200">
              {isDragActive ? 'Drop your file here' : 'Drag & drop your file here, or click to browse'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Supports CSV, Excel (XLSX, XLS), or JSON (Max size: 20MB)</p>
          </div>
        </div>
      </div>

      {/* Upload Progress Bar */}
      {uploading && (
        <div className="bg-surface-900 border border-white/5 rounded-2xl p-4 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Uploading and parsing file...</span>
            <span className="text-xs text-primary-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-surface-800 rounded-full h-2 overflow-hidden">
            <div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Main Content Area: Data Preview & AI Insights */}
      {fileInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File details & preview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card */}
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
                <FileText size={16} className="text-primary-400" />
                File Information
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-500">File Name</span>
                  <span className="text-slate-200 font-semibold truncate max-w-[200px]">{fileInfo.filename}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-500">Total Rows</span>
                  <span className="text-slate-200 font-semibold">{fileInfo.rowCount?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-500">File Size</span>
                  <span className="text-slate-200 font-semibold">{(fileInfo.size / 1024).toFixed(1)} KB</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Status</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 size={12} />
                    Parsed
                  </span>
                </div>
              </div>
            </div>

            {/* Columns List */}
            {columns.length > 0 && (
              <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg">
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
                  <Database size={16} className="text-accent-400" />
                  Dataset Columns
                </h2>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {columns.map((col, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] font-semibold bg-surface-800 text-slate-300 border border-white/5 px-2.5 py-1 rounded-lg"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Analysis Result */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-[60px] pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-400" />
                  AI Decision Intelligence Analysis
                </h2>
                {analyzing && <Loader2 size={16} className="text-primary-400 animate-spin" />}
              </div>

              {analyzing ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 size={24} className="text-primary-400 animate-spin" />
                  <p className="text-xs text-slate-400 animate-pulse font-medium">Gemini is processing the dataset & calculating recommendations...</p>
                </div>
              ) : analysisResult ? (
                <div className="prose prose-invert prose-xs max-w-none text-slate-300 space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  <ReactMarkdown>{analysisResult}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
                  <AlertCircle size={24} className="text-slate-500" />
                  <p className="text-xs text-slate-400">Click to run AI Decision Intelligence on this dataset.</p>
                  <button 
                    onClick={() => triggerAiAnalysis(previewData, fileInfo.filename)}
                    className="mt-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-glow-primary cursor-pointer"
                  >
                    Run AI Analysis
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Table */}
      {fileInfo && previewData.length > 0 && (
        <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
            <Table size={16} className="text-teal-400" />
            Data Preview (Top 10 Rows)
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-800 text-slate-400 font-semibold border-b border-white/5">
                  {columns.map((col, idx) => (
                    <th key={idx} className="p-3">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {previewData.slice(0, 10).map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-white/2">
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="p-3 text-slate-300 font-medium truncate max-w-[150px]">
                        {row[col] !== undefined && row[col] !== null ? String(row[col]) : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
