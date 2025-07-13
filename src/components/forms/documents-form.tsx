
'use client';

import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, UploadCloud, FileText, WandSparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { useApplication } from "@/context/application-context";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const documentList = [
    { id: 'passport', name: 'Passport Bio Page', required: true, description: 'A clear, full-color scan of your passport\'s photo page.' },
    { id: 'loa', name: 'Letter of Acceptance (LOA)', required: true, description: 'The official acceptance letter from your DLI.' },
    { id: 'proofOfFunds', name: 'Proof of Funds', required: true, description: 'Bank statements, GIC certificate, or loan approval letters.' },
    { id: 'languageTest', name: 'Language Test Results', required: true, description: 'Your official IELTS, TOEFL, PTE, or other test score report.' },
    { id: 'sop', name: 'Statement of Purpose (SOP/LOE)', required: true, description: 'Your letter explaining your study plans and goals.' },
    { id: 'photo', name: 'Digital Photo', required: true, description: 'A recent passport-style photo with a white background.' },
    { id: 'marriageCert', name: 'Marriage Certificate', required: false, condition: 'if married and spouse is accompanying', description: 'Required only if your spouse is coming with you.' },
    { id: 'eca', name: 'Educational Credential Assessment (ECA)', required: false, condition: 'if required by your program', description: 'Often needed for post-graduate or professional programs.' },
];

const getStatusInfo = (status?: string) => {
    switch (status) {
        case 'Uploaded':
            return { icon: CheckCircle2, color: 'text-green-500', badgeVariant: 'secondary' as const };
        case 'Action Required':
            return { icon: AlertCircle, color: 'text-red-500', badgeVariant: 'destructive' as const };
        default:
            return { icon: FileText, color: 'text-muted-foreground', badgeVariant: 'outline' as const };
    }
}


export function DocumentsForm() {
    const { applicationData, updateStepData } = useApplication();
    const router = useRouter();

    const [docStatus, setDocStatus] = useState(applicationData.documents || {});

    const handleUpload = (docId: string, fileName: string) => {
        const newStatus = {
            ...docStatus,
            [docId]: { 
                status: 'Uploaded', 
                url: `/documents/${fileName}`, // This is a mock URL
                fileName: fileName,
                date: new Date().toISOString() // Add a timestamp
            }
        };
        setDocStatus(newStatus);
        updateStepData('documents', newStatus);
    };

    const isMarried = applicationData.family?.maritalStatus === 'married';
    
    const requiredDocs = documentList.filter(d => d.required);
    const optionalDocs = documentList.filter(d => !d.required && (d.id !== 'marriageCert' || isMarried));

    return (
        <>
            <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>
                    Upload all required documents here. We’ll guide you on file types & naming. You can manage all your uploaded files in the main <Link href="/documents" className="text-primary underline">Document Locker</Link>.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                 <FileUploadDropzone onUpload={handleUpload} />

                <div className="space-y-6">
                    <div>
                        <h4 className="text-base font-semibold mb-2">Required Documents</h4>
                        <div className="rounded-md border">
                            {requiredDocs.map((doc, index, arr) => (
                                <div key={doc.id}>
                                    <DocumentItem 
                                        id={doc.id} 
                                        name={doc.name} 
                                        description={doc.description}
                                        statusData={docStatus[doc.id as keyof typeof docStatus]}
                                        onUpload={handleUpload}
                                        router={router}
                                    />
                                    {index < arr.length - 1 && <Separator />}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {optionalDocs.length > 0 && (
                        <div>
                            <h4 className="text-base font-semibold mb-2">Optional/Situational Documents</h4>
                            <div className="rounded-md border">
                                {optionalDocs.map((doc, index, arr) => (
                                    <div key={doc.id}>
                                        <DocumentItem 
                                            id={doc.id} 
                                            name={doc.name} 
                                            description={doc.description}
                                            statusData={docStatus[doc.id as keyof typeof docStatus]}
                                            condition={doc.condition} 
                                            onUpload={handleUpload}
                                            router={router}
                                        />
                                        {index < arr.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </>
    );
}

function FileUploadDropzone({ onUpload }: { onUpload: (docId: string, fileName: string) => void }) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            const docIdGuess = file.name.split('.')[0].toLowerCase().replace(/[^a-z0-9]/gi, '');
            const matchingDoc = documentList.find(d => docIdGuess.includes(d.id.toLowerCase()));
            if (matchingDoc) {
                onUpload(matchingDoc.id, file.name);
            } else {
                // Fallback for unmatched files - maybe open a dialog in a real app
                console.warn(`Could not match file: ${file.name}`);
            }
        });
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'application/pdf':[], 'image/jpeg':[], 'image/png':[]} });

    return (
        <div {...getRootProps()} className={cn("border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
        )}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <UploadCloud className="h-10 w-10" />
                <p className="font-semibold">
                    {isDragActive ? "Drop the files here..." : "Drag & drop files here, or click to select"}
                </p>
                <p className="text-xs">PDF, JPG, PNG (Max 5MB per file)</p>
            </div>
        </div>
    )
}


function DocumentItem({ id, name, description, statusData, condition, onUpload, router }: { 
    id: string; 
    name: string; 
    description: string;
    statusData: any; 
    condition?: string; 
    onUpload: (docId: string, fileName: string) => void;
    router: any;
}) {
    const statusInfo = getStatusInfo(statusData?.status);

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
            <div className="flex items-start gap-4">
                <statusInfo.icon className={cn("h-6 w-6 flex-shrink-0 mt-1 sm:mt-0", statusInfo.color)} />
                <div className="flex-1">
                    <p className="font-medium text-sm">{name}</p>
                    <p className="text-xs text-muted-foreground">{description} {condition && `(Required ${condition})`}</p>
                    {statusData?.status === 'Action Required' && <p className="text-xs text-red-500">{statusData.message}</p>}
                    {statusData?.status === 'Uploaded' && <p className="text-xs font-mono text-green-600 truncate">{statusData.fileName}</p>}
                </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                 <Badge variant={statusInfo.badgeVariant} className="hidden md:inline-flex w-28 justify-center">{statusData?.status || 'Pending'}</Badge>
                 {id === 'sop' && statusData?.status !== 'Uploaded' && (
                     <Button variant="outline" size="sm" onClick={() => router.push('/application?step=plan')}>
                        <WandSparkles className="mr-2 h-4 w-4" />
                        Generate
                    </Button>
                 )}
                 {statusData?.status === 'Uploaded' ? (
                     <Button variant="outline" size="sm" disabled>Uploaded</Button>
                 ) : (
                    <Button variant="secondary" size="sm" asChild>
                        <label>
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Upload
                            <input type="file" className="sr-only" onChange={(e) => e.target.files && onUpload(id, e.target.files[0].name)} />
                        </label>
                    </Button>
                 )}
            </div>
        </div>
    );
}
