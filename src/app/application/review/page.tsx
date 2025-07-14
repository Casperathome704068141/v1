
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useApplication } from '@/context/application-context';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, FileText, AlertTriangle, Send } from 'lucide-react';
import { format } from 'date-fns';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-left sm:text-right font-medium text-foreground">{String(value)}</dd>
    </div>
  );
}

function ApplicationReviewContent() {
  const { applicationData, resetApplicationData } = useApplication();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { personalInfo, academics, language, finances, studyPlan, family, background, documents } = applicationData;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const user = auth.currentUser;
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to submit an application.',
        });
        setIsSubmitting(false);
        return;
    }

    try {
        await addDoc(collection(db, 'applications'), {
            ...applicationData,
            userId: user.uid,
            studentName: `${personalInfo?.givenNames} ${personalInfo?.surname}`,
            studentEmail: user.email,
            status: 'Pending Review',
            submittedAt: serverTimestamp(),
        });

        toast({
            title: 'Application Submitted!',
            description: 'Your application has been sent for processing. We will be in touch.',
        });
        
        resetApplicationData();
        router.push('/dashboard');

    } catch (error) {
        console.error("Error submitting application: ", error);
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: 'There was an error submitting your application. Please try again.',
        });
        setIsSubmitting(false);
    }
  };

  const requiredDocIds = ['passport', 'loa', 'proofOfFunds', 'languageTest', 'sop', 'photo'];
  const allDocsUploaded = requiredDocIds.every(docId => documents?.[docId]?.status === 'Uploaded');
  const documentList = [
    { id: 'passport', name: 'Passport' },
    { id: 'loa', name: 'Letter of Acceptance' },
    { id: 'proofOfFunds', name: 'Proof of Funds' },
    { id: 'languageTest', name: 'Language Test' },
    { id: 'sop', name: 'Statement of Purpose' },
    { id: 'photo', name: 'Digital Photo' },
  ]


  return (
    <main className="flex-1 space-y-6 p-4 md:p-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold">Review Your Application</h1>
        <p className="text-muted-foreground">Please carefully review all the information below before final submission.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {personalInfo && (
            <Card>
              <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
              <CardContent>
                <dl className="divide-y">
                  <DataRow label="Full Name" value={`${personalInfo.givenNames} ${personalInfo.surname}`} />
                  <DataRow label="Date of Birth" value={personalInfo.dob ? format(new Date(personalInfo.dob), 'PPP') : ''} />
                  <DataRow label="Gender" value={personalInfo.gender} />
                  <DataRow label="Marital Status" value={personalInfo.maritalStatus} />
                  <DataRow label="Country of Birth" value={personalInfo.countryOfBirth} />
                  <DataRow label="Citizenship" value={personalInfo.countryOfCitizenship} />
                  <DataRow label="Passport" value={personalInfo.passportNumber} />
                </dl>
              </CardContent>
            </Card>
          )}

          {academics && (
            <Card>
              <CardHeader><CardTitle>Academic & Work History</CardTitle></CardHeader>
              <CardContent>
                <h4 className="mb-2 text-sm font-semibold">Education</h4>
                {academics.educationHistory?.map((item, index) => (
                    <div key={index} className="mb-2 text-sm text-muted-foreground">{item.program} at {item.institutionName}</div>
                ))}
                <Separator className="my-4" />
                <h4 className="mb-2 text-sm font-semibold">Work</h4>
                 {academics.employmentHistory?.map((item, index) => (
                    <div key={index} className="mb-2 text-sm text-muted-foreground">{item.position} at {item.employer}</div>
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
                  <DataRow label="Proof of Funds" value={finances.proofType?.join(', ')} />
                 </dl>
              </CardContent>
            </Card>
          )}

        </div>

        <div className="space-y-8 lg:col-span-1">
            <Card className={allDocsUploaded ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {allDocsUploaded ? <CheckCircle className="text-green-600" /> : <AlertTriangle className="text-red-600" />}
                    Document Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                    {allDocsUploaded 
                        ? 'All required documents have been uploaded.' 
                        : 'You are missing one or more required documents. Please complete the uploads before submitting.'}
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                    {documentList.map(doc => (
                        <li key={doc.id} className="flex items-center gap-2">
                           {documents?.[doc.id]?.status === 'Uploaded' 
                           ? <CheckCircle className="h-4 w-4 text-green-500" />
                           : <FileText className="h-4 w-4 text-muted-foreground" />}
                           <span>{doc.name}</span>
                        </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Final Submission</CardTitle>
                    <CardDescription>
                        Once you submit, your application will be locked and sent for review.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full" size="lg" onClick={handleSubmit} disabled={!allDocsUploaded || isSubmitting}>
                        <Send className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Submitting...' : 'Confirm & Submit Application'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </main>
  );
}


export default function ApplicationReviewPage() {
    return (
        <AppLayout>
            <ApplicationReviewContent />
        </AppLayout>
    )
}
