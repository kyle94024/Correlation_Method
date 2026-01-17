// src/components/CorrelationCard.tsx

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
  const absR = result.correlation !== null ? Math.abs(result.correlation) : 0;
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
    if (result.direction === 'negative') {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 7L17 17M17 17H7M17 17V7" />
        </svg>
      );
    }
    return null;
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
            {result.direction !== 'none' && (
              <span
                className="inline-flex items-center gap-1 text-sm font-medium"
                style={{ color: colors.primary }}
              >
                {getDirectionIcon()}
                {result.direction === 'positive' ? 'Positive' : 'Negative'}
              </span>
            )}
            {result.direction !== 'none' && <span className="text-slate-300">•</span>}
            <span className="text-sm text-slate-400">n = {result.sampleSize}</span>
            
            {/* Small sample warning inline */}
            {result.sampleSize < 5 && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-amber-600 font-medium">⚠️ Small sample</span>
              </>
            )}
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
              animate={{ width: `${percentage}%` }}
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
                {result.correlation === null ? 'Need 2+ points' : strengthLabel}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  r
                </div>
                <div
                  className="font-mono text-lg font-bold"
                  style={{ color: result.correlation === null ? '#9ca3af' : colors.primary }}
                >
                  {result.correlation === null ? '—' : (
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
                  {result.correlation === null ? '—' : (result.correlation ** 2).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interpretation */}
        {result.correlation !== null && (
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
  const { variable1Label, variable2Label, strength, direction, sampleSize } = result;
  
  const caveat = sampleSize < 5 ? ' (but we need more responses to be sure!)' : '';

  switch (strength) {
    case 'strong':
      return direction === 'positive'
        ? `Strong positive relationship! People who rated ${variable1Label} higher also tended to rate ${variable2Label} higher${caveat}`
        : `Strong negative relationship! People who rated ${variable1Label} higher tended to rate ${variable2Label} lower${caveat}`;
    case 'moderate':
      return direction === 'positive'
        ? `Moderate positive trend: higher ${variable1Label} tends to go with higher ${variable2Label}${caveat}`
        : `Moderate negative trend: higher ${variable1Label} tends to go with lower ${variable2Label}${caveat}`;
    case 'weak':
      return direction === 'positive'
        ? `Slight positive tendency between ${variable1Label} and ${variable2Label}, but the relationship is weak${caveat}`
        : `Slight negative tendency between ${variable1Label} and ${variable2Label}, but the relationship is weak${caveat}`;
    case 'none':
      return `No meaningful correlation found — ${variable1Label} and ${variable2Label} appear to be independent${caveat}`;
  }
}