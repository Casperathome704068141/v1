
'use client';
import * as React from 'react';
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, UploadCloud, Trash2, Loader2, Circle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { useApplication, UploadedFile, documentList } from "@/context/application-context";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "@/context/auth-context";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";

const getStatusInfo = (files?: UploadedFile[]) => {
    if (files && files.length > 0) {
        return { icon: CheckCircle2, color: 'text-green-500', badgeVariant: 'default' as const, label: 'Uploaded' };
    }
    return { icon: Circle, color: 'text-muted-foreground', badgeVariant: 'secondary' as const, label: 'Pending' };
}

function FileUploadDropzone({ isUploading, onDrop }: { isUploading: boolean, onDrop: (acceptedFiles: File[]) => void }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: {'application/pdf':[], 'image/jpeg':[], 'image/png':[]},
        disabled: isUploading 
    });

    return (
        <div {...getRootProps()} className={cn("border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isUploading ? "cursor-not-allowed bg-muted/50" : "cursor-pointer",
            isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
        )}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                {isUploading ? (
                    <>
                        <Loader2 className="h-10 w-10 animate-spin" />
                        <p className="font-semibold">Processing uploads...</p>
                    </>
                ) : (
                    <>
                        <UploadCloud className="h-10 w-10" />
                        <p className="font-semibold">
                            {isDragActive ? "Drop the files here..." : "Drag & drop files here, or click to select"}
                        </p>
                        <p className="text-xs">PDF, JPG, PNG (Max 5MB per file)</p>
                    </>
                )}
            </div>
        </div>
    );
}

