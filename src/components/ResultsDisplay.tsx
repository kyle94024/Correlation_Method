// src/components/ResultsDisplay.tsx

'use client';

import { motion } from 'framer-motion';
import { CorrelationResult } from '@/types';
import { CorrelationCard } from './CorrelationCard';

interface ResultsDisplayProps {
  correlations: CorrelationResult[];
  totalResponses: number;
  alreadySubmitted: boolean;
}

export function ResultsDisplay({ correlations, totalResponses, alreadySubmitted }: ResultsDisplayProps) {
  return (
    <div className="min-h-screen py-8 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Success indicator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg"
          >
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-800 mb-3">
            Results Are In! 📊
          </h1>
          <p className="text-slate-500 text-lg">
            Here's what the class data reveals so far...
          </p>

          {/* Stats banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-500 text-sm">Live Data</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="font-mono text-cyan-600 font-bold">{totalResponses}</span>
            <span className="text-slate-500 text-sm">total responses</span>
          </motion.div>
        </motion.div>

        {/* Video Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="aspect-video w-full">
              <iframe
                src="https://www.youtube.com/embed/k4bLj3jeRSY?rel=0"
                title="Understanding Correlations"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Section title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <h2 className="font-display font-semibold text-xl text-slate-700 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 9l-5 5-4-4-3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Top 5 Correlations
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Ranked by strength — scroll down to see more
          </p>
        </motion.div>

        {/* Correlations list */}
        {correlations.length > 0 ? (
          <div className="space-y-6">
            {correlations.map((correlation, index) => (
              <CorrelationCard
                key={`${correlation.variable1}-${correlation.variable2}`}
                result={correlation}
                rank={index + 1}
                total={correlations.length}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-lg text-slate-700 mb-2">
              Waiting for Data
            </h3>
            <p className="text-slate-500">
              Be the first to submit! Correlations will appear once we have responses.
            </p>
          </motion.div>
        )}

        {/* Legend */}
        {correlations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-10 p-5 bg-white rounded-2xl shadow-sm border border-slate-100"
          >
            <h3 className="font-display font-semibold text-sm text-slate-500 uppercase tracking-wider mb-4">
              How to Read These Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">Strong positive (r ≥ 0.7)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-500" />
                  <span className="text-slate-600">Moderate positive (0.4–0.7)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-slate-600">Weak positive (0.2–0.4)</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-slate-600">Strong negative (r ≤ -0.7)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-slate-600">Moderate negative</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-400" />
                  <span className="text-slate-600">No correlation (|r| &lt; 0.2)</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                <strong>r</strong> = Pearson correlation coefficient (−1 to +1). 
                <strong className="ml-2">r²</strong> = proportion of variance explained.
              </p>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 text-center"
        >
          <p className="text-slate-400 text-xs">
            Nueva Psychology • Amy's Class • Data is anonymous
          </p>
        </motion.div>
      </div>
    </div>
  );
}