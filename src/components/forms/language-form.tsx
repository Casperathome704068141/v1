
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useApplication } from "@/context/application-context";
import { useEffect } from "react";

const twoYearsAgo = new Date();
twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

const languageSchema = z.object({
  testTaken: z.string({ required_error: "Please select a test." }),
  testPlanning: z.string().optional(),
  testDate: z.date().optional(),
  overallScore: z.string().optional(),
  listening: z.string().optional(),
  reading: z.string().optional(),
  writing: z.string().optional(),
  speaking: z.string().optional(),
}).refine(data => {
    if (data.testTaken !== 'none' && !data.testDate) {
        return false;
    }
    return true;
}, {
    message: "Test date is required.",
    path: ["testDate"],
});


export type LanguageFormValues = z.infer<typeof languageSchema>;

const languageTestOptions = [
    { value: 'ielts', label: 'IELTS' },
    { value: 'toefl', label: 'TOEFL' },
    { value: 'pte', label: 'PTE' },
    { value: 'duolingo', label: 'Duolingo' },
    { value: 'tef', label: 'TEF' },
    { value: 'delf_dalf', label: 'DELF/DALF' },
    { value: 'none', label: 'None' },
];

interface LanguageFormProps {
  onSave: () => void;
}

export function LanguageForm({ onSave }: LanguageFormProps) {
  const { applicationData, updateStepData, isLoaded } = useApplication();
  
  const defaultValues = {
      testTaken: 'none',
      testPlanning: '',
      testDate: undefined,
      overallScore: '',
      listening: '',
      reading: '',
      writing: '',
      speaking: '',
  };

  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: defaultValues
  });
  
  useEffect(() => {
    if (isLoaded) {
      const langData = applicationData.language || {};
      form.reset({
        ...defaultValues,
        ...langData,
        testDate: langData.testDate ? new Date(langData.testDate) : undefined,
      });
    }
  }, [isLoaded, applicationData.language, form]);

  const watchTestTaken = form.watch("testTaken");

  function onSubmit(data: LanguageFormValues) {
    updateStepData('language', data);
    toast({
      title: "Language Info Saved!",
      description: "Your language proficiency information has been successfully saved.",
    });
    onSave();
  }

  return (
    <Form {...form}>
      <form id="form-language" onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Language Proficiency</CardTitle>
          <CardDescription>Confirm your official language ability.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <FormField
                control={form.control}
                name="testTaken"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Test Taken</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a test" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {languageTestOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>If you haven't taken a test yet, select "None".</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />

            {watchTestTaken === 'none' && (
                 <FormField
                    control={form.control}
                    name="testPlanning"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Which test do you plan to take?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a test" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {languageTestOptions.filter(o => o.value !== 'none').map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            
            {watchTestTaken !== 'none' && (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="testDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Test Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(new Date(field.value), "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                captionLayout="dropdown-buttons"
                                fromYear={new Date().getFullYear() - 2}
                                toYear={new Date().getFullYear()}
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date > new Date() || date < twoYearsAgo
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormDescription>Must be within the last 2 years.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                        control={form.control}
                        name="overallScore"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Overall Score / CLB Level</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 7.0 or CLB 8" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <FormField
                        control={form.control}
                        name="listening"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Listening</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 7.5" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="reading"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Reading</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 6.5" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="writing"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Writing</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 6.0" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="speaking"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Speaking</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 7.0" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                </>
            )}
        </CardContent>
      </form>
    </Form>
  );
}
