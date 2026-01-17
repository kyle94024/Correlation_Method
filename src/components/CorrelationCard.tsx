'use client';

import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CorrelationResult } from '@/types';
import { getCorrelationColor, getStrengthLabel } from '@/lib/correlation';

interface CorrelationCardProps {
  result: CorrelationResult;
  rank: number;
  total: number;
}

export function CorrelationCard({ result, rank, total }: CorrelationCardProps) {
  const colors = getCorrelationColor(result);
  const strengthLabel = getStrengthLabel(result.strength);
  const absR = Math.abs(result.correlation);
  const percentage = Math.round(absR * 100);

  // Animation variants based on rank
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: rank * 0.15,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const getRankBadgeStyle = () => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-400 to-orange-400 text-white';
      case 2:
        return 'bg-gradient-to-r from-slate-300 to-slate-400 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
      default:
        return 'bg-slate-200 text-slate-600';
    }
  };

  const getDirectionIcon = () => {
    if (result.direction === 'positive') {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 7L17 17M17 17H7M17 17V7" />
      </svg>
    );
  };

  // Calculate point sizes based on count
  const maxCount = Math.max(...result.scatterData.map(d => d.count), 1);
  const getPointSize = (count: number) => {
    const minSize = 60;
    const maxSize = 300;
    return minSize + ((count / maxCount) * (maxSize - minSize));
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Card */}
      <div
        className="relative bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 overflow-hidden"
      >
        {/* Rank badge */}
        <div className="absolute top-4 right-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg shadow-sm ${getRankBadgeStyle()}`}
          >
            #{rank}
          </div>
        </div>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-flex items-center gap-1 text-sm font-medium"
              style={{ color: colors.primary }}
            >
              {getDirectionIcon()}
              {result.direction === 'positive' ? 'Positive' : 'Negative'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-sm text-slate-400">n = {result.sampleSize}</span>
          </div>

          {/* Variables */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 font-display font-semibold text-slate-700 text-sm md:text-base">
              {result.variable1Label}
            </span>
            <span className="text-slate-400">↔</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 font-display font-semibold text-slate-700 text-sm md:text-base">
              {result.variable2Label}
            </span>
          </div>
        </div>

        {/* Warning for insufficient data */}
        {result.strength === 'insufficient' && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-700">Not Enough Data Yet</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Need at least 5 responses to calculate a meaningful correlation. Currently have {result.sampleSize}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Small sample warning */}
        {result.sampleSize >= 5 && result.sampleSize < 10 && (
          <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-700">Small Sample Size</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  With only {result.sampleSize} responses, this correlation might change as more data comes in.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scatter Plot */}
        <div className="mb-4 bg-slate-50 rounded-xl p-3">
          <ResponsiveContainer width="100%" height={180}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                dataKey="x" 
                domain={[0.5, 7.5]} 
                ticks={[1, 2, 3, 4, 5, 6, 7]}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
                label={{ value: result.variable1Label, position: 'bottom', offset: 0, fontSize: 11, fill: '#64748b' }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                domain={[0.5, 7.5]} 
                ticks={[1, 2, 3, 4, 5, 6, 7]}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
                width={30}
                label={{ value: result.variable2Label, angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#64748b' }}
              />
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200 text-xs">
                        <p className="font-medium text-slate-700">
                          ({data.x}, {data.y})
                        </p>
                        <p className="text-slate-500">
                          {data.count} response{data.count > 1 ? 's' : ''}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={result.scatterData} fill={colors.primary}>
                {result.scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors.primary}
                    fillOpacity={0.7}
                    r={Math.sqrt(getPointSize(entry.count)) / 2}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          {maxCount > 1 && (
            <p className="text-center text-xs text-slate-400 mt-1">
              Larger dots = more people chose that combination
            </p>
          )}
        </div>

        {/* Correlation visualization */}
        <div className="space-y-3">
          {/* Progress bar */}
          <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: result.strength === 'insufficient' ? '0%' : `${percentage}%` }}
              transition={{ delay: rank * 0.15 + 0.3, duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              }}
            />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between">
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: colors.primary }}
              >
                {strengthLabel}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  r
                </div>
                <div
                  className="font-mono text-lg font-bold"
                  style={{ color: result.strength === 'insufficient' ? '#9ca3af' : colors.primary }}
                >
                  {result.strength === 'insufficient' ? '—' : (
                    <>
                      {result.correlation >= 0 ? '+' : ''}
                      {result.correlation.toFixed(2)}
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  r²
                </div>
                <div className="font-mono text-lg font-bold text-slate-500">
                  {result.strength === 'insufficient' ? '—' : (result.correlation ** 2).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interpretation */}
        {result.strength !== 'insufficient' && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed">
              {getInterpretation(result)}
            </p>
          </div>
        )}

        {/* Decorative gradient line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
          }}
        />
      </div>
    </motion.div>
  );
}

function getInterpretation(result: CorrelationResult): string {
  const { variable1Label, variable2Label, strength, direction } = result;

  switch (strength) {
    case 'strong':
      return direction === 'positive'
        ? `Strong positive relationship! People who rated ${variable1Label} higher also tended to rate ${variable2Label} higher.`
        : `Strong negative relationship! People who rated ${variable1Label} higher tended to rate ${variable2Label} lower.`;
    case 'moderate':
      return direction === 'positive'
        ? `Moderate positive trend: higher ${variable1Label} tends to go with higher ${variable2Label}.`
        : `Moderate negative trend: higher ${variable1Label} tends to go with lower ${variable2Label}.`;
    case 'weak':
      return direction === 'positive'
        ? `Slight positive tendency between ${variable1Label} and ${variable2Label}, but the relationship is weak.`
        : `Slight negative tendency between ${variable1Label} and ${variable2Label}, but the relationship is weak.`;
    case 'none':
      return `No meaningful correlation found — ${variable1Label} and ${variable2Label} appear to be independent.`;
    default:
      return '';
  }
}
