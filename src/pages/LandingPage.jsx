import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Users, BarChartBig, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary-800 via-surface-900 to-primary-900">
      {/* Floating gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-72 h-72 bg-primary-500/30 rounded-full filter blur-3xl"
          animate={{
            rotate: [0, 360],
            x: [0, 100, -100, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-accent-500/20 rounded-full filter blur-2xl"
          animate={{
            rotate: [0, -360],
            x: [-50, 120, -120, 0],
            y: [30, -70, 70, 30],
          }}
          transition={{ repeat: Infinity, duration: 35, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 lg:py-48">
        <motion.div
          className="inline-flex items-center gap-2 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Brain className="w-8 h-8 text-primary-300" />
          <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-100">
            AI Decision Intelligence Platform
          </h1>
        </motion.div>

        <motion.p
          className="max-w-2xl mx-auto text-slate-300 text-sm md:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Empower citizens, governments, and NGOs with AI‑driven insights, predictive analytics, and interactive dashboards to build smarter, healthier communities.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Link
            to="/register"
            className="btn-primary px-6 py-3 rounded-full shadow-glow-primary text-sm font-medium"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="btn-ghost px-6 py-3 rounded-full text-sm font-medium"
          >
            Log In
          </Link>
        </motion.div>
      </div>

      {/* Feature grid */}
      <section className="relative z-10 max-w-6xl mx-auto py-12 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureItem icon={Users} title="Community Collaboration" description="Citizens, NGOs, and authorities share data, insights, and recommendations in a unified workspace." />
        <FeatureItem icon={BarChartBig} title="Analytics & Forecasts" description="Real‑time dashboards, KPI tracking, and AI‑powered trend predictions for traffic, health, and energy." />
        <FeatureItem icon={Zap} title="AI Assistant" description="Ask natural‑language questions – the Gemini‑powered chatbot replies with actionable insights." />
      </section>
    </section>
  );
}

function FeatureItem({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-surface-800/60 rounded-xl backdrop-blur-sm hover:bg-surface-800/80 transition-colors">
      <Icon className="w-8 h-8 text-primary-400 mb-3" />
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-snug">{description}</p>
    </div>
  );
}
