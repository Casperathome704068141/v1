
'use server';
/**
 * @fileOverview Finds and suggests colleges based on user criteria.
 *
 * - findColleges - A function that initiates the college finding process.
 * - FindCollegesInput - The input type for the findColleges function.
 * - FindCollegesOutput - The return type for the findColleges function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { collegeData } from '@/lib/college-data';

const CollegeSchema = z.object({
  dliNumber: z.string().describe("The Designated Learning Institution (DLI) number."),
  name: z.string().describe("The name of the college or university."),
  province: z.string().describe("The 2-letter abbreviation for the province (e.g., ON, BC)."),
  city: z.string().describe("The city where the main campus is located."),
  pgwpEligible: z.boolean().describe("Whether the institution is eligible for the Post-Graduation Work Permit program."),
  sdsEligible: z.boolean().describe("Whether the institution is eligible for the Student Direct Stream (SDS)."),
  tuitionLow: z.number().describe("The low-end estimate for annual international tuition fees."),
  tuitionHigh: z.number().describe("The high-end estimate for annual international tuition fees."),
  image: z.string().describe("A placeholder image URL from placehold.co, formatted as https://placehold.co/600x400.png."),
  aiHint: z.string().describe("One or two keywords for the placeholder image (e.g., 'university campus')."),
  programs: z.array(z.string()).describe("A list of 3-4 popular or relevant programs offered."),
});

const FindCollegesInputSchema = z.object({
  province: z.string().describe("The selected province filter ('all' for no preference)."),
  programType: z.string().describe("The selected program type filter (e.g., 'undergraduate', 'all')."),
  maxTuition: z.number().describe("The maximum annual tuition budget for the student."),
});
export type FindCollegesInput = z.infer<typeof FindCollegesInputSchema>;

const FindCollegesOutputSchema = z.object({
  colleges: z.array(CollegeSchema),
});
export type FindCollegesOutput = z.infer<typeof FindCollegesOutputSchema>;

export async function findColleges(input: FindCollegesInput): Promise<FindCollegesOutput> {
  // Perform filtering directly in code instead of using AI
  const filteredColleges = collegeData.filter(college => {
    const provinceMatch = input.province === 'all' || college.province === input.province;
    const tuitionMatch = college.tuitionHigh <= input.maxTuition;
    // Program type filtering is not implemented in the data, so we ignore it for now.
    return provinceMatch && tuitionMatch;
  });

  return { colleges: filteredColleges.slice(0, 50) }; // Return up to 50 matches
}

// The AI-based flow is no longer needed for simple filtering.
// We keep the Genkit schema definitions for type safety but bypass the AI call.

/*
// This AI-based flow is deprecated in favor of direct filtering for performance and reliability.
const findCollegesSystemPrompt = `You are an expert on Canadian Designated Learning Institutions (DLIs). Your task is to act as a filter for a provided list of colleges.

You will be given a master list of colleges and the user's preferences. You must return a subset of this list, formatted exactly like the input, containing only the colleges that are a good match for the user.

User Preferences:
- Province: {{{province}}}
- Program Type: {{{programType}}} (Note: For now, you can ignore this as our data doesn't contain program types. Focus on province and tuition.)
- Maximum Annual Tuition: \${{{maxTuition}}} CAD

Filtering Criteria:
1.  **Province**: If the user specifies a province, only return colleges from that province. If they select 'all', consider all provinces.
2.  **Tuition**: The college's high-end tuition ('tuitionHigh') must be less than or equal to the user's maximum tuition budget.
3.  **Return Value**: You must only return colleges from the provided master list. Do not invent new colleges or modify the data. Return up to 20 matching colleges.

Here is the master list of colleges you must use as your source of truth:
${JSON.stringify(collegeData, null, 2)}
`;


const prompt = ai.definePrompt({
  name: 'findCollegesPrompt',
  input: { schema: FindCollegesInputSchema },
  output: { schema: FindCollegesOutputSchema },
  system: findCollegesSystemPrompt,
  prompt: `Based on the user preferences and the master list provided in the system instructions, please generate the list of matching colleges now.`
});

const findCollegesFlow = ai.defineFlow(
  {
    name: 'findCollegesFlow',
    inputSchema: FindCollegesInputSchema,
    outputSchema: FindCollegesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
*/
