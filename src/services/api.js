import axios from 'axios';

// Production: https://ai-29bz.onrender.com  |  Dev: http://localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-29bz.onrender.com';
console.log('📡 [API] Base URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 180000, // 3 min — Render free tier cold start can take ~50s
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor – attach auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, Promise.reject);

// Response interceptor – handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

// ─── AI / Gemini ──────────────────────────────────────────────
export const sendChatMessage = (messages, message) =>
  api.post('/api/ai/chat', { messages, message });

export const analyzeData = (data, filename) =>
  api.post('/api/ai/analyze', { data, filename });

export const generateReport = (reportType, dateRange, metrics) =>
  api.post('/api/ai/report', { reportType, dateRange, metrics });

export const getRecommendations = () =>
  api.get('/api/ai/recommendations');

// ─── Upload ───────────────────────────────────────────────────
export const uploadFile = (formData, onProgress) =>
  api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  });

// ─── Analytics ────────────────────────────────────────────────
export const getDashboard = () => api.get('/api/analytics/dashboard');
export const getPredictions = () => api.get('/api/analytics/predictions');
export const getAlerts = () => api.get('/api/analytics/alerts');
export const getMapData = () => api.get('/api/analytics/map-data');

// ─── Admin ────────────────────────────────────────────────────
export const getUsers = (params) => api.get('/api/admin/users', { params });
export const getActivity = () => api.get('/api/admin/activity');
export const getSystemHealth = () => api.get('/api/admin/system-health');
export const getAdminStats = () => api.get('/api/admin/stats');

// ─── Decision Agent ───────────────────────────────────────────
export const runAgentAnalysis = (domain, context) =>
  api.post('/api/agent/analyze', { domain, context });

export const explainMetric = (metric, value, context, domain) =>
  api.post('/api/agent/explain', { metric, value, context, domain });

export const getScenarios = () =>
  api.get('/api/agent/scenarios');

// ─── Health ───────────────────────────────────────────────────
export const checkHealth = () => api.get('/api/health');

export default api;

