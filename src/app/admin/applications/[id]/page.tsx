
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
// FIX: Import `isValid` to check for valid dates
import { format, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, AlertTriangle, FileText, Download } from 'lucide-react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import type { UploadedFile } from '@/context/application-context';
import { AdminApplicationProgress } from '@/components/admin/admin-application-progress';

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="grid grid-cols-3 gap-4 py-3 text-sm first:pt-0 last:pb-0">
      <dt className="text-muted-foreground col-span-1">{label}</dt>
      <dd className="font-medium text-foreground col-span-2">{value}</dd>
    </div>
  );
}

// FIX: Create a safe date formatting function to prevent crashes from invalid date values.
function safeFormatDate(date: any, formatString: string): string {
    if (!date) return 'N/A';
    // Convert Firestore Timestamps or string dates to a Date object
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    // Check if the resulting date is valid before formatting
    if (!isValid(dateObj)) {
      return 'N/A';
    }
    return format(dateObj, formatString);
}


function getStatusBadgeVariant(status: string) {
    switch (status) {
        case 'Approved': return 'success';
        case 'submitted': return 'default';
        case 'Pending Review': return 'secondary';
        case 'Action Required': return 'destructive';
        case 'Rejected': return 'destructive';
        case 'draft': return 'outline';
        default: return 'outline';
    }
}

const documentDisplayList = [
    { id: 'passport', name: 'Passport Bio Page' },
    { id: 'loa', name: 'Letter of Acceptance' },
    { id: 'proofOfFunds', name: 'Proof of Funds' },
    { id: 'languageTest', name: 'Language Test Results' },
    { id: 'sop', name: 'Statement of Purpose' },
    { id: 'photo', name: 'Digital Photo' },
    { id: 'marriageCert', name: 'Marriage Certificate' },
    { id: 'eca', name: 'ECA' },
];

export default function ApplicationDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');

    useEffect(() => {
        if (!id || !userId) {
            setError("Application or User ID is missing.");
            setLoading(false);
            return;
        }

        async function getApplication() {
            setLoading(true);
            setError(null);
            try {
                let docSnap;
                const userAppRef = doc(db, 'users', userId as string, 'application', id);
                docSnap = await getDoc(userAppRef);

                if (!docSnap.exists()) {
                    const submittedAppRef = doc(db, 'applications', id);
                    docSnap = await getDoc(submittedAppRef);
                }

                if (docSnap.exists()) {
                    const appData = docSnap.data();
                    setApplication(appData);
                    setStatus(appData.status || 'draft');
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
    }, [id, userId]);

    const handleStatusUpdate = async () => {
        if (!userId && !application?.userId) {
           toast({ variant: 'destructive', title: 'Error', description: 'User ID is missing.' });
           return;
        }
        
        const targetUserId = userId || application?.userId;
        const isDraft = application.status === 'draft';
        const docRef = isDraft
            ? doc(db, 'users', targetUserId, 'application', id)
            : doc(db, 'applications', id);


        setIsUpdating(true);
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
        return <AdminLayout><main className="p-8">Application not found.</main></AdminLayout>;
    }


    const { personalInfo, academics, finances, family, background, studyPlan, documents, submittedAt, status: appStatus } = application;
    const currentStatus = appStatus || 'draft';
    
    const allUploadedFiles = documentDisplayList.flatMap(docDef => {
        const docData = documents?.[docDef.id];
        if (docData?.files && docData.files.length > 0) {
            return docData.files.map((file: UploadedFile) => ({
                category: docDef.name,
                ...file
            }));
        }
        return [];
    });

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
                            <p className="text-muted-foreground">App ID: {id} / User ID: {userId || application.userId}</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(currentStatus)} className="text-base">{currentStatus}</Badge>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
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
                                    <DataRow label="Email" value={application.studentEmail || personalInfo.email} />
                                    {/* FIX: Use the safe formatting function */}
                                    <DataRow label="Date of Birth" value={safeFormatDate(personalInfo.dob, 'PPP')} />
                                    <DataRow label="Gender" value={personalInfo.gender} />
                                    <DataRow label="Country of Citizenship" value={personalInfo.countryOfCitizenship} />
                                    <DataRow label="Country of Residence" value={personalInfo.countryOfResidence} />
                                    <DataRow label="Passport Number" value={personalInfo.passportNumber} />
                                    <DataRow label="Address" value={[personalInfo.address, personalInfo.city, personalInfo.province, personalInfo.postalCode].filter(Boolean).join(', ')} />
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
                                    <DataRow label="Sponsor's Relationship" value={finances.primarySponsorRelationship} />
                                    <DataRow label="Sponsor's Address" value={finances.primarySponsorAddress} />
                                    <DataRow label="Sponsor's Phone" value={finances.primarySponsorPhone} />
                                </dl></CardContent>
                            </Card>
                        )}
                        {family && (
                            <Card>
                                <CardHeader><CardTitle>Family Information</CardTitle></CardHeader>
                                <CardContent><dl className="divide-y">
                                    <DataRow label="Marital Status" value={family.maritalStatus} />
                                    {family.spouseName && <DataRow label="Spouse's Name" value={family.spouseName} />}
                                    <DataRow label="Father's Name" value={family.fatherName} />
                                    <DataRow label="Mother's Name" value={family.motherName} />
                                </dl></CardContent>
                            </Card>
                        )}
                        {background && (
                            <Card>
                                <CardHeader><CardTitle>Background Information</CardTitle></CardHeader>
                                <CardContent><dl className="divide-y">
                                    <DataRow label="Visa Refusal" value={`${background.visaRefusal ? `Yes - ${background.visaRefusalDetails}` : 'No'}`} />
                                    <DataRow label="Criminal Record" value={`${background.criminalRecord ? `Yes - ${background.criminalRecordDetails}`: 'No'}`} />
                                    <DataRow label="Unauthorized Overstay" value={`${background.overstay ? `Yes - ${background.overstayDetails}` : 'No'}`} />
                                    <DataRow label="Medical Issues" value={`${background.medicalIssues ? `Yes - ${background.medicalIssuesDetails}` : 'No'}`} />
                                </dl></CardContent>
                            </Card>
                        )}
                         {studyPlan && (
                            <Card>
                                <CardHeader><CardTitle>Study Plan</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold">Why this program?</h4>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{studyPlan.programReason}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Future Goals</h4>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{studyPlan.futureGoals}</p>
                                    </div>
                                </CardContent>
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
                                                        {/* FIX: Use the safe formatting function */}
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
                                    {/* FIX: Use the safe formatting function */}
                                    <DataRow label="Submitted At" value={safeFormatDate(submittedAt, 'PPP p')} />
                                </dl>
                                <Separator />
                                <div className="space-y-2 pt-2">
                                     <label htmlFor="status-select" className="text-sm font-medium">Change Status</label>
                                     <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger id="status-select">
                                            <SelectValue placeholder="Set new status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="Pending Review">Pending Review</SelectItem>
                                            <SelectItem value="Approved">Approved</SelectItem>
                                            <SelectItem value="Action Required">Action Required</SelectItem>
                                            <SelectItem value="Rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button className="w-full" onClick={handleStatusUpdate} disabled={isUpdating || status === currentStatus}>
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
