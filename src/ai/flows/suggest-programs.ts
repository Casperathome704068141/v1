'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestProgramsInputSchema = z.object({
  profile: z.string().describe('Summary of the student profile including goals and background.'),
});
export type SuggestProgramsInput = z.infer<typeof SuggestProgramsInputSchema>;

const SuggestProgramsOutputSchema = z.object({
  bridgingCourses: z.array(z.string()).describe('Short courses that help prepare the student for their main program.'),
  scholarships: z.array(z.string()).describe('Scholarships or funding options the student could explore.'),
});
export type SuggestProgramsOutput = z.infer<typeof SuggestProgramsOutputSchema>;

export async function suggestPrograms(input: SuggestProgramsInput): Promise<SuggestProgramsOutput> {
  return suggestProgramsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProgramsPrompt',
  input: { schema: SuggestProgramsInputSchema },
  output: { schema: SuggestProgramsOutputSchema },
  prompt: `You are an education consultant. Based on this student profile:\n{{{profile}}}\nSuggest up to three short bridging or preparatory courses that could strengthen their application. Also suggest up to three scholarship opportunities in Canada relevant to their background.`,
});

const suggestProgramsFlow = ai.defineFlow(
  {
    name: 'suggestProgramsFlow',
    inputSchema: SuggestProgramsInputSchema,
    outputSchema: SuggestProgramsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
