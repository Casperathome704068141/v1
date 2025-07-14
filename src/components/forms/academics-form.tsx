
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import { PlusCircle, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useApplication } from "@/context/application-context";

const educationHistorySchema = z.object({
  institutionName: z.string().min(1, "Institution name is required."),
  cityCountry: z.string().min(1, "City and country are required."),
  program: z.string().min(1, "Program or degree is required."),
  credential: z.string().min(1, "Please select a credential."),
  startDate: z.string().min(1, "Start date is required."), // Using string for month/year picker simplicity
  endDate: z.string().min(1, "End date is required."),
  graduated: z.enum(["yes", "no"], { required_error: "Please select an option." }),
  ecaCompleted: z.enum(["yes", "no"]).optional(),
});

const employmentHistorySchema = z.object({
  employer: z.string().min(1, "Employer name is required."),
  position: z.string().min(1, "Position/title is required."),
  cityCountry: z.string().min(1, "City and country is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
  time: z.string().min(1, "Please select full-time or part-time."),
});

const academicsSchema = z.object({
  educationHistory: z.array(educationHistorySchema),
  employmentHistory: z.array(employmentHistorySchema),
});

export type AcademicsFormValues = z.infer<typeof academicsSchema>;

interface AcademicsFormProps {
  onSave: () => void;
}

export function AcademicsForm({ onSave }: AcademicsFormProps) {
  const { applicationData, updateStepData } = useApplication();
  
  const form = useForm<AcademicsFormValues>({
    resolver: zodResolver(academicsSchema),
    defaultValues: applicationData.academics,
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: form.control,
    name: "educationHistory",
  });

  const { fields: employmentFields, append: appendEmployment, remove: removeEmployment } = useFieldArray({
    control: form.control,
    name: "employmentHistory",
  });

  const watchEducationHistory = form.watch("educationHistory");

  function onSubmit(data: AcademicsFormValues) {
    updateStepData('academics', data);
    toast({
      title: "Academics Saved!",
      description: "Your academic and work history has been successfully saved.",
    });
    onSave();
  }

  return (
    <Form {...form}>
      <form id="form-academics" onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Academic &amp; Work History</CardTitle>
          <CardDescription>Provide your education and employment history for the last 10 years.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Education History Section */}
          <div>
            <h3 className="text-lg font-medium">Education History</h3>
            <Separator className="my-4" />
            {educationFields.map((field, index) => (
              <div key={field.id} className="space-y-6 rounded-md border p-4 mb-4 relative">
                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeEducation(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name={`educationHistory.${index}.institutionName`} render={({ field }) => (
                        <FormItem><FormLabel>Institution Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`educationHistory.${index}.cityCountry`} render={({ field }) => (
                        <FormItem><FormLabel>City, Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name={`educationHistory.${index}.program`} render={({ field }) => (
                        <FormItem><FormLabel>Program/Degree</FormLabel><FormControl><Input placeholder="e.g. BSc Computer Science" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`educationHistory.${index}.credential`} render={({ field }) => (
                        <FormItem><FormLabel>Credential Earned</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select credential" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="diploma">Diploma</SelectItem>
                                <SelectItem value="certificate">Certificate</SelectItem>
                                <SelectItem value="bachelors">Bachelors</SelectItem>
                                <SelectItem value="masters">Masters</SelectItem>
                                <SelectItem value="phd">PhD</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name={`educationHistory.${index}.startDate`} render={({ field }) => (
                        <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input placeholder="MM/YYYY" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`educationHistory.${index}.endDate`} render={({ field }) => (
                        <FormItem><FormLabel>End Date</FormLabel><FormControl><Input placeholder="MM/YYYY" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name={`educationHistory.${index}.graduated`} render={({ field }) => (
                        <FormItem><FormLabel>Graduated?</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage /></FormItem>
                    )} />
                    {watchEducationHistory[index]?.graduated === 'yes' && (
                        <FormField control={form.control} name={`educationHistory.${index}.ecaCompleted`} render={({ field }) => (
                            <FormItem><FormLabel>Have you completed an ECA for this credential?</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage /></FormItem>
                        )} />
                    )}
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendEducation({ institutionName: '', cityCountry: '', program: '', credential: '', startDate: '', endDate: '', graduated: 'no' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Education
            </Button>
          </div>

          {/* Employment History Section */}
          <div className="mt-8">
            <h3 className="text-lg font-medium">Employment History</h3>
            <Separator className="my-4" />
            {employmentFields.map((field, index) => (
              <div key={field.id} className="space-y-6 rounded-md border p-4 mb-4 relative">
                 <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeEmployment(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name={`employmentHistory.${index}.employer`} render={({ field }) => (
                        <FormItem><FormLabel>Employer/Organization</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`employmentHistory.${index}.position`} render={({ field }) => (
                        <FormItem><FormLabel>Position/Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name={`employmentHistory.${index}.cityCountry`} render={({ field }) => (
                        <FormItem><FormLabel>City, Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`employmentHistory.${index}.time`} render={({ field }) => (
                        <FormItem><FormLabel>Full-time or Part-time</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="full-time">Full-time</SelectItem>
                                <SelectItem value="part-time">Part-time</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name={`employmentHistory.${index}.startDate`} render={({ field }) => (
                        <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input placeholder="MM/YYYY" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`employmentHistory.${index}.endDate`} render={({ field }) => (
                        <FormItem><FormLabel>End Date</FormLabel><FormControl><Input placeholder="MM/YYYY or Present" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                 </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendEmployment({ employer: '', position: '', cityCountry: '', startDate: '', endDate: '', time: '' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Employment
            </Button>
          </div>
        </CardContent>
        {/* The footer with buttons is in the parent page.tsx */}
      </form>
    </Form>
  );
}
