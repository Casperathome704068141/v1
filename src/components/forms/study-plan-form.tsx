
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { WandSparkles } from "lucide-react";
import { Separator } from "../ui/separator";
import { useApplication } from "@/context/application-context";

const studyPlanSchema = z.object({
  programChoice: z.string().min(1, "Program choice is required.").optional(),
  whyInstitution: z.string().min(150, { message: "Please provide a detailed answer of at least 150 words." }).optional(),
  howProgramFitsCareer: z.string().min(150, { message: "Please provide a detailed answer of at least 150 words." }).optional(),
  longTermGoals: z.string().optional(),
  studyPlanDraft: z.string().optional(),
});

export type StudyPlanFormValues = z.infer<typeof studyPlanSchema>;

interface StudyPlanFormProps {
  onSave: () => void;
}

export function StudyPlanForm({ onSave }: StudyPlanFormProps) {
  const { applicationData, updateStepData } = useApplication();

  const form = useForm<StudyPlanFormValues>({
    resolver: zodResolver(studyPlanSchema),
    defaultValues: {
      ...applicationData.studyPlan,
      programChoice: "Diploma in Business Management - Seneca College", // This would be dynamic
    },
  });

  function onSubmit(data: StudyPlanFormValues) {
    updateStepData('studyPlan', data);
    toast({
      title: "Study Plan Saved!",
      description: "Your study plan information has been successfully saved.",
    });
    onSave();
  }

  return (
    <Form {...form}>
      <form id="form-plan" onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Study Plan</CardTitle>
          <CardDescription>Explain why you chose this program and how it fits your goals. This is a critical part of your application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="programChoice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Choice</FormLabel>
                  <FormControl>
                    <Input readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whyInstitution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why did you choose this institution and program?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain your reasons. Consider factors like the school's reputation, specific courses, faculty, location, and how it aligns with your academic background."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="howProgramFitsCareer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How does this program fit into your future career plans?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your career goals after graduation and how this program will equip you with the necessary skills and knowledge. Emphasize how you will apply this learning back in your home country."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longTermGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What are your long-term goals? (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe where you see yourself in 5-10 years. This can help strengthen your Statement of Purpose."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
             <div>
                <FormLabel>Study Plan Draft (SOP)</FormLabel>
                 <div className="flex items-center justify-between mt-2 mb-2">
                    <CardDescription>
                        We'll use your answers to generate a draft. You can edit it below or use our AI assistant.
                    </CardDescription>
                    <Button type="button" variant="outline" size="sm">
                        <WandSparkles className="mr-2 h-4 w-4" /> AI Assist
                    </Button>
                </div>
                <FormField
                control={form.control}
                name="studyPlanDraft"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Textarea
                        placeholder="Your auto-generated Statement of Purpose will appear here..."
                        className="min-h-[300px]"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        </CardContent>
      </form>
    </Form>
  );
}
