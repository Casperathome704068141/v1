
'use client';

import { AppLayout } from '@/components/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, FileText, UploadCloud } from 'lucide-react';
import { useApplication } from '@/context/application-context';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const documentList = [
    { id: 'passport', name: 'Passport Bio Page', required: true },
    { id: 'loa', name: 'Letter of Acceptance (LOA)', required: true },
    { id: 'proofOfFunds', name: 'Proof of Funds', required: true },
    { id: 'languageTest', name: 'Language Test Results', required: true },
    { id: 'sop', name: 'Statement of Purpose (SOP/LOE)', required: true },
    { id: 'photo', name: 'Digital Photo', required: true },
    { id: 'marriageCert', name: 'Marriage Certificate', required: false },
    { id: 'eca', name: 'Educational Credential Assessment (ECA)', required: false },
];

function getStatusInfo(status?: string) {
    switch (status) {
        case 'Uploaded':
            return { icon: CheckCircle2, color: 'text-green-500', badgeVariant: 'default' as const, label: 'Uploaded' };
        default:
            return { icon: Circle, color: 'text-muted-foreground', badgeVariant: 'secondary' as const, label: 'Pending' };
    }
}


function DocumentsPageContent() {
    const { applicationData } = useApplication();
    const { documents } = applicationData;

    const isMarried = applicationData.family?.maritalStatus === 'married';
    const requiredDocs = documentList.filter(d => d.required);
    const optionalDocs = documentList.filter(d => !d.required && (d.id !== 'marriageCert' || isMarried));

    return (
        <main className="flex-1 space-y-6 p-4 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold">Document Locker</h1>
                <p className="text-muted-foreground">Last updated: {format(new Date(), 'PPP')}</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Required Documents</CardTitle>
                    <CardDescription>These documents are mandatory for your study permit application.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DocumentTable docs={requiredDocs} uploadedData={documents} />
                </CardContent>
            </Card>

            {optionalDocs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Optional &amp; Situational Documents</CardTitle>
                        <CardDescription>These documents are required based on your specific situation (e.g., if you are married).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DocumentTable docs={optionalDocs} uploadedData={documents} />
                    </CardContent>
                </Card>
            )}

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="p-3 bg-primary/10 rounded-full">
                         <UploadCloud className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-primary">Need to upload files?</CardTitle>
                        <CardDescription className="text-primary/80">
                            You can upload and manage your files directly in the <Link href="/application?step=documents" className="font-semibold underline">Application</Link> section.
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>

        </main>
    )
}

function DocumentTable({ docs, uploadedData }: { docs: typeof documentList, uploadedData: any }) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40%]">Document Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>File Name</TableHead>
                        <TableHead className="text-right">Last Updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {docs.map(doc => {
                        const docData = uploadedData?.[doc.id];
                        const statusInfo = getStatusInfo(docData?.status);
                        return (
                            <TableRow key={doc.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    {doc.name}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusInfo.badgeVariant} className={cn(statusInfo.badgeVariant === 'default' && 'bg-green-100 text-green-800 hover:bg-green-200')}>
                                        <statusInfo.icon className="mr-1.5 h-3 w-3" />
                                        {statusInfo.label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-xs">{docData?.fileName || 'N/A'}</TableCell>
                                <TableCell className="text-right text-xs text-muted-foreground">{docData?.date ? format(new Date(docData.date), 'PP') : '-'}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

export default function DocumentsPage() {
  return (
    <AppLayout>
      <DocumentsPageContent />
    </AppLayout>
  );
}
