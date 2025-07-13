'use server';
/**
 * @fileOverview Generates a personalized action plan based on a user's study permit readiness quiz answers.
 *
 * - generateActionPlan - A function that initiates the action plan generation process.
 * - ActionPlanInput - The input type for the generateActionPlan function.
 * - ActionPlanOutput - The return type for the generateActionPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ActionPlanInputSchema = z.object({
  quizAnswers: z.string().describe('A JSON string representing the answers from the readiness quiz.'),
  sectionScores: z.string().describe('A JSON string of the scores for each section of the quiz.'),
});
export type ActionPlanInput = z.infer<typeof ActionPlanInputSchema>;

const ActionPlanOutputSchema = z.object({
  actionPlan: z.string().describe('A detailed, personalized action plan in Markdown format.'),
});
export type ActionPlanOutput = z.infer<typeof ActionPlanOutputSchema>;

export async function generateActionPlan(input: ActionPlanInput): Promise<ActionPlanOutput> {
  return generateActionPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateActionPlanPrompt',
  input: { schema: ActionPlanInputSchema },
  output: { schema: ActionPlanOutputSchema },
  prompt: `You are an expert and encouraging Canadian immigration consultant. A potential student has completed a "Study Permit Readiness Quiz" and their score indicates they need some improvement before they are ready to apply.

  Your task is to generate a personalized, step-by-step action plan based on their quiz answers and section scores. Focus on their lowest-scoring areas and provide specific, actionable advice. The tone should be positive and motivating, not discouraging.

  Here is the user's data:
  - Quiz Answers (JSON): {{{quizAnswers}}}
  - Section Scores (JSON): {{{sectionScores}}}

  Analyze the data to identify the key weaknesses. For example:
  - If their 'Finances' score is low, suggest tangible steps like securing a GIC, getting a tuition fee receipt, or documenting the source of funds from a sponsor.
  - If 'Language' is a weak point, recommend booking an IELTS/CELPIP test and aiming for a specific score (e.g., 6.0 in all bands).
  - If 'Study Plan Fit' is low, advise them on how to write a stronger Statement of Purpose that connects their past experience to their future goals in Canada.

  Structure your response as a Markdown document. Use headings for each major section that needs improvement (e.g., ## Strengthen Your Financial Profile). Use bullet points for clear, easy-to-follow steps.

  Begin the action plan with a positive opening, acknowledging the work they've already done. End with an encouraging closing statement.
  `,
});

const generateActionPlanFlow = ai.defineFlow(
  {
    name: 'generateActionPlanFlow',
    inputSchema: ActionPlanInputSchema,
    outputSchema: ActionPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
