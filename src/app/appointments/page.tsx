
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'
];


export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <AppLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Book a Consultation</h1>
        </div>
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
      </main>
    </AppLayout>
  );
}
