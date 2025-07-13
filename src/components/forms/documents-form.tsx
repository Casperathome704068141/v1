
'use client';

import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, UploadCloud, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

// Mock data simulating which documents are uploaded, pending, or require action.
// In a real app, this would come from your backend or state management.
const documentStatus = {
  passport: { status: 'Uploaded', url: '/documents/passport.pdf' },
  loa: { status: 'Uploaded', url: '/documents/loa.pdf' },
  proofOfFunds: { status: 'Pending' },
  languageTest: { status: 'Action Required', message: 'Score report is blurry. Please re-upload.' },
  sop: { status: 'Pending' },
  photo: { status: 'Uploaded', url: '/documents/photo.jpg' },
  marriageCert: { status: 'Not Applicable' }, // Example for conditional logic
};

const documentList = [
    { id: 'passport', name: 'Passport Bio Page', required: true },
    { id: 'loa', name: 'Letter of Acceptance (LOA)', required: true },
    { id: 'proofOfFunds', name: 'Proof of Funds', required: true },
    { id: 'languageTest', name: 'Language Test Results', required: true },
    { id: 'sop', name: 'Statement of Purpose (SOP/LOE)', required: true },
    { id: 'photo', name: 'Passport-size Photo', required: true },
    { id: 'marriageCert', name: 'Marriage Certificate', required: false, condition: 'if married and spouse is accompanying' },
];

const getStatusInfo = (status: string) => {
    switch (status) {
        case 'Uploaded':
            return { icon: CheckCircle2, color: 'text-green-500', badgeVariant: 'secondary' };
        case 'Pending':
            return { icon: UploadCloud, color: 'text-muted-foreground', badgeVariant: 'outline' };
        case 'Action Required':
            return { icon: AlertCircle, color: 'text-red-500', badgeVariant: 'destructive' };
        default:
            return { icon: FileText, color: 'text-muted-foreground', badgeVariant: 'outline' };
    }
}


export function DocumentsForm() {
    return (
        <>
            <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>
                    Upload all required documents here. We’ll guide you on file types & naming. You can manage all your uploaded files in the main <Link href="/documents" className="text-primary underline">Document Locker</Link>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <h4 className="text-base font-semibold mb-2">Required Documents</h4>
                        <div className="rounded-md border">
                            {documentList.filter(d => d.required).map((doc, index, arr) => (
                                <div key={doc.id}>
                                    <DocumentItem id={doc.id} name={doc.name} statusData={documentStatus[doc.id as keyof typeof documentStatus]} />
                                    {index < arr.length - 1 && <Separator />}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-base font-semibold mb-2">Optional/Situational Documents</h4>
                         <div className="rounded-md border">
                            {documentList.filter(d => !d.required).map((doc, index, arr) => (
                                <div key={doc.id}>
                                    <DocumentItem id={doc.id} name={doc.name} statusData={documentStatus[doc.id as keyof typeof documentStatus]} condition={doc.condition} />
                                     {index < arr.length - 1 && <Separator />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </>
    );
}

function DocumentItem({ id, name, statusData, condition }: { id: string; name: string; statusData: any; condition?: string; }) {
    const statusInfo = getStatusInfo(statusData?.status);

    if (statusData?.status === 'Not Applicable') return null;

    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
                <statusInfo.icon className={cn("h-6 w-6", statusInfo.color)} />
                <div>
                    <p className="font-medium text-sm">{name}</p>
                    {condition && <p className="text-xs text-muted-foreground">{`Required ${condition}`}</p>}
                    {statusData?.status === 'Action Required' && <p className="text-xs text-red-500">{statusData.message}</p>}
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <Badge variant={statusInfo.badgeVariant} className="hidden sm:inline-flex">{statusData?.status || 'Pending'}</Badge>
                 {statusData?.status === 'Uploaded' ? (
                     <Button variant="outline" size="sm">View</Button>
                 ) : (
                    <Button variant="secondary" size="sm">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                 )}
            </div>
        </div>
    );
}
