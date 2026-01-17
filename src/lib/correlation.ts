// src/lib/correlation.ts

import { CorrelationResult } from '@/types';
import { QUESTION_LABELS } from '@/config/questions';

// Pearson correlation coefficient calculation
export function calculatePearsonCorrelation(x: number[], y: number[]): number | null {
  // Need at least 2 points to calculate correlation
  if (x.length !== y.length || x.length < 2) return null;

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
  const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  );

  if (denominator === 0) return 0;
  
  const r = numerator / denominator;
  
  // Clamp to [-1, 1] to handle floating point errors
  return Math.max(-1, Math.min(1, r));
}

// Determine correlation strength
export function getCorrelationStrength(r: number | null): 'strong' | 'moderate' | 'weak' | 'none' {
  if (r === null) return 'none';
  
  const absR = Math.abs(r);
  if (absR >= 0.7) return 'strong';
  if (absR >= 0.4) return 'moderate';
  if (absR >= 0.2) return 'weak';
  return 'none';
}

// Get human-readable strength label
export function getStrengthLabel(strength: 'strong' | 'moderate' | 'weak' | 'none'): string {
  switch (strength) {
    case 'strong': return 'Strong Correlation';
    case 'moderate': return 'Moderate Correlation';
    case 'weak': return 'Weak Correlation';
    case 'none': return 'No Correlation';
  }
}

// Generate scatter data with point counts for overlapping points
function generateScatterData(x: number[], y: number[]): { x: number; y: number; count: number }[] {
  const pointCounts = new Map<string, { x: number; y: number; count: number }>();
  
  for (let i = 0; i < x.length; i++) {
    const key = `${x[i]},${y[i]}`;
    if (pointCounts.has(key)) {
      pointCounts.get(key)!.count++;
    } else {
      pointCounts.set(key, { x: x[i], y: y[i], count: 1 });
    }
  }
  
  return Array.from(pointCounts.values());
}

// Calculate all pairwise correlations from survey data
export function calculateAllCorrelations(
  data: Record<string, (number | null)[]>
): CorrelationResult[] {
  const keys = Object.keys(data);
  const results: CorrelationResult[] = [];

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const key1 = keys[i];
      const key2 = keys[j];
      
      // Get paired data (only where both values exist)
      const paired: { x: number[]; y: number[] } = { x: [], y: [] };
      
      for (let k = 0; k < data[key1].length; k++) {
        const val1 = data[key1][k];
        const val2 = data[key2][k];
        
        if (val1 !== null && val2 !== null) {
          paired.x.push(val1);
          paired.y.push(val2);
        }
      }

      // Need at least 1 paired observation to show
      if (paired.x.length < 1) continue;

      const correlation = calculatePearsonCorrelation(paired.x, paired.y);
      const strength = getCorrelationStrength(correlation);
      const scatterData = generateScatterData(paired.x, paired.y);

      let direction: 'positive' | 'negative' | 'none' = 'none';
      if (correlation !== null) {
        direction = correlation >= 0 ? 'positive' : 'negative';
      }

      results.push({
        variable1: key1,
        variable2: key2,
        variable1Label: QUESTION_LABELS[key1] || key1,
        variable2Label: QUESTION_LABELS[key2] || key2,
        correlation,
        strength,
        direction,
        sampleSize: paired.x.length,
        scatterData,
      });
    }
  }

  // Sort by absolute correlation (strongest first), nulls at end
  results.sort((a, b) => {
    if (a.correlation === null && b.correlation === null) return 0;
    if (a.correlation === null) return 1;
    if (b.correlation === null) return -1;
    return Math.abs(b.correlation) - Math.abs(a.correlation);
  });

  return results;
}

// Get color based on correlation strength and direction (light mode friendly)
export function getCorrelationColor(result: CorrelationResult): {
  primary: string;
  secondary: string;
  glow: string;
} {
  const { strength, direction } = result;
  
  if (strength === 'none' || result.correlation === null) {
    return {
      primary: '#6b7280',
      secondary: '#9ca3af',
      glow: 'rgba(107, 114, 128, 0.2)',
    };
  }

  if (direction === 'positive') {
    switch (strength) {
      case 'strong':
        return {
          primary: '#059669',
          secondary: '#10b981',
          glow: 'rgba(5, 150, 105, 0.2)',
        };
      case 'moderate':
        return {
          primary: '#0891b2',
          secondary: '#06b6d4',
          glow: 'rgba(8, 145, 178, 0.2)',
        };
      case 'weak':
        return {
          primary: '#6366f1',
          secondary: '#818cf8',
          glow: 'rgba(99, 102, 241, 0.2)',
        };
    }
  } else {
    switch (strength) {
      case 'strong':
        return {
          primary: '#dc2626',
          secondary: '#ef4444',
          glow: 'rgba(220, 38, 38, 0.2)',
        };
      case 'moderate':
        return {
          primary: '#ea580c',
          secondary: '#f97316',
          glow: 'rgba(234, 88, 12, 0.2)',
        };
      case 'weak':
        return {
          primary: '#d97706',
          secondary: '#f59e0b',
          glow: 'rgba(217, 119, 6, 0.2)',
        };
    }
  }

  return {
    primary: '#6b7280',
    secondary: '#9ca3af',
    glow: 'rgba(107, 114, 128, 0.2)',
  };
}