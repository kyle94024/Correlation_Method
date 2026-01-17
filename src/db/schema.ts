import { pgTable, serial, text, integer, timestamp, boolean, real } from 'drizzle-orm/pg-core';

// Survey responses table
export const surveyResponses = pgTable('survey_responses', {
  id: serial('id').primaryKey(),
  fingerprintHash: text('fingerprint_hash').notNull(),
  
  // Survey questions (1-7 scale, null if skipped)
  sleepHours: integer('sleep_hours'),           
  exerciseFrequency: integer('exercise_frequency'), 
  stressLevel: integer('stress_level'),         
  screenTime: integer('screen_time'),           
  socialActivity: integer('social_activity'),   
  productivity: integer('productivity'),        
  moodRating: integer('mood_rating'),           
  caffeineIntake: integer('caffeine_intake'),   
  petAffinity: integer('pet_affinity'),         
  musicVolume: integer('music_volume'),         
  chaosEnergy: integer('chaos_energy'),         
  pizzaOpinion: integer('pizza_opinion'),
  optimism: integer('optimism'),
  decision: integer('decision'),
  homeworkStress: integer('homework_stress'),
  socialBattery: integer('social_battery'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Cached correlations for performance
export const correlationCache = pgTable('correlation_cache', {
  id: serial('id').primaryKey(),
  variable1: text('variable_1').notNull(),
  variable2: text('variable_2').notNull(),
  correlation: real('correlation').notNull(),
  sampleSize: integer('sample_size').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type NewSurveyResponse = typeof surveyResponses.$inferInsert;
