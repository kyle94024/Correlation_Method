// src/components/SurveyForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SurveyData, SubmissionResult } from '@/types';
import { QUESTIONS } from '@/config/questions';
import { QuestionSlider } from './QuestionSlider';
import { ResultsDisplay } from './ResultsDisplay';
import { generateFingerprint } from '@/lib/fingerprint';
import { submitSurvey, getCorrelations, getTotalResponses } from '@/app/actions';

export function SurveyForm() {
  const [stage, setStage] = useState<'survey' | 'submitting' | 'results'>('survey');
  const [fingerprint, setFingerprint] = useState<string>('');
  const [surveyData, setSurveyData] = useState<SurveyData>({
    sleepHours: 4,
    exerciseFrequency: 4,
    stressLevel: 4,
    screenTime: 4,
    socialActivity: 4,
    productivity: 4,
    moodRating: 4,
    caffeineIntake: 4,
    petAffinity: 4,
    musicVolume: 4,
    chaosEnergy: 4,
    pizzaOpinion: 4,
    optimism: 4,
    decision: 4,
    homeworkStress: 4,
    socialBattery: 4,
  });
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate fingerprint on mount
  useEffect(() => {
    generateFingerprint().then(setFingerprint).catch(console.error);
  }, []);

  const handleQuestionChange = (key: keyof SurveyData, value: number | null) => {
    setSurveyData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setStage('submitting');
    setError(null);

    try {
      const response = await submitSurvey(surveyData, fingerprint || 'anonymous');
      
      if (response.success) {
        setResult(response);
        setStage('results');
      } else {
        setError(response.error || 'Something went wrong');
        setStage('survey');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Network error. Please try again.');
      setStage('survey');
    }
  };

  const handleSkipToResults = async () => {
    setStage('submitting');
    setError(null);

    try {
      const [correlations, totalResponses] = await Promise.all([
        getCorrelations(),
        getTotalResponses(),
      ]);
      
      setResult({
        success: true,
        alreadySubmitted: true,
        correlations,
        totalResponses,
      });
      setStage('results');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Network error. Please try again.');
      setStage('survey');
    }
  };

  // Count answered questions
  const answeredCount = Object.values(surveyData).filter((v) => v !== null).length;

  return (
    <AnimatePresence mode="wait">
      {stage === 'survey' && (
        <motion.div
          key="survey"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen py-8 px-4 md:px-6"
        >
          <div className="max-w-2xl mx-auto">
            {/* Skip to Results Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end mb-4"
            >
              <button
                onClick={handleSkipToResults}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium transition-all"
              >
                Skip to Results
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              {/* Logo/Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 9l-5 5-4-4-3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-800 mb-2">
                Correlational Studies Example (Psych 102)
              </h1>
              <p className="text-slate-500 max-w-md mx-auto">
              THIS IS NOT A REAL CORRELATIONAL STUDY. THIS SURVEY IS NOT SCIENTIFICALLY SOUND. IT'S JUST FOR FUN — answer honestly and let's see if anything interesting happens!
              </p>

              {/* Progress indicator */}
              <div className="mt-6 flex items-center justify-center gap-2">
                <span className="text-sm text-slate-400">Progress:</span>
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-sm font-mono text-cyan-600">
                  {answeredCount}/{QUESTIONS.length}
                </span>
              </div>
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Questions */}
            <div className="space-y-4">
              {QUESTIONS.map((question, index) => (
                <QuestionSlider
                  key={question.key}
                  question={question}
                  value={surveyData[question.key]}
                  onChange={(value) => handleQuestionChange(question.key, value)}
                  index={index}
                />
              ))}
            </div>

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: QUESTIONS.length * 0.05 + 0.2 }}
              className="mt-8 sticky bottom-4 z-10"
            >
              <button
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className={`w-full py-4 px-6 rounded-2xl font-display font-semibold text-lg transition-all duration-300 shadow-lg ${
                  answeredCount > 0
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:shadow-xl hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {answeredCount > 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    Submit & See Results
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                ) : (
                  'Answer at least one question'
                )}
              </button>
              
              <p className="text-center text-slate-400 text-xs mt-3">
                All questions are optional — skip any you prefer not to answer.
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {stage === 'submitting' && (
        <motion.div
          key="submitting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-slate-200 border-t-cyan-500"
            />
            <h2 className="font-display font-semibold text-xl text-slate-700 mb-2">
              Crunching Numbers
            </h2>
            <p className="text-slate-500">
              Finding correlations...
            </p>
          </div>
        </motion.div>
      )}

      {stage === 'results' && result && (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ResultsDisplay
            correlations={result.correlations || []}
            totalResponses={result.totalResponses || 0}
            alreadySubmitted={result.alreadySubmitted || false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}