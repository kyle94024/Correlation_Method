// src/components/QuestionSlider.tsx

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuestionConfig } from '@/types';

interface QuestionSliderProps {
  question: QuestionConfig;
  value: number | null;
  onChange: (value: number | null) => void;
  index: number;
}

export function QuestionSlider({ question, value, onChange, index }: QuestionSliderProps) {
  const [isSkipped, setIsSkipped] = useState(value === null);
  const [localValue, setLocalValue] = useState(value ?? 4);

  const handleSkipToggle = () => {
    const newSkipped = !isSkipped;
    setIsSkipped(newSkipped);
    onChange(newSkipped ? null : localValue);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setLocalValue(newValue);
    if (!isSkipped) {
      onChange(newValue);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 transition-all duration-300 ${
        isSkipped ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl md:text-3xl">{question.icon}</span>
          <div>
            <h3 className="font-display font-semibold text-lg md:text-xl text-slate-800">
              {question.label}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
              {question.description}
            </p>
          </div>
        </div>
        
        {/* Skip toggle */}
        <button
          onClick={handleSkipToggle}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            isSkipped
              ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
              : 'bg-slate-100 text-slate-500 border border-transparent hover:border-slate-200'
          }`}
        >
          {isSkipped ? 'Answer' : 'Skip'}
        </button>
      </div>

      <div className={`transition-opacity duration-300 ${isSkipped ? 'opacity-30 pointer-events-none' : ''}`}>
        
        {/* Scale labels - NOW VERY PROMINENT */}
        <div className="flex justify-between items-stretch gap-3 mb-4">
          <div 
            className={`flex-1 p-3 rounded-xl text-center transition-all ${
              localValue <= 2 
                ? 'bg-cyan-100 border-2 border-cyan-400 shadow-sm' 
                : 'bg-slate-50 border-2 border-transparent'
            }`}
          >
            <div className="text-xs text-slate-400 mb-1">1 =</div>
            <div className={`font-semibold text-sm ${localValue <= 2 ? 'text-cyan-700' : 'text-slate-600'}`}>
              {question.lowLabel}
            </div>
          </div>
          
          <div className="flex items-center">
            <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8m-4-4l4 4-4 4" />
            </svg>
          </div>
          
          <div 
            className={`flex-1 p-3 rounded-xl text-center transition-all ${
              localValue >= 6 
                ? 'bg-emerald-100 border-2 border-emerald-400 shadow-sm' 
                : 'bg-slate-50 border-2 border-transparent'
            }`}
          >
            <div className="text-xs text-slate-400 mb-1">7 =</div>
            <div className={`font-semibold text-sm ${localValue >= 6 ? 'text-emerald-700' : 'text-slate-600'}`}>
              {question.highLabel}
            </div>
          </div>
        </div>

        {/* Current selection display */}
        <div className="flex items-center justify-center mb-3">
          <motion.div
            key={localValue}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-lg shadow-md"
          >
            {localValue}
          </motion.div>
        </div>

        {/* Slider */}
        <div className="relative px-1">
          <input
            type="range"
            min="1"
            max="7"
            step="1"
            value={localValue}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, 
                #06b6d4 0%, 
                #06b6d4 ${((localValue - 1) / 6) * 100}%, 
                #e2e8f0 ${((localValue - 1) / 6) * 100}%, 
                #e2e8f0 100%
              )`,
            }}
          />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-2 px-0.5">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <button
                key={step}
                onClick={() => {
                  setLocalValue(step);
                  if (!isSkipped) onChange(step);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-mono transition-all duration-200 ${
                  step === localValue
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold scale-110 shadow-md'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}