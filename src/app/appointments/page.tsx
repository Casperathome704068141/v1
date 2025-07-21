
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Send, Zap } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const appointmentRequestSchema = z.object({
  requestedDate: z.date({
    required_error: "A date for the appointment is required.",
  }),
  requestedTime: z.string().min(1, "Please select a preferred time block."),
  topic: z.string().min(10, "Please briefly describe the topic (min. 10 characters).").max(500),
});

type AppointmentRequestValues = z.infer<typeof appointmentRequestSchema>;

function AppointmentRequestForm() {
  const { user, profile } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<AppointmentRequestValues>({
    resolver: zodResolver(appointmentRequestSchema),
  });

  async function onSubmit(data: AppointmentRequestValues) {
    if (!user || !profile) {
      toast({ variant: "destructive", title: "Not Logged In", description: "You must be logged in to request an appointment." });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "appointments"), {
        userId: user.uid,
        userName: profile.name,
        userEmail: profile.email,
        requestedDate: format(data.requestedDate, 'PPP'), // Store as a readable string
        requestedTime: data.requestedTime,
        topic: data.topic,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Request Sent!",
        description: "Your appointment request has been submitted. We will confirm shortly.",
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Appointment request failed:", error);
      toast({ variant: "destructive", title: "Submission Failed", description: "Could not submit your request. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
        <div className="text-center py-10">
            <CardTitle className="text-2xl">Thank You!</CardTitle>
            <p className="text-muted-foreground mt-2">Your request has been received. You can check the status on your dashboard.</p>
            <Button asChild className="mt-6">
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
        </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="requestedDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Requested Date</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="requestedTime"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Preferred Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a time block" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Morning (9am - 12pm EST)">Morning (9am - 12pm EST)</SelectItem>
                            <SelectItem value="Afternoon (1pm - 5pm EST)">Afternoon (1pm - 5pm EST)</SelectItem>
                            <SelectItem value="Evening (5pm - 8pm EST)">Evening (5pm - 8pm EST)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What would you like to discuss?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., 'I have a question about my proof of funds documents.' or 'I would like to discuss my Statement of Purpose.'"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting ? 'Submitting...' : 'Send Request'}
            <Send className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}

function AppointmentsContent() {
  const { profile, loading: userLoading } = useUser();

  if (userLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardHeader>
        <CardContent><Skeleton className="h-72 w-full" /></CardContent>
      </Card>
    );
  }

  const userPlan = profile?.plan?.toLowerCase();
  const hasAccess = userPlan === 'advantage' || userPlan === 'elite';

  if (!hasAccess) {
    return (
        <Card className="text-center">
            <CardHeader>
                <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-4"><Zap className="h-8 w-8" /></div>
                <CardTitle>Upgrade to Book Consultations</CardTitle>
                <CardDescription className="max-w-md mx-auto">1-on-1 consultations with our RCICs are an exclusive feature of our Advantage and Elite plans. Upgrade your plan to unlock this feature.</CardDescription>
            </CardHeader>
            <CardFooter><Button asChild size="lg" className="w-full"><Link href="/billing">View Pricing Plans</Link></Button></CardFooter>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request a 1-on-1 Session</CardTitle>
        <CardDescription>Select your preferred date and time to meet with one of our Regulated Canadian Immigration Consultants (RCIC). We will confirm your booking via email.</CardDescription>
      </CardHeader>
      <CardContent>
          <AppointmentRequestForm />
      </CardContent>
    </Card>
  )
}

export default function AppointmentsPage() {
  return (
    <AppLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Request a Consultation</h1>
        </div>
        <AppointmentsContent />
      </main>
    </AppLayout>
  );
}
