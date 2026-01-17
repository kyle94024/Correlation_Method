'use server';

import { db, schema } from '@/db';
import { sql } from 'drizzle-orm';
import { SurveyData, SubmissionResult, CorrelationResult } from '@/types';
import { calculateAllCorrelations } from '@/lib/correlation';

export async function submitSurvey(
  data: SurveyData,
  fingerprintHash: string
): Promise<SubmissionResult> {
  try {
    // Always insert - no duplicate checking for testing purposes
    await db.insert(schema.surveyResponses).values({
      fingerprintHash,
      sleepHours: data.sleepHours,
      exerciseFrequency: data.exerciseFrequency,
      stressLevel: data.stressLevel,
      screenTime: data.screenTime,
      socialActivity: data.socialActivity,
      productivity: data.productivity,
      moodRating: data.moodRating,
      caffeineIntake: data.caffeineIntake,
      petAffinity: data.petAffinity,
      musicVolume: data.musicVolume,
      chaosEnergy: data.chaosEnergy,
      pizzaOpinion: data.pizzaOpinion,
      optimism: data.optimism,
      decision: data.decision,
      homeworkStress: data.homeworkStress,
      socialBattery: data.socialBattery,
    });

    // Calculate and return correlations
    const correlations = await getCorrelations();
    
    return {
      success: true,
      alreadySubmitted: false,
      correlations,
      totalResponses: await getTotalResponses(),
    };
  } catch (error) {
    console.error('Survey submission error:', error);
    return {
      success: false,
      error: 'Failed to submit survey. Please try again.',
    };
  }
}

export async function getCorrelations(): Promise<CorrelationResult[]> {
  try {
    // Fetch all responses
    const responses = await db
      .select({
        sleepHours: schema.surveyResponses.sleepHours,
        exerciseFrequency: schema.surveyResponses.exerciseFrequency,
        stressLevel: schema.surveyResponses.stressLevel,
        screenTime: schema.surveyResponses.screenTime,
        socialActivity: schema.surveyResponses.socialActivity,
        productivity: schema.surveyResponses.productivity,
        moodRating: schema.surveyResponses.moodRating,
        caffeineIntake: schema.surveyResponses.caffeineIntake,
        petAffinity: schema.surveyResponses.petAffinity,
        musicVolume: schema.surveyResponses.musicVolume,
        chaosEnergy: schema.surveyResponses.chaosEnergy,
        pizzaOpinion: schema.surveyResponses.pizzaOpinion,
        optimism: schema.surveyResponses.optimism,
        decision: schema.surveyResponses.decision,
        homeworkStress: schema.surveyResponses.homeworkStress,
        socialBattery: schema.surveyResponses.socialBattery,
      })
      .from(schema.surveyResponses);

    // Show correlations even with just 1 response
    if (responses.length < 1) {
      return [];
    }

    // Transform data for correlation calculation
    const dataByVariable: Record<string, (number | null)[]> = {
      sleepHours: [],
      exerciseFrequency: [],
      stressLevel: [],
      screenTime: [],
      socialActivity: [],
      productivity: [],
      moodRating: [],
      caffeineIntake: [],
      petAffinity: [],
      musicVolume: [],
      chaosEnergy: [],
      pizzaOpinion: [],
      optimism: [],
      decision: [],
      homeworkStress: [],
      socialBattery: [],
    };

    for (const response of responses) {
      dataByVariable.sleepHours.push(response.sleepHours);
      dataByVariable.exerciseFrequency.push(response.exerciseFrequency);
      dataByVariable.stressLevel.push(response.stressLevel);
      dataByVariable.screenTime.push(response.screenTime);
      dataByVariable.socialActivity.push(response.socialActivity);
      dataByVariable.productivity.push(response.productivity);
      dataByVariable.moodRating.push(response.moodRating);
      dataByVariable.caffeineIntake.push(response.caffeineIntake);
      dataByVariable.petAffinity.push(response.petAffinity);
      dataByVariable.musicVolume.push(response.musicVolume);
      dataByVariable.chaosEnergy.push(response.chaosEnergy);
      dataByVariable.pizzaOpinion.push(response.pizzaOpinion);
      dataByVariable.optimism.push(response.optimism);
      dataByVariable.decision.push(response.decision);
      dataByVariable.homeworkStress.push(response.homeworkStress);
      dataByVariable.socialBattery.push(response.socialBattery);
    }

    // Calculate all pairwise correlations
    const correlations = calculateAllCorrelations(dataByVariable);

    // Return top 5 most correlated pairs
    return correlations.slice(0, 5);
  } catch (error) {
    console.error('Error calculating correlations:', error);
    return [];
  }
}

export async function getTotalResponses(): Promise<number> {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.surveyResponses);
    
    return Number(result[0]?.count) || 0;
  } catch (error) {
    console.error('Error getting total responses:', error);
    return 0;
  }
}
