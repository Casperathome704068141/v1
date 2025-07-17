
'use server';
/**
 * @fileOverview Finds and suggests colleges based on user criteria.
 *
 * - findColleges - A function that initiates the college finding process.
 * - FindCollegesInput - The input type for the findColleges function.
 * - FindCollegesOutput - The return type for the findColleges function.
 */

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

  return { colleges: filteredColleges }; // Return all matching colleges
}
