import React from 'react';
import { AlertCircle, FlaskConical, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { isDemoMode, disableDemoMode } from '../api';

const ServiceStatusBanner = () => {
  const demo = isDemoMode();

  const handleExitDemo = () => {
    disableDemoMode();
    window.location.href = '/login';
  };

  return (
    <motion.div
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center px-3 py-2"
      style={{
        background: demo ? 'rgba(99, 102, 241, 0.08)' : 'rgba(251, 191, 36, 0.05)',
        backdropFilter: 'blur(12px)',
        borderBottom: demo
          ? '1px solid rgba(99, 102, 241, 0.2)'
          : '1px solid rgba(251, 191, 36, 0.2)',
      }}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Icon + Message */}
        <div className="flex items-center gap-3">
          {demo ? (
            <FlaskConical size={16} className="text-accent-glow flex-shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-warning animate-pulse flex-shrink-0" />
          )}

          {demo ? (
            <p className="text-xs sm:text-sm font-body">
              <span className="text-accent-glow font-semibold uppercase tracking-widest text-[10px] mr-2 font-mono">
                Demo Mode
              </span>
              <span className="text-text-secondary">
                You're exploring with sample data —
              </span>
              <span className="text-text-primary font-medium ml-1">
                changes are live but reset on page refresh.
              </span>
            </p>
          ) : (
            <p className="text-xs sm:text-sm font-body">
              <span className="text-warning font-semibold uppercase tracking-widest text-[10px] mr-2 font-mono">
                Backend Offline
              </span>
              <span className="text-text-secondary">
                The Railway free tier has ended — API is unavailable.
              </span>
              <span className="text-text-primary font-medium ml-1">
                Use "Explore Demo Mode" to preview the full app with sample data.
              </span>
            </p>
          )}
        </div>

        {/* Right: Exit Demo button */}
        {demo && (
          <button
            onClick={handleExitDemo}
            className="flex items-center gap-1.5 text-[11px] font-mono text-text-secondary hover:text-negative transition-colors flex-shrink-0"
            title="Exit Demo"
          >
            <X size={13} />
            Exit Demo
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ServiceStatusBanner;
