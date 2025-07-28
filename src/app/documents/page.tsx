
'use client';

import { AppLayout } from '@/components/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, FileText, UploadCloud, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApplication, UploadedFile, documentList } from '@/context/application-context';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const getStatusInfo = (files?: UploadedFile[]) => {
    if (files && files.length > 0) {
        return { icon: CheckCircle2, badgeVariant: 'success', label: 'Uploaded' };
    }
    return { icon: Circle, badgeVariant: 'secondary', label: 'Pending' };
}

const DocumentTable = ({ docs, uploadedData, title, description, icon: Icon }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Icon className="h-6 w-6 text-primary" />
                <span>{title}</span>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
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
                                    <TableCell className="font-medium">{doc.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusInfo.badgeVariant} className="flex items-center w-fit">
                                            <statusInfo.icon className="mr-1.5 h-3 w-3" />
                                            {statusInfo.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {docData?.files?.length > 0 ? (
                                            <ul className="space-y-1.5">
                                                {docData.files.map((file: UploadedFile) => (
                                                    <li key={file.date} className="font-mono flex items-center gap-2">
                                                        <FileText className="h-3 w-3" />
                                                        <span>{file.fileName} - {format(new Date(file.date), 'MMM d, yyyy')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
);

function DocumentsPageContent() {
    const { applicationData } = useApplication();
    const { documents } = applicationData;

    const requiredDocs = documentList.filter(d => d.category === 'Core');
    const situationalDocs = documentList.filter(d => d.category === 'Situational');

    return (
        <main className="flex-1 space-y-8 p-4 md:p-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Document Locker</h1>
                <p className="text-muted-foreground mt-1">Your central hub for all application-related documents.</p>
            </div>
            
            <div className="space-y-8">
                <DocumentTable 
                    docs={requiredDocs} 
                    uploadedData={documents}
                    title="Required Documents"
                    description="These documents are mandatory for your study permit application."
                    icon={ShieldCheck}
                />
                <DocumentTable 
                    docs={situationalDocs} 
                    uploadedData={documents}
                    title="Situational & Recommended"
                    description="These documents may be required based on your specific situation."
                    icon={FileText}
                />
            </div>
            
            <Card className="bg-gradient-to-r from-primary/5 to-transparent">
                <CardHeader className="flex-row items-center gap-6">
                     <div className="p-4 bg-primary/10 rounded-full">
                         <UploadCloud className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <CardTitle>Manage Your Documents</CardTitle>
                        <CardDescription className="mt-1">
                            Need to upload, replace, or delete a file? Go to the application form.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/application?step=documents">Go to Upload Section <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>

        </main>
    )
}

export default function DocumentsPage() {
  return (
    <AppLayout>
      <DocumentsPageContent />
    </AppLayout>
  );
}
