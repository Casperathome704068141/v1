'use server';
/**
 * @fileOverview Finds and suggests colleges based on user criteria using an AI model.
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
  maxTuition: z.number().describe("The maximum annual tuition budget for the student."),
  fieldOfInterest: z.string().describe("The student's desired field of interest (e.g., 'Computer Science', 'Healthcare', 'Business')."),
});
export type FindCollegesInput = z.infer<typeof FindCollegesInputSchema>;

const FindCollegesOutputSchema = z.object({
  universities: z.array(CollegeSchema).describe("A list of the top 5 recommended universities."),
  colleges: z.array(CollegeSchema).describe("A list of the top 5 recommended colleges."),
});
export type FindCollegesOutput = z.infer<typeof FindCollegesOutputSchema>;

export async function findColleges(input: FindCollegesInput): Promise<FindCollegesOutput> {
  return findCollegesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findCollegesPrompt',
  input: { schema: z.object({ ...FindCollegesInputSchema.shape, allColleges: z.string() }) },
  output: { schema: FindCollegesOutputSchema },
  prompt: `You are an expert Canadian education consultant. Your task is to recommend the best Designated Learning Institutions (DLIs) for a student based on their preferences.

  Use the provided JSON list of all available DLIs as your source of truth. Do not invent any institutions.

  **Student's Preferences:**
  - **Province:** {{{province}}}
  - **Maximum Annual Tuition:** \${{{maxTuition}}} CAD
  - **Field of Interest:** {{{fieldOfInterest}}}

  **Instructions:**
  1.  Filter the provided DLI list based on the student's province (if specified) and maximum tuition.
  2.  From the filtered list, analyze the 'name' and 'programs' to determine which institutions are most relevant to the student's 'Field of Interest'.
  3.  Identify the top 5 most suitable **universities** and the top 5 most suitable **colleges**. A university often has "University" in its name. A college often has "College", "Polytechnic", or "Institute" in its name.
  4.  Return the results in the specified JSON output format, with separate lists for 'universities' and 'colleges'. Ensure you return the full, original data object for each selected DLI. If you cannot find 5 of each, return as many as you can find.

  **JSON list of all available DLIs:**
  {{{allColleges}}}
  `,
});


const findCollegesFlow = ai.defineFlow(
  {
    name: 'findCollegesFlow',
    inputSchema: FindCollegesInputSchema,
    outputSchema: FindCollegesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({
        ...input,
        allColleges: JSON.stringify(collegeData, null, 2),
    });
    return output!;
  }
);
