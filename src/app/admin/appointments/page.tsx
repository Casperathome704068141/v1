
'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Tag, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

type Appointment = {
    id: string;
    studentName: string;
    studentEmail: string;
    appointmentDate: Timestamp;
    appointmentTime: string;
    contactPreference: string;
    status: string;
};

type AvailabilitySettings = {
    timeSlots: string[];
};

function ManageAvailability() {
    const [slots, setSlots] = useState<string[]>([]);
    const [newSlot, setNewSlot] = useState('');
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const settingsRef = doc(db, 'settings', 'appointments');
        const unsub = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                setSlots(docSnap.data().timeSlots || []);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleAddSlot = async () => {
        if (!newSlot || slots.includes(newSlot)) {
            toast({ variant: 'destructive', title: 'Invalid Time Slot', description: 'Please enter a unique time slot in HH:MM AM/PM format.' });
            return;
        }
        const newSlots = [...slots, newSlot].sort();
        await setDoc(doc(db, 'settings', 'appointments'), { timeSlots: newSlots }, { merge: true });
        setNewSlot('');
        toast({ title: 'Time Slot Added' });
    };

    const handleRemoveSlot = async (slotToRemove: string) => {
        const newSlots = slots.filter(slot => slot !== slotToRemove);
        await setDoc(doc(db, 'settings', 'appointments'), { timeSlots: newSlots }, { merge: true });
        toast({ title: 'Time Slot Removed' });
    };

    if (loading) return <Skeleton className="h-48 w-full" />;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Availability</CardTitle>
                <CardDescription>Add or remove available time slots for student consultations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Current Time Slots</Label>
                    <div className="flex flex-wrap gap-2">
                        {slots.length > 0 ? slots.map(slot => (
                            <div key={slot} className="flex items-center gap-1 bg-muted p-1.5 rounded-md">
                                <span className="text-sm font-medium">{slot}</span>
                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleRemoveSlot(slot)}>
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                            </div>
                        )) : <p className="text-sm text-muted-foreground">No time slots configured.</p>}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="e.g., 02:30 PM"
                        value={newSlot}
                        onChange={(e) => setNewSlot(e.target.value)}
                    />
                    <Button onClick={handleAddSlot}>Add Slot</Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'appointments'), orderBy('appointmentDate', 'desc'));
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
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Booked Consultations</CardTitle>
                                <CardDescription>A list of all upcoming and past appointments.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {error && (
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Date & Time</TableHead>
                                            <TableHead>Contact Method</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : appointments.length > 0 ? (
                                            appointments.map(appt => (
                                                <TableRow key={appt.id}>
                                                    <TableCell>
                                                        <div className="font-medium">{appt.studentName}</div>
                                                        <div className="text-xs text-muted-foreground">{appt.studentEmail}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(appt.appointmentDate.toDate(), 'PPP')} at {appt.appointmentTime}
                                                    </TableCell>
                                                    <TableCell className="capitalize">{appt.contactPreference}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-muted-foreground">No appointments booked yet.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-1">
                        <ManageAvailability />
                    </div>
                </div>
            </main>
        </AdminLayout>
    );
}
