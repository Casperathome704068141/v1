// src/ai/flows/college-match-reasoning.ts
'use server';
/**
 * @fileOverview Provides reasoning for college matching, explaining why certain DLIs are filtered out.
 *
 * - collegeMatchReasoning - A function that initiates the college match reasoning process.
 * - CollegeMatchReasoningInput - The input type for the collegeMatchReasoning function.
 * - CollegeMatchReasoningOutput - The return type for the collegeMatchReasoning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CollegeMatchReasoningInputSchema = z.object({
  profileDetails: z
    .string()
    .describe('Details of the student profile, including academic scores, financial situation, and program of interest.'),
  dliDetails: z
    .string()
    .describe('Details about the Designated Learning Institution (DLI), including location, programs offered, and admission criteria.'),
  filteringLogic: z.string().describe('The filtering logic applied to match students with DLIs.'),
});
export type CollegeMatchReasoningInput = z.infer<typeof CollegeMatchReasoningInputSchema>;

const CollegeMatchReasoningOutputSchema = z.object({
  reasoning: z
    .string()
    .describe('Explanation of why the DLI was filtered out based on the student profile and filtering logic.'),
});
export type CollegeMatchReasoningOutput = z.infer<typeof CollegeMatchReasoningOutputSchema>;

export async function collegeMatchReasoning(input: CollegeMatchReasoningInput): Promise<CollegeMatchReasoningOutput> {
  return collegeMatchReasoningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'collegeMatchReasoningPrompt',
  input: {schema: CollegeMatchReasoningInputSchema},
  output: {schema: CollegeMatchReasoningOutputSchema},
  prompt: `You are an AI assistant designed to help students understand why certain Designated Learning Institutions (DLIs) are filtered out during the college matching process.

  Given the following student profile details, DLI details, and filtering logic, explain why the DLI was filtered out for the student.

  Student Profile Details: {{{profileDetails}}}
DLI Details: {{{dliDetails}}}
Filtering Logic: {{{filteringLogic}}}

  Reasoning:`,
});

const collegeMatchReasoningFlow = ai.defineFlow(
  {
    name: 'collegeMatchReasoningFlow',
    inputSchema: CollegeMatchReasoningInputSchema,
    outputSchema: CollegeMatchReasoningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
