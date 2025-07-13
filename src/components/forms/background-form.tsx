
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useApplication } from "@/context/application-context";

const backgroundSchema = z.object({
  visaRefusal: z.enum(["yes", "no"], { required_error: "This field is required." }).optional(),
  visaRefusalDetails: z.string().optional(),
  criminalRecord: z.enum(["yes", "no"], { required_error: "This field is required." }).optional(),
  criminalRecordDetails: z.string().optional(),
  medicalConditions: z.enum(["yes", "no"], { required_error: "This field is required." }).optional(),
  medicalConditionsDetails: z.string().optional(),
  refugeeClaim: z.enum(["yes", "no"], { required_error: "This field is required." }).optional(),
  refugeeClaimDetails: z.string().optional(),
  deportation: z.enum(["yes", "no"], { required_error: "This field is required." }).optional(),
  deportationDetails: z.string().optional(),
  overstay: z.enum(["yes", "no"], { required_error: "This field is required." }).optional(),
  overstayDetails: z.string().optional(),
  certification: z.boolean().refine(val => val === true, {
    message: "You must certify that the information provided is true and complete.",
  }),
}).refine(data => data.visaRefusal === 'no' || (data.visaRefusal === 'yes' && data.visaRefusalDetails), {
  message: "Please provide details about the visa refusal.",
  path: ["visaRefusalDetails"],
}).refine(data => data.criminalRecord === 'no' || (data.criminalRecord === 'yes' && data.criminalRecordDetails), {
  message: "Please provide details about your criminal record.",
  path: ["criminalRecordDetails"],
}).refine(data => data.medicalConditions === 'no' || (data.medicalConditions === 'yes' && data.medicalConditionsDetails), {
    message: "Please describe your medical condition.",
    path: ["medicalConditionsDetails"],
}).refine(data => data.refugeeClaim === 'no' || (data.refugeeClaim === 'yes' && data.refugeeClaimDetails), {
    message: "Please provide details about the refugee claim.",
    path: ["refugeeClaimDetails"],
}).refine(data => data.deportation === 'no' || (data.deportation === 'yes' && data.deportationDetails), {
    message: "Please provide details about the deportation or removal.",
    path: ["deportationDetails"],
}).refine(data => data.overstay === 'no' || (data.overstay === 'yes' && data.overstayDetails), {
    message: "Please provide details about the overstay.",
    path: ["overstayDetails"],
});

export type BackgroundFormValues = z.infer<typeof backgroundSchema>;

const backgroundQuestions = [
    { name: 'visaRefusal', details: 'visaRefusalDetails', label: 'Have you ever been refused a visa or permit for Canada or any other country, or denied entry to any country?' },
    { name: 'criminalRecord', details: 'criminalRecordDetails', label: 'Do you have any criminal record or charges pending in any country?' },
    { name: 'medicalConditions', details: 'medicalConditionsDetails', label: 'Do you have a serious medical condition?' },
    { name: 'refugeeClaim', details: 'refugeeClaimDetails', label: 'Have you ever claimed refugee/asylum status or applied for humanitarian protection?' },
    { name: 'deportation', details: 'deportationDetails', label: 'Have you ever been deported or removed from any country?' },
    { name: 'overstay', details: 'overstayDetails', label: 'Have you ever overstayed a visa or remained in a country beyond your authorized stay?' },
] as const;

interface BackgroundFormProps {
  onSave: () => void;
}

export function BackgroundForm({ onSave }: BackgroundFormProps) {
  const { applicationData, updateStepData } = useApplication();
  
  const form = useForm<BackgroundFormValues>({
    resolver: zodResolver(backgroundSchema),
    defaultValues: applicationData.background,
  });

  const watchFields = form.watch();

  function onSubmit(data: BackgroundFormValues) {
    updateStepData('background', data);
    toast({
      title: "Background Info Saved!",
      description: "Your background and security information has been saved.",
    });
    onSave();
  }

  return (
    <Form {...form}>
      <form id="form-background" onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Background & Security</CardTitle>
          <CardDescription>Answer these questions honestly. Any "Yes" requires an explanation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            {backgroundQuestions.map(q => (
                <div key={q.name}>
                    <FormField
                        control={form.control}
                        name={q.name}
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>{q.label}</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    {watchFields[q.name] === 'yes' && (
                        <FormField
                            control={form.control}
                            name={q.details}
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                <FormLabel>Please provide details</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Explain the circumstances, including country, date, and reason."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>
            ))}

            <FormField
                control={form.control}
                name="certification"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-8">
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                        Declaration & Consent
                        </FormLabel>
                        <FormDescription>
                        I certify that the information provided is true, complete, and correct to the best of my knowledge.
                        </FormDescription>
                         <FormMessage />
                    </div>
                    </FormItem>
                )}
             />
        </CardContent>
      </form>
    </Form>
  );
}
