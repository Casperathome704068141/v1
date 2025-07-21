
'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Check, X, Clock } from 'lucide-react';
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

function getStatusBadgeVariant(status: Appointment['status']) {
    switch (status) {
        case 'confirmed': return 'success';
        case 'pending': return 'secondary';
        case 'declined': return 'destructive';
        default: return 'outline';
    }
}


export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
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
            setError('Failed to load appointments. Please check console for details.');
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
            setRejectionReason('');
        } catch (error) {
            console.error('Error updating appointment:', error);
            toast({ variant: 'destructive', title: 'Update Failed' });
        }
    }

    return (
        <AdminLayout>
            <main className="flex-1 space-y-6 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <h1 className="font-headline text-3xl font-bold">Appointment Requests</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Manage Bookings</CardTitle>
                        <CardDescription>Review, confirm, or decline appointment requests from users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader><TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Requested Date & Time</TableHead>
                                    <TableHead>Topic</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow></TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => (<TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell></TableRow>))
                                    ) : appointments.length > 0 ? (
                                        appointments.map(appt => (
                                        <TableRow key={appt.id}>
                                            <TableCell>
                                                <div className="font-medium">{appt.userName}</div>
                                                <div className="text-sm text-muted-foreground">{appt.userEmail}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div>{appt.requestedDate}</div>
                                                <div className="text-sm text-muted-foreground">{appt.requestedTime}</div>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">{appt.topic}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(appt.status)} className="capitalize">{appt.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {appt.status === 'pending' && (
                                                    <div className="flex gap-2 justify-end">
                                                        <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-100 hover:text-green-700" onClick={() => handleUpdateStatus(appt.id, 'confirmed')}>
                                                            <Check className="mr-2 h-4 w-4"/> Accept
                                                        </Button>
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
                                                                    Please provide a reason for declining this appointment. This will be shared with the user.
                                                                </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="rejection-reason">Reason for declining</Label>
                                                                    <Textarea id="rejection-reason" placeholder="e.g., 'Sorry, I am unavailable at this time. Please request a time next week.'" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                                                                </div>
                                                                <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={() => setRejectionReason('')}>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction disabled={!rejectionReason} onClick={() => handleUpdateStatus(appt.id, 'declined', rejectionReason)}>
                                                                    Confirm Decline
                                                                </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        ))
                                    ) : (<TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No appointment requests yet.</TableCell></TableRow>)}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </AdminLayout>
    );
}
