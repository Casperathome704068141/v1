
'use client';

import { useEffect, useState, use } from 'react';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, writeBatch } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, AlertTriangle, FileText, Download, MessageSquare, History } from 'lucide-react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import type { UploadedFile } from '@/context/application-context';
import { AdminApplicationProgress } from '@/components/admin/admin-application-progress';
import { documentList } from '@/context/application-context';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="grid grid-cols-3 gap-4 py-3 text-sm first:pt-0 last:pb-0">
      <dt className="text-muted-foreground col-span-1">{label}</dt>
      <dd className="font-medium text-foreground col-span-2">{value}</dd>
    </div>
  );
}

function safeFormatDate(date: any, formatString: string): string {
    if (!date) return 'N/A';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    if (!isValid(dateObj)) {
      return 'N/A';
    }
    return format(dateObj, formatString);
}

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case 'Approved': return 'success';
        case 'Pending Review': return 'secondary';
        case 'Awaiting LOA': return 'secondary';
        case 'Application Submitted to IRCC': return 'default';
        case 'Awaiting Biometrics': return 'default';
        case 'Awaiting Medical': return 'default';
        case 'Passport Request': return 'success';
        case 'Action Required': return 'destructive';
        case 'Rejected': return 'destructive';
        case 'draft': return 'outline';
        default: return 'outline';
    }
}

type StatusHistoryItem = {
    id: string;
    status: string;
    notes: string;
    timestamp: any;
    updatedBy: string;
}

