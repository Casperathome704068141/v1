
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="grid grid-cols-3 gap-4 py-2 text-sm">
      <dt className="text-muted-foreground col-span-1">{label}</dt>
      <dd className="font-medium text-foreground col-span-2">{String(value)}</dd>
    </div>
  );
}

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case 'Approved': return 'default';
        case 'Pending Review': return 'secondary';
        case 'Action Required': return 'destructive';
        default: return 'outline';
    }
}

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function getApplication() {
            setLoading(true);
            setError(null);
            try {
                const docRef = doc(db, 'applications', params.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const appData = docSnap.data();
                    setApplication(appData);
                    setStatus(appData.status);
                } else {
                    setError("No application found with this ID.");
                }
            } catch (err) {
                console.error("Firebase error getting document:", err);
                setError("An error occurred while fetching the application.");
            } finally {
                setLoading(false);
            }
        }
        getApplication();
    }, [params.id]);

    const handleStatusUpdate = async () => {
        setIsUpdating(true);
        const docRef = doc(db, 'applications', params.id);
        try {
            await updateDoc(docRef, { status: status });
            toast({
                title: 'Status Updated',
                description: `Application status changed to ${status}.`,
            });
            setApplication((prev: any) => ({ ...prev, status }));
        } catch (error) {
            console.error("Error updating status: ", error);
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: 'Could not update the application status.',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
             <AdminLayout>
                <main className="flex-1 space-y-6 p-4 md:p-8">
                     <Skeleton className="h-8 w-48 mb-4" />
                     <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-8">
                            <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></CardContent></Card>
                            <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></CardContent></Card>
                        </div>
                        <div className="lg:col-span-1">
                             <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
                        </div>
                     </div>
                </main>
            </AdminLayout>
        )
    }
    
    if (error) {
        return (
            <AdminLayout>
                <main className="p-4 md:p-8">
                     <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Applications
                    </Button>
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </main>
            </AdminLayout>
        );
    }

    if (!application) {
        // This case should ideally not be reached if error handling is correct, but as a fallback.
        return <AdminLayout><main className="p-8">Application not found.</main></AdminLayout>;
    }


    const { personalInfo, academics, finances, submittedAt } = application;

    return (
        <AdminLayout>
            <main className="flex-1 space-y-6 p-4 md:p-8">
                <div>
                     <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Applications
                    </Button>
                    <h1 className="font-headline text-3xl font-bold">Application: {personalInfo?.givenNames} {personalInfo?.surname}</h1>
                    <p className="text-muted-foreground">ID: {params.id}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
                        {personalInfo && (
                            <Card>
                                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                                <CardContent>
                                    <dl className="divide-y">
                                        <DataRow label="Full Name" value={`${personalInfo.givenNames} ${personalInfo.surname}`} />
                                        <DataRow label="Date of Birth" value={personalInfo.dob ? format(new Date(personalInfo.dob), 'PPP') : ''} />
                                        <DataRow label="Citizenship" value={personalInfo.countryOfCitizenship} />
                                        <DataRow label="Passport" value={personalInfo.passportNumber} />
                                        <DataRow label="Email" value={application.studentEmail} />
                                    </dl>
                                </CardContent>
                            </Card>
                        )}
                        {academics?.educationHistory?.length > 0 && (
                             <Card>
                                <CardHeader><CardTitle>Education History</CardTitle></CardHeader>
                                <CardContent>
                                    {academics.educationHistory.map((item: any, index: number) => (
                                        <div key={index} className="mb-4">
                                             <p className="font-semibold">{item.program} - {item.institutionName}</p>
                                             <p className="text-sm text-muted-foreground">{item.credential}, {item.startDate} to {item.endDate}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                         {finances && (
                            <Card>
                                <CardHeader><CardTitle>Financial Details</CardTitle></CardHeader>
                                <CardContent>
                                    <dl className="divide-y">
                                        <DataRow label="Total Funds" value={finances.totalFunds ? `$${Number(finances.totalFunds).toLocaleString()} CAD` : ''} />
                                        <DataRow label="Funding Sources" value={finances.fundingSources?.join(', ')} />
                                        <DataRow label="Sponsor" value={finances.primarySponsorName} />
                                    </dl>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Application Management</CardTitle>
                                <CardDescription>Update the status of this application.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <dl>
                                    <DataRow label="Submitted At" value={submittedAt?.toDate() ? format(submittedAt.toDate(), 'PPP') : 'N/A'} />
                                    <DataRow label="Current Status" value={<Badge variant={getStatusBadgeVariant(application.status)}>{application.status}</Badge>} />
                                </dl>
                                <Separator />
                                <div className="space-y-2">
                                     <label className="text-sm font-medium">Change Status</label>
                                     <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Set new status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending Review">Pending Review</SelectItem>
                                            <SelectItem value="Approved">Approved</SelectItem>
                                            <SelectItem value="Action Required">Action Required</SelectItem>
                                            <SelectItem value="Rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button className="w-full" onClick={handleStatusUpdate} disabled={isUpdating || status === application.status}>
                                    {isUpdating ? 'Updating...' : 'Update Status'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </AdminLayout>
    );
}
