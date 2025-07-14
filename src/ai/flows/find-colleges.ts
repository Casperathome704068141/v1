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
  return findCollegesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findCollegesPrompt',
  input: { schema: FindCollegesInputSchema },
  output: { schema: FindCollegesOutputSchema },
  prompt: `You are an expert on Canadian Designated Learning Institutions (DLIs). Your task is to generate a list of 20 diverse and realistic colleges and universities in Canada that are suitable for international students.

  The user's preferences are:
  - Province: {{{province}}}
  - Program Type: {{{programType}}}
  - Maximum Annual Tuition: \${{{maxTuition}}} CAD

  CRITERIA FOR GENERATION:
  1.  **Diversity**: Include a mix of universities and colleges. Include institutions from various provinces, unless a specific province is requested.
  2.  **Realism**: Ensure PGWP and SDS eligibility are accurate (most public colleges/universities are). Use realistic tuition ranges for international students.
  3.  **Formatting**:
      - For the 'image' field, ALWAYS use 'https://placehold.co/600x400.png'.
      - For the 'aiHint' field, provide one or two relevant keywords (e.g., 'modern campus', 'historic building').
      - For 'programs', list 3-4 popular programs for international students at that institution.
      - For 'province', use the 2-letter abbreviation (e.g., ON, BC, QC).

  Generate a list of exactly 20 institutions now based on these criteria.
  `,
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
