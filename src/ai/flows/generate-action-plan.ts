
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
  prompt: `
You are an admissions coach. Based on these quiz answers:
{{{quizAnswers}}}

Produce a concise action plan (under 200 words), formatted as 4 bullet points:
1. Strengths
2. Areas for Improvement
3. Next Step #1
4. Next Step #2
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
