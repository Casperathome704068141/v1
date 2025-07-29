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
import { useState } from "react";
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

function DocumentItem({ docInfo }: { docInfo: typeof documentList[0] }) {
    const { user } = useAuth();
    const { applicationData, updateStepData } = useApplication();
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    
    const statusData = applicationData.documents?.[docInfo.id];

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
            const description = error.code === 'storage/unauthorized'
                ? `Permission denied. Please check your Storage rules to allow uploads for path: users/${user.uid}/...`
                : `Could not upload ${file.name}.`;
            toast({ variant: 'destructive', title: 'Upload Failed', description });
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
            
            if (currentDoc?.files) {
                currentDoc.files = currentDoc.files.filter((f: UploadedFile) => f.path !== fileToDelete.path);
                if (currentDoc.files.length === 0) {
                    currentDoc.status = 'Pending';
                }
                await updateStepData('documents', newDocumentsData);
            }
            toast({ title: 'File Deleted', description: `${fileToDelete.fileName} has been deleted.` });
        } catch (error: any) {
            console.error("Delete error:", error);
             const description = error.code === 'storage/unauthorized'
                ? `Permission denied. Please check your Storage rules.`
                : `Could not delete ${fileToDelete.fileName}.`;
            toast({ variant: 'destructive', title: 'Delete Failed', description });
        } finally {
            setIsUploading(false);
        }
    };

    const statusInfo = getStatusInfo(statusData?.files);
    const allowMultiple = ['educationDocs', 'proofOfFunds', 'tiesToHome', 'travelHistory'].includes(docInfo.id);

    return (
        <div>
            <div className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        <statusInfo.icon className={cn("h-6 w-6 flex-shrink-0 mt-1 sm:mt-0", statusInfo.color)} />
                        <div className="flex-1">
                            <p className="font-medium text-sm">{docInfo.name}</p>
                            <p className="text-xs text-muted-foreground">{docInfo.description}</p>
                            {allowMultiple && (
                                <p className="text-xs text-primary/80 mt-1">You can upload multiple files for this category.</p>
                            )}
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
                            <div key={file.path} className={cn("flex items-center justify-between text-sm p-2 rounded-md", statusInfo.badgeVariant === 'default' ? 'bg-success/10' : 'bg-muted/50')}>
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
    const coreDocs = documentList.filter(d => d.category === 'Core');
    const situationalDocs = documentList.filter(d => d.category === 'Situational');

    return (
        <>
            <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>
                    Upload all required documents for your application. You can manage all your uploaded files later in the main <Link href="/documents" className="text-primary underline">Document Locker</Link>.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-6">
                    <div>
                        <h4 className="text-base font-semibold mb-2 px-4">Core Documents</h4>
                        <div className="rounded-md border">
                            {coreDocs.map((doc, index, arr) => (
                                <React.Fragment key={doc.id}>
                                    <DocumentItem docInfo={doc} />
                                    {index < arr.length - 1 && <Separator />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    
                    {situationalDocs.length > 0 && (
                         <div>
                            <h4 className="text-base font-semibold mb-2 px-4">Situational & Recommended Documents</h4>
                            <div className="rounded-md border">
                                {situationalDocs.map((doc, index, arr) => (
                                    <React.Fragment key={doc.id}>
                                        <DocumentItem docInfo={doc} />
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
