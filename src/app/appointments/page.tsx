
'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock, Star, Zap } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, collection, addDoc, getDoc } from 'firebase/firestore';

function AppointmentsContent() {
  const { profile, loading, user } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAvailability() {
      setLoadingSlots(true);
      const settingsRef = doc(db, 'settings', 'appointments');
      const docSnap = await getDoc(settingsRef);
      if (docSnap.exists() && docSnap.data().timeSlots) {
        setTimeSlots(docSnap.data().timeSlots);
      } else {
        // Fallback if settings are not configured
        setTimeSlots([
          '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'
        ]);
      }
      setLoadingSlots(false);
    }
    fetchAvailability();
  }, []);

  const handleConfirm = async () => {
    if (!user || !profile || !date || !selectedTime) return;
    setIsConfirming(true);

    try {
      // 1. Create a public appointment document for admin viewing
      await addDoc(collection(db, 'appointments'), {
        userId: user.uid,
        studentName: profile.name,
        studentEmail: profile.email,
        appointmentDate: date,
        appointmentTime: selectedTime,
        contactPreference: profile.contactPreference || 'email',
        status: 'booked',
        createdAt: serverTimestamp(),
      });
      
      // 2. Create a private record for the user
      const userApptId = `${date.toISOString().split('T')[0]}-${selectedTime.replace(/[\s:]/g, '')}`;
      const apptRef = doc(db, 'users', user.uid, 'appointments', userApptId);
      await setDoc(apptRef, {
        status: 'confirmed',
        confirmedAt: serverTimestamp(),
        date: date,
        time: selectedTime,
      }, { merge: true });

      toast({
        title: "Appointment Confirmed!",
        description: `Your meeting for ${date.toLocaleDateString()} at ${selectedTime} is booked.`,
      });
      setSelectedTime(null);

    } catch (error) {
      console.error("Failed to confirm appointment:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Could not confirm your appointment. Please try again."
      });
    } finally {
      setIsConfirming(false);
    }
  };

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
                    <Link href="/billing">
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
            captionLayout="dropdown-buttons"
            fromYear={new Date().getFullYear()}
            toYear={new Date().getFullYear() + 1}
            disabled={(date) => date < new Date()}
          />
        </div>
        <div className="md:col-span-2">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Available Times on {date ? date.toLocaleDateString() : 'selected date'}
          </h3>
          {loadingSlots ? (
             <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {Array.from({length: 8}).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
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
          )}
          <Button 
            className="mt-8 w-full" 
            size="lg" 
            disabled={!date || !selectedTime || isConfirming}
            onClick={handleConfirm}
          >
            {isConfirming ? "Confirming..." : `Confirm for ${date?.toLocaleDateString()} at ${selectedTime || ''}`}
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