function DocumentItem({ docInfo, statusData }: { docInfo: typeof documentList[0], statusData: DocumentStatus | undefined }) {
    const { user } = useAuth();
    const { applicationData, updateStepData } = useApplication();
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (file: File | null) => {
        if (!file || !user) return;
        setIsUploading(true);

        try {
            const storagePath = `users/${user.uid}/documents/${docInfo.id}/${file.name}`;
            const storageRef = ref(storage, storagePath);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            const newFile: UploadedFile = {
                fileName: file.name,
                url: downloadURL,
                date: new Date().toISOString(),
                path: storagePath,
            };
            
            const newDocumentsData = structuredClone(applicationData.documents || {});
            const currentDoc = newDocumentsData[docInfo.id] || { status: 'Pending', files: [] };
            
            currentDoc.files.push(newFile);
            currentDoc.status = 'Uploaded';
            newDocumentsData[docInfo.id] = currentDoc;

            await updateStepData('documents', newDocumentsData);

            toast({ title: 'File Uploaded', description: `${file.name} was successfully uploaded.` });
        } catch (error: any) {
            console.error("Upload error:", error);
            toast({ variant: 'destructive', title: 'Upload Failed', description: `Could not upload ${file.name}.` });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (fileToDelete: UploadedFile) => {
        if (!user) return;
        const confirm = window.confirm(`Are you sure you want to delete ${fileToDelete.fileName}?`);
        if (!confirm) return;
        
        setIsUploading(true);

        try {
            const fileRef = ref(storage, fileToDelete.path);
            await deleteObject(fileRef);

            const newDocumentsData = structuredClone(applicationData.documents || {});
            const currentDoc = newDocumentsData[docInfo.id];
            if (!currentDoc) return;

            currentDoc.files = currentDoc.files.filter((f: UploadedFile) => f.path !== fileToDelete.path);
            if (currentDoc.files.length === 0) {
                currentDoc.status = 'Pending';
            }
            
            await updateStepData('documents', newDocumentsData);

            toast({ title: 'File Deleted', description: `${fileToDelete.fileName} has been deleted.` });
        } catch (error: any) {
            console.error("Delete error:", error);
            toast({ variant: 'destructive', title: 'Delete Failed', description: `Could not delete ${fileToDelete.fileName}.` });
        } finally {
            setIsUploading(false);
        }
    };

    const statusInfo = getStatusInfo(statusData?.files);

    return (
        <div>
            <div className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        <statusInfo.icon className={cn("h-6 w-6 flex-shrink-0 mt-1 sm:mt-0", statusInfo.color)} />
                        <div className="flex-1">
                            <p className="font-medium text-sm">{docInfo.name}</p>
                            <p className="text-xs text-muted-foreground">{docInfo.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <Badge variant={statusInfo.badgeVariant} className={cn("hidden md:inline-flex w-28 justify-center", statusInfo.badgeVariant === 'default' && 'bg-green-100 text-green-800')}>{statusInfo.label}</Badge>
                        <Button variant="secondary" size="sm" asChild disabled={isUploading}>
                            <label className={cn("cursor-pointer", isUploading && "cursor-not-allowed")}>
                                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                                Upload
                                <input type="file" className="sr-only" disabled={isUploading} onChange={(e) => handleFileUpload(e.target.files ? e.target.files[0] : null)} />
                            </label>
                        </Button>
                    </div>
                </div>
                {statusData?.files?.length > 0 && (
                    <div className="mt-4 pl-10 space-y-2">
                        {statusData.files.map((file: UploadedFile) => (
                            <div key={file.path} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md">
                                <div className="flex items-center gap-2 truncate">
                                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <Link href={file.url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs truncate hover:underline" title={file.fileName}>{file.fileName}</Link>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDelete(file)} disabled={isUploading}>
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                    <span className="sr-only">Delete file</span>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export function DocumentsForm() {
    const { applicationData, updateStepData } = useApplication();
    const { user } = useAuth();
    const { toast } = useToast();
    const [isDropzoneUploading, setIsDropzoneUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!user) return;
        setIsDropzoneUploading(true);
        
        let filesUploadedCount = 0;
        const newDocumentsData = structuredClone(applicationData.documents || {});

        for (const file of acceptedFiles) {
            const docIdGuess = file.name.split('.')[0].toLowerCase().replace(/[^a-z0-9]/gi, '');
            const matchingDoc = documentList.find(d => docIdGuess.includes(d.id.toLowerCase()));

            if (!matchingDoc) {
                toast({ variant: 'destructive', title: 'File Not Recognized', description: `Could not categorize '${file.name}'. Please use individual upload buttons.` });
                continue;
            }

            try {
                const storagePath = `users/${user.uid}/documents/${matchingDoc.id}/${file.name}`;
                const storageRef = ref(storage, storagePath);
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                const newFile: UploadedFile = { fileName: file.name, url: downloadURL, date: new Date().toISOString(), path: storagePath };

                const currentDoc = newDocumentsData[matchingDoc.id] || { status: 'Pending', files: [] };
                currentDoc.files.push(newFile);
                currentDoc.status = 'Uploaded';
                newDocumentsData[matchingDoc.id] = currentDoc;
                filesUploadedCount++;
            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Upload Failed', description: `Could not upload ${file.name}.` });
            }
        }

        if (filesUploadedCount > 0) {
            await updateStepData('documents', newDocumentsData);
            toast({ title: 'Uploads Complete', description: `${filesUploadedCount} file(s) were successfully uploaded.` });
        }

        setIsDropzoneUploading(false);
    }, [user, applicationData.documents, toast, updateStepData]);

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
                <FileUploadDropzone 
                    isUploading={isDropzoneUploading}
                    onDrop={onDrop}
                />

                <div className="space-y-6">
                    <div>
                        <h4 className="text-base font-semibold mb-2">Core Documents</h4>
                        <div className="rounded-md border">
                            {coreDocs.map((doc, index, arr) => (
                                <React.Fragment key={doc.id}>
                                    <DocumentItem docInfo={doc} statusData={applicationData.documents?.[doc.id]} />
                                    {index < arr.length - 1 && <Separator />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    
                    {situationalDocs.length > 0 && (
                         <div>
                            <h4 className="text-base font-semibold mb-2">Situational & Recommended Documents</h4>
                            <div className="rounded-md border">
                                {situationalDocs.map((doc, index, arr) => (
                                    <React.Fragment key={doc.id}>
                                        <DocumentItem docInfo={doc} statusData={applicationData.documents?.[doc.id]} />
                                        {index < arr.length - 1 && <Separator />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </>
    );
}
