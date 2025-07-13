// src/ai/flows/generate-sop-draft.ts
'use server';
/**
 * @fileOverview Generates a draft Statement of Purpose (SOP) for a student's study permit application.
 *
 * - generateSopDraft - A function that initiates the SOP generation process.
 * - GenerateSopDraftInput - The input type for the generateSopDraft function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSopDraftInputSchema = z.object({
  personalInfo: z.string().describe("JSON string of the student's personal information."),
  academics: z.string().describe("JSON string of the student's academic and work history."),
  studyPlan: z.string().describe("JSON string of the student's study plan details, including program choice and reasons."),
  finances: z.string().describe("JSON string of the student's financial details."),
  longTermGoals: z.string().optional().describe("Student's long-term goals after completing their studies."),
});
export type GenerateSopDraftInput = z.infer<typeof GenerateSopDraftInputSchema>;

export async function generateSopDraft(input: GenerateSopDraftInput) {
    const { stream, response } = generateSopDraftFlow(input);

    // Stream the output back to the client
    return new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                controller.enqueue(chunk.output || '');
            }
            controller.close();
        },
    });
}


const prompt = ai.definePrompt({
  name: 'generateSopDraftPrompt',
  input: { schema: GenerateSopDraftInputSchema },
  prompt: `You are an expert Canadian immigration consultant specializing in study permit applications. Your task is to write a compelling, well-structured, and personalized Statement of Purpose (SOP) for a student.

  The SOP must be convincing to a Canadian visa officer. It should clearly articulate the student's background, why they have chosen their specific program and institution in Canada, how it aligns with their career goals, and their strong ties to their home country, indicating their intent to return after their studies.

  Use the following JSON data to draft the SOP. Address it to the "Visa Officer, High Commission of Canada".

  **Student's Personal Information:**
  {{{personalInfo}}}

  **Student's Academic & Work History:**
  {{{academics}}}

  **Student's Chosen Program and Rationale:**
  {{{studyPlan}}}

  **Student's Financial Situation:**
  {{{finances}}}

  **Student's Long-Term Goals:**
  {{#if longTermGoals}}
  {{{longTermGoals}}}
  {{else}}
  The student has not specified long-term goals. Emphasize their intent to apply their new skills and education back in their home country.
  {{/if}}

  **SOP Structure:**

  1.  **Introduction:**
      - State the purpose of the letter: to apply for a Canadian Study Permit.
      - Mention the chosen program and institution.

  2.  **Academic & Professional Background:**
      - Briefly summarize academic qualifications and any relevant work experience.
      - Connect past experiences to the decision to pursue the chosen program.

  3.  **Why this Program and Institution?**
      - Elaborate on the reasons provided for choosing this specific program and DLI. Mention specific courses, faculty, or features if possible.
      - Explain why studying in Canada is the best choice over their home country or other countries.

  4.  **Career Goals & Ties to Home Country:**
      - Clearly state future career plans upon returning to their home country.
      - Explain how the Canadian education will help them achieve these goals.
      - THIS IS CRITICAL: Emphasize strong financial, family, and professional ties to their home country. This shows the visa officer they have compelling reasons to leave Canada after their studies. Mention their family (parents, spouse, children) residing in the home country.

  5.  **Financial Support:**
      - Briefly state how they will fund their education and living expenses, referencing their provided financial details. Mention sponsors if applicable.

  6.  **Conclusion:**
      - Reiterate their intention to respect the terms of the study permit and return home after completing their studies.
      - Thank the visa officer for their time and consideration.

  **Tone:**
  - Professional, formal, and respectful.
  - Confident and clear.
  - Avoid emotional or overly casual language.

  Begin writing the SOP now.
  `,
});

const generateSopDraftFlow = ai.defineFlow(
  {
    name: 'generateSopDraftFlow',
    inputSchema: GenerateSopDraftInputSchema,
    outputSchema: z.string(),
    stream: true,
  },
  async (input) => {
    const llmResponse = await prompt(input);
    return llmResponse;
  }
);
