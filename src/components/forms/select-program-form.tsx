'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import { useApplication } from '@/context/application-context';
import type { College } from '@/lib/college-data';

const selectProgramSchema = z.object({
  collegeName: z.string(),
  programOfChoice: z.string().min(5, "Please enter a valid program name."),
});

export type SelectProgramFormValues = z.infer<typeof selectProgramSchema>;

export function SelectProgramForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { updateCollegeAndProgram, applicationData } = useApplication();
    
    const selectedCollege: College | null = useMemo(() => {
        const collegeJson = searchParams.get('college');
        return collegeJson ? JSON.parse(decodeURIComponent(collegeJson)) : null;
    }, [searchParams]);

    const form = useForm<SelectProgramFormValues>({
        resolver: zodResolver(selectProgramSchema),
        defaultValues: {
            collegeName: selectedCollege?.name || '',
            programOfChoice: applicationData.studyPlan?.programChoice || '',
        },
    });

    useEffect(() => {
        if (selectedCollege) {
            form.setValue('collegeName', selectedCollege.name);
        }
    }, [selectedCollege, form]);

    if (!selectedCollege) {
        return <p className="text-destructive">No college selected. Please go back to the College Match page and select a college.</p>;
    }

    function onSubmit(data: SelectProgramFormValues) {
        updateCollegeAndProgram(selectedCollege!, data.programOfChoice);
        toast({
            title: "Study Plan Updated",
            description: `${data.programOfChoice} at ${selectedCollege?.name} has been set as your goal.`,
        });
        router.push('/dashboard');
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="collegeName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Selected College</FormLabel>
                            <FormControl>
                                <Input readOnly disabled {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="programOfChoice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Program of Choice</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Diploma in Business Management" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">Confirm and Continue</Button>
            </form>
        </Form>
    );
}