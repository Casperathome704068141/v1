
'use client';

import { AppLayout } from '@/components/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, FileText, UploadCloud } from 'lucide-react';
import { useApplication, UploadedFile, documentList } from '@/context/application-context';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function getStatusInfo(files?: UploadedFile[]) {
    if (files && files.length > 0) {
        return { icon: CheckCircle2, color: 'text-green-500', badgeVariant: 'default' as const, label: 'Uploaded' };
    }
    return { icon: Circle, color: 'text-muted-foreground', badgeVariant: 'secondary' as const, label: 'Pending' };
}


function DocumentsPageContent() {
    const { applicationData } = useApplication();
    const { documents } = applicationData;

    const requiredDocs = documentList.filter(d => d.category === 'Core');
    const situationalDocs = documentList.filter(d => d.category === 'Situational');

    return (
        <main className="flex-1 space-y-6 p-4 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold">Document Locker</h1>
                <p className="text-muted-foreground">Your central hub for all application documents.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Core Required Documents</CardTitle>
                    <CardDescription>These documents are mandatory for your study permit application.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DocumentTable docs={requiredDocs} uploadedData={documents} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Situational & Recommended Documents</CardTitle>
                    <CardDescription>These documents may be required based on your specific situation (e.g., if you are married, have a study gap, or have a sponsor).</CardDescription>
                </CardHeader>
                <CardContent>
                    <DocumentTable docs={situationalDocs} uploadedData={documents} />
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="p-3 bg-primary/10 rounded-full">
                         <UploadCloud className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-primary">Need to upload more files?</CardTitle>
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
                        <TableHead>Uploaded Files</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {docs.map(doc => {
                        const docData = uploadedData?.[doc.id];
                        const statusInfo = getStatusInfo(docData?.files);
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
                                <TableCell className="text-xs">
                                    {docData?.files && docData.files.length > 0 ? (
                                        <ul className="space-y-1">
                                            {docData.files.map((file: UploadedFile) => (
                                                <li key={file.date} className="font-mono text-xs">
                                                    {file.fileName} ({format(new Date(file.date), 'PP')})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        'N/A'
                                    )}
                                </TableCell>
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