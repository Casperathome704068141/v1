
'use client';

import { useEffect, useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Check, X, Calendar as CalendarIcon, Clock, User, Info, CalendarCheck2, CalendarX2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type Appointment = {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    requestedDate: string;
    requestedTime: string;
    topic: string;
    status: 'pending' | 'confirmed' | 'declined';
    rejectionReason?: string;
    createdAt: any;
};

function getStatusInfo(status: Appointment['status']) {
    switch (status) {
        case 'confirmed': return { variant: 'success', icon: CalendarCheck2, text: 'Confirmed' };
        case 'pending': return { variant: 'secondary', icon: Clock, text: 'Pending' };
        case 'declined': return { variant: 'destructive', icon: CalendarX2, text: 'Declined' };
        default: return { variant: 'outline', icon: Info, text: 'Unknown' };
    }
}

const AppointmentCard = ({ appointment, onUpdate }: { appointment: Appointment, onUpdate: (id: string, status: 'confirmed' | 'declined', reason?: string) => void }) => {
    const [rejectionReason, setRejectionReason] = useState('');

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{appointment.userName}</span>
                    <Badge variant="secondary">{appointment.requestedDate}</Badge>
                </CardTitle>
                <CardDescription>{appointment.userEmail}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span className="font-medium">{appointment.requestedTime}</span>
                </div>
                <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{appointment.topic}</p>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                                <X className="mr-2 h-4 w-4" /> Decline
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Decline Appointment</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please provide a reason for declining. This will be shared with the user.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-2">
                                <Label htmlFor={`rejection-reason-${appointment.id}`}>Reason for declining</Label>
                                <Textarea id={`rejection-reason-${appointment.id}`} placeholder="e.g., 'Sorry, I am unavailable at this time...'" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setRejectionReason('')}>Cancel</AlertDialogCancel>
                                <AlertDialogAction disabled={!rejectionReason} onClick={() => onUpdate(appointment.id, 'declined', rejectionReason)}>
                                    Confirm Decline
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-100 hover:text-green-700" onClick={() => onUpdate(appointment.id, 'confirmed')}>
                        <Check className="mr-2 h-4 w-4"/> Accept
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const appts: Appointment[] = [];
            querySnapshot.forEach((doc) => {
                appts.push({ id: doc.id, ...doc.data() } as Appointment);
            });
            setAppointments(appts);
            setLoading(false);
        }, (err) => {
            console.error(err);
            setError('Failed to load appointments.');
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    
    const handleUpdateStatus = async (id: string, status: 'confirmed' | 'declined', reason?: string) => {
        const apptRef = doc(db, 'appointments', id);
        try {
            const updateData: { status: string; rejectionReason?: string; updatedAt: any } = {
                status,
                updatedAt: serverTimestamp(),
            };
            if (status === 'declined' && reason) {
                updateData.rejectionReason = reason;
            }
            await updateDoc(apptRef, updateData);
            toast({
                title: 'Appointment Updated',
                description: `The appointment has been ${status}.`,
            });
        } catch (error) {
            console.error('Error updating appointment:', error);
            toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update the appointment status.' });
        }
    }

    const { pendingAppointments, pastAppointments } = useMemo(() => {
        const pending = appointments.filter(a => a.status === 'pending');
        const past = appointments.filter(a => a.status !== 'pending');
        return { pendingAppointments: pending, pastAppointments: past };
    }, [appointments]);

    return (
        <AdminLayout>
            <main className="flex-1 space-y-8 p-4 md:p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Appointment Requests</h1>
                    <p className="text-muted-foreground">Review, confirm, or decline appointment requests from users.</p>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                
                <section>
                    <h2 className="text-2xl font-semibold tracking-tight mb-4">Pending Requests</h2>
                    {loading ? (
                         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                             <Skeleton className="h-48 w-full" />
                             <Skeleton className="h-48 w-full" />
                         </div>
                    ) : pendingAppointments.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {pendingAppointments.map(appt => <AppointmentCard key={appt.id} appointment={appt} onUpdate={handleUpdateStatus} />)}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">No pending appointment requests.</div>
                    )}
                </section>

                <Card>
                    <CardHeader>
                        <CardTitle>Appointment History</CardTitle>
                        <CardDescription>A log of all confirmed and declined appointments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Topic</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : pastAppointments.length > 0 ? (
                                    pastAppointments.map(appt => {
                                        const statusInfo = getStatusInfo(appt.status);
                                        return (
                                            <TableRow key={appt.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <div className="font-medium">{appt.userName}</div>
                                                    <div className="text-sm text-muted-foreground">{appt.userEmail}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span>{appt.requestedDate}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                         <Clock className="h-4 w-4" />
                                                         <span>{appt.requestedTime}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={statusInfo.variant} className="capitalize flex items-center gap-1">
                                                        <statusInfo.icon className="h-3.5 w-3.5" />
                                                        <span>{statusInfo.text}</span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate">{appt.topic}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground py-12">No past appointments found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </AdminLayout>
    );
}
