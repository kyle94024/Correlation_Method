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
        {/* Value indicator */}
        <div className="flex items-center justify-center mb-4">
          <motion.div
            key={localValue}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-50 to-emerald-50 border border-cyan-200"
          >
            <span className="font-mono text-xl font-bold text-cyan-600">{localValue}</span>
            <span className="text-slate-400 text-sm ml-2">/ 7</span>
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
          <div className="flex justify-between mt-3 px-0.5">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <button
                key={step}
                onClick={() => {
                  setLocalValue(step);
                  if (!isSkipped) onChange(step);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-200 ${
                  step === localValue
                    ? 'bg-cyan-500 text-white font-bold scale-110 shadow-md'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-3 text-xs text-slate-400">
          <span>{question.lowLabel}</span>
          <span>{question.highLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}
