-- Nueva Psychology Correlation Study Database Schema
-- Run this SQL in your Neon SQL Editor

-- Survey responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  fingerprint_hash TEXT NOT NULL,
  
  -- Survey questions (1-7 scale, null if skipped)
  sleep_hours INTEGER,          -- Hours of sleep
  exercise_frequency INTEGER,   -- Snack goblin level
  stress_level INTEGER,         -- Current stress
  screen_time INTEGER,          -- Meme intake
  social_activity INTEGER,      -- Extroversion
  productivity INTEGER,         -- Procrastination
  mood_rating INTEGER,          -- Current mood
  caffeine_intake INTEGER,      -- Caffeine today
  pet_affinity INTEGER,         -- Dog vs cat
  music_volume INTEGER,         -- Music volume
  chaos_energy INTEGER,         -- Risk taking
  pizza_opinion INTEGER,        -- Pineapple pizza
  optimism INTEGER,             -- Optimism level
  decision INTEGER,             -- Decision style
  homework_stress INTEGER,      -- Homework load
  social_battery INTEGER,       -- Social battery
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Index for fast fingerprint lookups
CREATE INDEX IF NOT EXISTS idx_fingerprint_hash ON survey_responses(fingerprint_hash);