export default function ApplicationDetailPage() {
    const params = useParams() as { id: string };
    const { id: applicationId } = params;
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user: adminUser } = useAuth();
    const userId = searchParams.get('userId');

    const [application, setApplication] = useState<any>(null);
    const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [statusNotes, setStatusNotes] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (!applicationId) {
            setError("Application ID is missing.");
            setLoading(false);
            return;
        }

        async function getApplication() {
            setLoading(true);
            setError(null);
            try {
                const appRef = doc(db, 'applications', applicationId);
                const docSnap = await getDoc(appRef);

                 if (docSnap.exists()) {
                     const appData = docSnap.data();
                     setApplication(appData);
                     setStatus(appData.status || 'submitted');
                 } else {
                    setError("No application found with this ID.");
                 }
                
                // Set up listener for status history
                const historyRef = collection(db, 'applications', applicationId, 'statusHistory');
                const q = query(historyRef, orderBy('timestamp', 'desc'));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const history: StatusHistoryItem[] = [];
                    snapshot.forEach(doc => {
                        history.push({ id: doc.id, ...doc.data() } as StatusHistoryItem);
                    });
                    setStatusHistory(history);
                });
                return unsubscribe;

            } catch (err) {
                console.error("Firebase error getting document:", err);
                setError("An error occurred while fetching the application.");
            } finally {
                setLoading(false);
            }
        }
        getApplication();
    }, [applicationId]);

    const handleStatusUpdate = async () => {
        if (!adminUser) {
           toast({ variant: 'destructive', title: 'Error', description: 'You are not authenticated.' });
           return;
        }
        
        setIsUpdating(true);
        try {
            const batch = writeBatch(db);

            // 1. Update the main application document
            const appRef = doc(db, 'applications', applicationId);
            batch.update(appRef, { 
                status: status,
                updatedAt: serverTimestamp(),
            });

            // 2. Add a new entry to the status history subcollection
            const historyRef = doc(collection(db, 'applications', applicationId, 'statusHistory'));
            batch.set(historyRef, {
                status: status,
                notes: statusNotes,
                timestamp: serverTimestamp(),
                updatedBy: adminUser.displayName || adminUser.email,
            });

            await batch.commit();

            toast({
                title: 'Status Updated',
                description: `Application status changed to ${status}.`,
            });
            setStatusNotes(''); // Clear notes after update
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
        return <AdminLayout><main className="p-8">Application not found.</main></AdminLayout>;
    }

    const { personalInfo, academics, finances, family, background, studyPlan, documents, submittedAt } = application;
    const currentStatus = application.status || 'draft';
    
    const allUploadedFiles = documents 
    ? Object.keys(documents).flatMap(docKey => {
        const docData = documents[docKey];
        if (docData?.files && docData.files.length > 0) {
            const masterDocInfo = documentList.find(d => d.id === docKey);
            const categoryName = masterDocInfo ? masterDocInfo.name : docKey; 

            return docData.files.map((file: UploadedFile) => ({
                category: categoryName,
                ...file,
            }));
        }
        return [];
    })
    : [];

    return (
        <AdminLayout>
            <main className="flex-1 space-y-6 p-4 md:p-8">
                <div>
                     <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Applications
                    </Button>
                    <div className="flex justify-between items-start">
                        <div>
                             <h1 className="font-headline text-3xl font-bold">Application: {personalInfo?.givenNames} {personalInfo?.surname}</h1>
                            <p className="text-muted-foreground">App ID: {applicationId} / User ID: {userId || application.userId}</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(currentStatus)} className="text-base">{currentStatus}</Badge>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5 text-primary" />Status History</CardTitle></CardHeader>
                            <CardContent>
                                {statusHistory.length > 0 ? (
                                    <ul className="space-y-4">
                                        {statusHistory.map(item => (
                                            <li key={item.id} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-3 w-3 rounded-full bg-primary" />
                                                    <div className="h-full w-px bg-border" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{item.status} <span className="text-xs text-muted-foreground font-normal">- {safeFormatDate(item.timestamp, 'PPp')}</span></p>
                                                    <p className="text-sm text-muted-foreground">{item.notes}</p>
                                                    <p className="text-xs text-muted-foreground/70">by {item.updatedBy}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-sm text-muted-foreground">No status history found.</p>}
                            </CardContent>
                        </Card>

                         <Card>
                            <CardHeader><CardTitle>Application Checklist</CardTitle></CardHeader>
                            <CardContent>
                               <AdminApplicationProgress applicationData={application} />
                            </CardContent>
                        </Card>
                        {personalInfo && (
                            <Card>
                                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                                <CardContent><dl className="divide-y">
                                    <DataRow label="Full Name" value={`${personalInfo.givenNames} ${personalInfo.surname}`} />
                                    <DataRow label="Email" value={application.studentEmail || personalInfo?.email} />
                                    <DataRow label="Date of Birth" value={safeFormatDate(personalInfo?.dob, 'PPP')} />
                                    <DataRow label="Gender" value={personalInfo?.gender} />
                                    <DataRow label="Country of Citizenship" value={personalInfo?.countryOfCitizenship} />
                                    <DataRow label="Country of Residence" value={personalInfo?.countryOfResidence} />
                                    <DataRow label="Passport Number" value={personalInfo?.passportNumber} />
                                    <DataRow label="Address" value={[personalInfo?.address, personalInfo?.city, personalInfo?.province, personalInfo?.postalCode].filter(Boolean).join(', ')} />
                                </dl></CardContent>
                            </Card>
                        )}
                         {academics?.educationHistory?.length > 0 && (
                            <Card>
                                <CardHeader><CardTitle>Education History</CardTitle></CardHeader>
                                <CardContent className="divide-y">
                                    {academics.educationHistory.map((item: any, index: number) => (
                                        <div key={index} className="py-3 first:pt-0 last:pb-0">
                                            <p className="font-semibold text-primary">{item.institutionName}</p>
                                            <dl className="mt-1">
                                                <DataRow label="Program" value={item.program} />
                                                <DataRow label="Credential" value={item.credential} />
                                                <DataRow label="Graduated" value={item.graduated} />
                                                <DataRow label="Dates" value={`${item.startDate} to ${item.endDate}`} />
                                                <DataRow label="Address" value={[item.address, item.city, item.country].filter(Boolean).join(', ')} />
                                            </dl>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                        {academics?.employmentHistory?.length > 0 && (
                            <Card>
                                <CardHeader><CardTitle>Employment History</CardTitle></CardHeader>
                                <CardContent className="divide-y">
                                    {academics.employmentHistory.map((item: any, index: number) => (
                                        <div key={index} className="py-3 first:pt-0 last:pb-0">
                                             <p className="font-semibold text-primary">{item.jobTitle} at {item.employer}</p>
                                             <dl className="mt-1">
                                                 <DataRow label="Dates" value={`${item.startDate} to ${item.endDate}`} />
                                                 <DataRow label="Address" value={[item.address, item.city, item.country].filter(Boolean).join(', ')} />
                                             </dl>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                         {finances && (
                            <Card>
                                <CardHeader><CardTitle>Financial Details</CardTitle></CardHeader>
                                <CardContent><dl className="divide-y">
                                    <DataRow label="Total Funds Available" value={finances.totalFunds ? `$${Number(finances.totalFunds).toLocaleString('en-CA')} CAD` : 'N/A'} />
                                    <DataRow label="Funding Sources" value={finances.fundingSources?.join(', ')} />
                                    <DataRow label="Primary Sponsor" value={finances.primarySponsorName} />
                                    <DataRow label="Sponsor's Relationship" value={finances.sponsorRelationship} />
                                    <DataRow label="Sponsor's Address" value={finances.primarySponsorAddress} />
                                    <DataRow label="Sponsor's Phone" value={finances.primarySponsorPhone} />
                                </dl></CardContent>
                            </Card>
                        )}
                         {allUploadedFiles.length > 0 && (
                            <Card>
                                <CardHeader><CardTitle>Uploaded Documents</CardTitle></CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {allUploadedFiles.map((file, index) => (
                                            <li key={index} className="flex items-center justify-between rounded-md border p-3">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm font-medium">{file.fileName}</p>
                                                        <p className="text-xs text-muted-foreground">{file.category} &middot; {safeFormatDate(file.date, 'PP')}</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                        <Download className="mr-2 h-4 w-4" /> View
                                                    </a>
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="lg:col-span-1 space-y-8 sticky top-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Application Management</CardTitle>
                                <CardDescription>Update the status of this application.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <dl className="divide-y">
                                    <DataRow label="Current Status" value={<Badge variant={getStatusBadgeVariant(currentStatus)}>{currentStatus}</Badge>} />
                                    <DataRow label="Submitted At" value={safeFormatDate(submittedAt, 'PPP p')} />
                                </dl>
                                <Separator />
                                <div className="space-y-2 pt-2">
                                     <Label htmlFor="status-select">Change Status</Label>
                                     <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger id="status-select">
                                            <SelectValue placeholder="Set new status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending Review">Pending Review</SelectItem>
                                            <SelectItem value="Awaiting LOA">Awaiting LOA</SelectItem>
                                            <SelectItem value="Application Submitted to IRCC">Application Submitted to IRCC</SelectItem>
                                            <SelectItem value="Awaiting Biometrics">Awaiting Biometrics</SelectItem>
                                            <SelectItem value="Awaiting Medical">Awaiting Medical</SelectItem>
                                            <SelectItem value="Passport Request">Passport Request (PPR)</SelectItem>
                                            <SelectItem value="Approved">Approved</SelectItem>
                                            <SelectItem value="Action Required">Action Required</SelectItem>
                                            <SelectItem value="Rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status-notes">Notes for Client (Optional)</Label>
                                    <Textarea id="status-notes" value={statusNotes} onChange={(e) => setStatusNotes(e.target.value)} placeholder="e.g., We have submitted the application to IRCC. Please watch for a biometrics instruction letter." />
                                </div>
                                <Button className="w-full" onClick={handleStatusUpdate} disabled={isUpdating || status === currentStatus}>
                                    {isUpdating ? 'Updating...' : 'Update Status & Notify Client'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </AdminLayout>
    );
}
