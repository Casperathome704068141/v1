
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock, Star, Zap } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'
];


function AppointmentsContent() {
  const { profile, loading } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <Skeleton className="h-72 w-full md:col-span-1" />
           <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {Array.from({length: 12}).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
              <Skeleton className="h-12 w-full" />
           </div>
        </CardContent>
      </Card>
    )
  }

  const userPlan = profile?.plan?.toLowerCase();
  const hasAccess = userPlan === 'advantage' || userPlan === 'elite';

  if (!hasAccess) {
    return (
        <Card className="text-center">
            <CardHeader>
                <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-4">
                    <Star className="h-8 w-8" />
                </div>
                <CardTitle>Upgrade to Book Consultations</CardTitle>
                <CardDescription className="max-w-md mx-auto">
                    1-on-1 consultations with our RCICs are an exclusive feature of our Advantage and Elite plans. Upgrade your plan to unlock this feature and get expert guidance.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button asChild size="lg" className="w-full">
                    <Link href="/pricing">
                        <Zap className="mr-2 h-4 w-4" />
                        View Pricing Plans
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Your 1-on-1 Session</CardTitle>
        <CardDescription>
          Select a date and time to meet with one of our Regulated Canadian Immigration Consultants (RCIC).
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
           <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        <div className="md:col-span-2">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Available Times on {date ? date.toLocaleDateString() : 'selected date'}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {timeSlots.map(time => (
              <Button 
                key={time}
                variant={selectedTime === time ? 'default' : 'outline'}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
          <Button className="mt-8 w-full" size="lg" disabled={!date || !selectedTime}>
            Confirm Appointment for {date?.toLocaleDateString()} at {selectedTime}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


export default function AppointmentsPage() {
  return (
    <AppLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Book a Consultation</h1>
        </div>
        <AppointmentsContent />
      </main>
    </AppLayout>
  );
}
