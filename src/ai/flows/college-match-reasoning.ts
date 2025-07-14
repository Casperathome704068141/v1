
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
    .describe('Details about the Designated Learning Institution (DLI), including location, programs offered, tuition, and admission criteria.'),
  filteringLogic: z.string().describe('The filtering logic applied to match students with DLIs.'),
  initialReasoning: z.string().describe('The initial, simple reason why the college was filtered out (e.g., "Tuition exceeds budget").')
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
  prompt: `You are an AI assistant for an education consulting firm. Your role is to provide clear, empathetic, and constructive feedback to students about why a college might not be a good match for them right now.

The student has been shown a list of recommended colleges, and this college was filtered out for the following reason:
**Initial Reason:** {{{initialReasoning}}}

Your task is to expand on this reason in a helpful and encouraging tone. Do not just repeat the reason. Explain what it means and suggest potential next steps.

**Student Profile Details:**
{{{profileDetails}}}

**DLI Details:**
{{{dliDetails}}}

**Filtering Logic Used:**
{{{filteringLogic}}}

Based on all this information, generate a short, helpful explanation (2-3 sentences).

**Example Scenarios:**
- If the reason is high tuition, you could say: "This university's estimated tuition is higher than the budget you've set. To make it a viable option, you could explore scholarship opportunities on their website or adjust your budget filters to see other excellent institutions that are a better financial fit."
- If the reason is a location mismatch, you could say: "This college is located in a province that wasn't included in your search filter. If you're open to exploring options across Canada, you can change the province filter to 'All Provinces' to see more great schools."

Now, generate the reasoning for this specific case.
`,
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
