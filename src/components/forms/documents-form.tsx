'use client';

import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, UploadCloud, FileText, WandSparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { useApplication, UploadedFile, documentList } from "@/context/application-context";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const getStatusInfo = (files?: UploadedFile[]) => {
    if (files && files.length > 0) {
        return { icon: CheckCircle2, color: 'text-green-500', badgeVariant: 'secondary' as const, label: 'Uploaded' };
    }
    return { icon: FileText, color: 'text-muted-foreground', badgeVariant: 'outline' as const, label: 'Pending' };
}

export function DocumentsForm() {
    const { applicationData, updateStepData } = useApplication();
    const router = useRouter();

    const [docData, setDocData] = useState(applicationData.documents || {});

    const updateAndPersist = (newDocData: any) => {
        setDocData(newDocData);
        updateStepData('documents', newDocData);
    };

    const handleUpload = useCallback((docId: string, file: File) => {
        const newFile: UploadedFile = {
            fileName: file.name,
            url: `/documents/${file.name}`, // This is a mock URL
            date: new Date().toISOString()
        };

        const newDocData = { ...docData };
        const currentDoc = newDocData[docId] || { files: [] };
        
        newDocData[docId] = {
            ...currentDoc,
            status: 'Uploaded',
            files: [...currentDoc.files, newFile]
        };

        updateAndPersist(newDocData);
    }, [docData]);

    const handleDelete = (docId: string, fileToDelete: UploadedFile) => {
        const newDocData = { ...docData };
        const currentDoc = newDocData[docId];
        if (!currentDoc) return;

        currentDoc.files = currentDoc.files.filter(f => f.fileName !== fileToDelete.fileName || f.date !== fileToDelete.date);
        
        if (currentDoc.files.length === 0) {
            currentDoc.status = 'Pending';
        }

        updateAndPersist(newDocData);
    };

    const coreDocs = documentList.filter(d => d.category === 'Core');
    const situationalDocs = documentList.filter(d => d.category === 'Situational');

    return (
        <>
            <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>
                    Upload all required documents here. You can manage all your uploaded files in the main <Link href="/documents" className="text-primary underline">Document Locker</Link>.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <FileUploadDropzone onFileUpload={handleUpload} />

                <div className="space-y-6">
                    <div>
                        <h4 className="text-base font-semibold mb-2">Core Documents</h4>
                        <div className="rounded-md border">
                            {coreDocs.map((doc, index, arr) => (
                                <div key={doc.id}>
                                    <DocumentItem 
                                        docInfo={doc}
                                        statusData={docData[doc.id]}
                                        onUpload={handleUpload}
                                        onDelete={handleDelete}
                                        router={router}
                                    />
                                    {index < arr.length - 1 && <Separator />}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {situationalDocs.length > 0 && (
                        <div>
                            <h4 className="text-base font-semibold mb-2">Situational & Recommended Documents</h4>
                            <div className="rounded-md border">
                                {situationalDocs.map((doc, index, arr) => (
                                    <div key={doc.id}>
                                        <DocumentItem 
                                            docInfo={doc}
                                            statusData={docData[doc.id]}
                                            onUpload={handleUpload}
                                            onDelete={handleDelete}
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

function FileUploadDropzone({ onFileUpload }: { onFileUpload: (docId: string, file: File) => void }) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            const docIdGuess = file.name.split('.')[0].toLowerCase().replace(/[^a-z0-9]/gi, '');
            const matchingDoc = documentList.find(d => docIdGuess.includes(d.id.toLowerCase()));
            if (matchingDoc) {
                onFileUpload(matchingDoc.id, file);
            } else {
                console.warn(`Could not match file: ${file.name}`);
            }
        });
    }, [onFileUpload]);

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

function DocumentItem({ docInfo, statusData, onUpload, onDelete, router }: { 
    docInfo: typeof documentList[0];
    statusData: any; 
    onUpload: (docId: string, file: File) => void;
    onDelete: (docId: string, file: UploadedFile) => void;
    router: any;
}) {
    const statusInfo = getStatusInfo(statusData?.files);

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <statusInfo.icon className={cn("h-6 w-6 flex-shrink-0 mt-1 sm:mt-0", statusInfo.color)} />
                    <div className="flex-1">
                        <p className="font-medium text-sm">{docInfo.name}</p>
                        <p className="text-xs text-muted-foreground">{docInfo.description}</p>
                        {statusData?.status === 'Action Required' && <p className="text-xs text-red-500">{statusData.message}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                     <Badge variant={statusInfo.badgeVariant} className="hidden md:inline-flex w-28 justify-center">{statusInfo.label}</Badge>
                     <Button variant="secondary" size="sm" asChild>
                        <label>
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Upload
                            <input type="file" className="sr-only" onChange={(e) => e.target.files && onUpload(docInfo.id, e.target.files[0])} />
                        </label>
                    </Button>
                </div>
            </div>
             {statusData?.files?.length > 0 && (
                <div className="mt-4 pl-10 space-y-2">
                    {statusData.files.map((file: UploadedFile) => (
                        <div key={file.date} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md">
                            <div className="flex items-center gap-2 truncate">
                                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-mono text-xs truncate" title={file.fileName}>{file.fileName}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(docInfo.id, file)}>
                                <Trash2 className="h-3 w-3 text-destructive" />
                                <span className="sr-only">Delete file</span>
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}