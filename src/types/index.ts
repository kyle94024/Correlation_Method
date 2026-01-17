// src/types/index.ts

export interface SurveyData {
  sleepHours: number | null;
  exerciseFrequency: number | null;
  stressLevel: number | null;
  screenTime: number | null;
  socialActivity: number | null;
  productivity: number | null;
  moodRating: number | null;
  caffeineIntake: number | null;
  petAffinity: number | null;
  musicVolume: number | null;
  chaosEnergy: number | null;
  pizzaOpinion: number | null;
  optimism: number | null;
  decision: number | null;
  homeworkStress: number | null;
  socialBattery: number | null;
}

export interface QuestionConfig {
  key: keyof SurveyData;
  label: string;
  description: string;
  lowLabel: string;
  highLabel: string;
  icon: string;
}

export interface CorrelationResult {
  variable1: string;
  variable2: string;
  variable1Label: string;
  variable2Label: string;
  correlation: number | null;
  strength: 'strong' | 'moderate' | 'weak' | 'none';
  direction: 'positive' | 'negative' | 'none';
  sampleSize: number;
  scatterData: { x: number; y: number; count: number }[];
}

export interface SubmissionResult {
  success: boolean;
  alreadySubmitted?: boolean;
  correlations?: CorrelationResult[];
  totalResponses?: number;
  error?: string;
}