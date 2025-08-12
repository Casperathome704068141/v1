
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Send, Zap, CheckCircle, Rocket } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const appointmentRequestSchema = z.object({
  requestedDate: z.date({ required_error: "Please select a date." }),
  requestedTime: z.string().min(1, "Please select a time."),
  topic: z.string().min(15, "Please provide more details.").max(500),
});

type AppointmentRequestValues = z.infer<typeof appointmentRequestSchema>;

function generateTimeSlots() {
  const slots = [];
  const startTime = new Date();
  startTime.setHours(9, 0, 0, 0); 
  const endTime = new Date();
  endTime.setHours(17, 0, 0, 0);

  while (startTime < endTime) {
    slots.push(startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    startTime.setMinutes(startTime.getMinutes() + 30);
  }
  return slots;
};

const AppointmentRequestForm = () => {
  const { user, profile } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<AppointmentRequestValues>({
    resolver: zodResolver(appointmentRequestSchema),
    defaultValues: { topic: "" }
  });

  async function onSubmit(data: AppointmentRequestValues) {
    if (!user || !profile) { return; }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "appointments"), {
        userId: user.uid,
        userName: profile.name,
        userEmail: profile.email,
        requestedDate: format(data.requestedDate, 'PPP'),
        requestedTime: data.requestedTime,
        topic: data.topic,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setIsSubmitted(true);
    } catch (error) {
      toast({ variant: "destructive", title: "Submission Failed" });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
        <div className="text-center py-12 flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green mb-4" />
            <h2 className="text-2xl font-display">Request Sent!</h2>
            <p className="text-slateMuted mt-2 max-w-sm">Your appointment request has been submitted. We'll confirm via email and on your dashboard shortly.</p>
            <Button asChild className="mt-6 bg-blue hover:bg-blue/90">
                <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
        </div>
    );
  }

  return (
    <Card className="bg-surface1 border-white/10">
      <CardHeader>
        <CardTitle className="font-display">Request a 1-on-1 Session</CardTitle>
        <CardDescription className="text-slateMuted">Select a date and time to meet with one of our Regulated Canadian Immigration Consultants (RCIC).</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="requestedDate" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover><PopoverTrigger asChild><FormControl>
                    <Button variant={"outline"} className={cn("bg-surface2 border-white/10", !field.value && "text-slateMuted")}>
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date() || date < new Date("1900-01-01")} initialFocus />
                  </PopoverContent></Popover>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="requestedTime" render={({ field }) => (
                <FormItem><FormLabel>Time (EST)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="bg-surface2 border-white/10"><SelectValue placeholder="Select a time slot" /></SelectTrigger></FormControl>
                    <SelectContent>{generateTimeSlots().map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="topic" render={({ field }) => (
              <FormItem><FormLabel>Discussion Topic</FormLabel>
                <FormControl><Textarea className="bg-surface2 border-white/10" placeholder="e.g., 'I have a question about my proof of funds documents.'" {...field} /></FormControl>
                <FormDescription className="text-slateMuted">Briefly describe what you'd like to discuss.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full bg-red hover:bg-red/90">
              {isSubmitting ? 'Submitting...' : 'Send Request'} <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const UpgradePrompt = () => (
    <Card className="text-center overflow-hidden bg-surface1 border-white/10">
        <div className="bg-blue/10 py-8">
             <div className="mx-auto bg-blue text-white p-4 rounded-full w-fit"><Rocket className="h-10 w-10" /></div>
        </div>
        <CardHeader className="pt-6">
            <CardTitle className="font-display">Unlock 1-on-1 Consultations</CardTitle>
            <CardDescription className="text-slateMuted max-w-md mx-auto !mt-2">
                Our Advantage and Elite plans include exclusive access to personalized sessions with our certified immigration consultants.
            </CardDescription>
        </CardHeader>
        <CardFooter>
            <Button asChild size="lg" className="w-full bg-blue hover:bg-blue/90">
                <Link href="/billing">Upgrade Your Plan <Zap className="ml-2 h-4 w-4" /></Link>
            </Button>
        </CardFooter>
    </Card>
);

const AppointmentsContent = () => {
  const { profile, loading: userLoading } = useUser();

  if (userLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  const userPlan = profile?.plan?.toLowerCase();
  return userPlan === 'advantage' || userPlan === 'elite' ? <AppointmentRequestForm /> : <UpgradePrompt />;
}

export default function AppointmentsPage() {
  return (
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-display tracking-tight">Book a Consultation</h1>
          <p className="text-slateMuted">Get expert advice from our immigration specialists.</p>
        </div>
        <AppointmentsContent />
      </main>
  );
}
