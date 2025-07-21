
'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Tag, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Appointment = {
    id: string;
    userId: string;
    slotId: string;
    time: Timestamp;
    status: 'pending' | 'confirmed' | 'declined';
    // We'll need to fetch student details separately if needed
    studentName?: string; 
    studentEmail?: string;
};

type TimeSlot = {
    id: string;
    time: Timestamp;
    booked: boolean;
    bookedBy: string | null;
};

function ManageTimeSlots() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState('09:00');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleCreateSlot = async () => {
        if (!date || !time) {
            toast({ variant: 'destructive', title: 'Invalid Date/Time', description: 'Please select a valid date and time.' });
            return;
        }

        setLoading(true);
        try {
            const [hours, minutes] = time.split(':').map(Number);
            const slotDateTime = new Date(date);
            slotDateTime.setHours(hours, minutes, 0, 0);

            await addDoc(collection(db, "timeSlots"), {
                time: Timestamp.fromDate(slotDateTime),
                booked: false,
                bookedBy: null
            });
            toast({ title: 'Time Slot Created', description: `Added slot for ${format(slotDateTime, 'PPP p')}` });
        } catch (error: any) {
            console.error("Error creating slot:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not create the time slot.' });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Availability</CardTitle>
                <CardDescription>Add new time slots for student consultations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, 'PPP') : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time">Time (24-hour format)</Label>
                    <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <Button onClick={handleCreateSlot} disabled={loading} className="w-full">
                    {loading ? 'Adding...' : 'Add Time Slot'}
                </Button>
            </CardContent>
        </Card>
    );
}

function TimeSlotsList() {
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const q = query(collection(db, 'timeSlots'), orderBy('time', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const slotsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TimeSlot));
            setSlots(slotsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleDeleteSlot = async (slotId: string) => {
        if (!window.confirm("Are you sure you want to delete this slot? This cannot be undone.")) return;
        try {
            await deleteDoc(doc(db, 'timeSlots', slotId));
            toast({ title: "Slot Deleted" });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: "Could not delete the slot." });
        }
    }
    
    if (loading) {
        return <Skeleton className="h-48 w-full" />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Time Slots</CardTitle>
                <CardDescription>All created slots, both available and booked.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader><TableRow><TableHead>Date & Time</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {slots.map(slot => (
                            <TableRow key={slot.id}>
                                <TableCell>{format(slot.time.toDate(), 'PPP p')}</TableCell>
                                <TableCell>{slot.booked ? <span className="text-destructive font-semibold">Booked</span> : <span className="text-green-600 font-semibold">Available</span>}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteSlot(slot.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'appointments'), orderBy('time', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const appts: Appointment[] = [];
            querySnapshot.forEach((doc) => {
                appts.push({ id: doc.id, ...doc.data() } as Appointment);
            });
            setAppointments(appts);
            setLoading(false);
        }, (err) => {
            console.error(err);
            setError('Failed to load appointments. Please check console for details.');
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AdminLayout>
            <main className="flex-1 space-y-6 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <h1 className="font-headline text-3xl font-bold">Appointments</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Booked Consultations</CardTitle>
                                <CardDescription>A list of all appointments booked by users.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {error && (
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                <Table>
                                    <TableHeader><TableRow><TableHead>Date & Time</TableHead><TableHead>User ID</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array.from({ length: 5 }).map((_, i) => (<TableRow key={i}><TableCell><Skeleton className="h-4 w-48" /></TableCell><TableCell><Skeleton className="h-4 w-32" /></TableCell><TableCell><Skeleton className="h-4 w-24" /></TableCell></TableRow>))
                                        ) : appointments.length > 0 ? (
                                            appointments.map(appt => (<TableRow key={appt.id}><TableCell>{format(appt.time.toDate(), 'PPP p')}</TableCell><TableCell className="font-mono text-xs">{appt.userId}</TableCell><TableCell className="capitalize">{appt.status}</TableCell></TableRow>))
                                        ) : (<TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No appointments booked yet.</TableCell></TableRow>)}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <TimeSlotsList />
                    </div>
                    <div className="lg:col-span-1">
                        <ManageTimeSlots />
                    </div>
                </div>
            </main>
        </AdminLayout>
    );
}
