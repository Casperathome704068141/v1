
'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock, Star, Zap } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { db, auth } from '@/lib/firebase';
import { doc, collection, query, where, onSnapshot, Timestamp, runTransaction } from 'firebase/firestore';
import { format, isPast } from 'date-fns';

type TimeSlot = {
    id: string;
    time: Timestamp;
    booked: boolean;
    bookedBy: string | null;
};

function AppointmentsContent() {
  const { profile, loading: userLoading, user } = useUser();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoadingSlots(true);
    const availQuery = query(
      collection(db, "timeSlots"),
      where("booked", "==", false)
    );
    const unsubscribe = onSnapshot(availQuery, snap => {
        const now = new Date();
        const available = snap.docs
            .map(d => ({ id: d.id, ...d.data() } as TimeSlot))
            .filter(slot => !isPast(slot.time.toDate())) // Filter out past slots
            .sort((a,b) => a.time.toMillis() - b.time.toMillis()); // Sort chronologically

        setAvailableSlots(available);
        setLoadingSlots(false);
    });
    return () => unsubscribe();
  }, []);

  const handleBookSlot = async (slotId: string, slotTime: Timestamp) => {
    if (!user) {
        toast({ variant: "destructive", title: "Not Logged In", description: "You must be logged in to book an appointment." });
        return;
    }
    
    setIsConfirming(true);
    setSelectedSlotId(slotId);

    const slotRef = doc(db, "timeSlots", slotId);
    const apptRef = doc(collection(db, "appointments")); // Create a new doc ref for the appointment

    try {
        await runTransaction(db, async (transaction) => {
            const slotSnap = await transaction.get(slotRef);
            if (!slotSnap.exists() || slotSnap.data().booked) {
                throw new Error("This slot is no longer available. Please select another.");
            }
            
            // Mark the slot as booked
            transaction.update(slotRef, {
                booked: true,
                bookedBy: user.uid
            });
            
            // Record the new appointment
            transaction.set(apptRef, {
                slotId: slotId,
                userId: user.uid,
                time: slotTime,
                status: "pending"
            });
        });

        toast({
            title: "Appointment Confirmed!",
            description: `Your meeting for ${format(slotTime.toDate(), 'PPP p')} is booked.`,
        });

    } catch (error: any) {
      console.error("Booking failed:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "Could not book your appointment. Please try again."
      });
    } finally {
      setIsConfirming(false);
      setSelectedSlotId(null);
    }
  };
  
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
                <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-4"><Star className="h-8 w-8" /></div>
                <CardTitle>Upgrade to Book Consultations</CardTitle>
                <CardDescription className="max-w-md mx-auto">1-on-1 consultations with our RCICs are an exclusive feature of our Advantage and Elite plans. Upgrade your plan to unlock this feature.</CardDescription>
            </CardHeader>
            <CardFooter><Button asChild size="lg" className="w-full"><Link href="/billing"><Zap className="mr-2 h-4 w-4" />View Pricing Plans</Link></Button></CardFooter>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Your 1-on-1 Session</CardTitle>
        <CardDescription>Select a date and time to meet with one of our Regulated Canadian Immigration Consultants (RCIC).</CardDescription>
      </CardHeader>
      <CardContent>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Available Time Slots</h3>
          {loadingSlots ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({length: 8}).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableSlots.map(slot => (
                <Button 
                    key={slot.id}
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center p-3"
                    disabled={isConfirming}
                    onClick={() => handleBookSlot(slot.id, slot.time)}
                >
                    {isConfirming && selectedSlotId === slot.id ? (
                        "Booking..."
                    ) : (
                        <>
                            <span className="font-bold text-lg">{format(slot.time.toDate(), 'p')}</span>
                            <span className="text-sm text-muted-foreground">{format(slot.time.toDate(), 'MMM d')}</span>
                        </>
                    )}
                </Button>
                ))}
            </div>
          ) : (
             <p className="text-muted-foreground text-center py-8">No available appointments at this time. Please check back later.</p>
          )}
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
