
'use client';

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

export function DocumentsForm() {
    const { applicationData, updateStepData } = useApplication();
    const { user } = useAuth();
    const { toast } = useToast();
    const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

    const handleFileUpload = async (file: File | null, docId: string) => {
        if (!file || !user || uploadingDocId) return;

        setUploadingDocId(docId);

        try {
            const storageRef = ref(storage, `users/${user.uid}/documents/${docId}/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            const newFile: UploadedFile = { fileName: file.name, url: downloadURL, date: new Date().toISOString() };
            
            const newDocumentsData = structuredClone(applicationData.documents || {});
            const currentDoc = newDocumentsData[docId] || { status: 'Pending', files: [] };
            
            currentDoc.files.push(newFile);
            currentDoc.status = 'Uploaded';
            newDocumentsData[docId] = currentDoc;

            updateStepData('documents', newDocumentsData);

            toast({ title: 'File Uploaded', description: `${file.name} was successfully uploaded.` });
        } catch (error: any) {
            console.error("Upload error:", error);
            toast({ variant: 'destructive', title: 'Upload Failed', description: `Could not upload ${file.name}. Check console for details.` });
        } finally {
            setUploadingDocId(null);
        }
    };

    const handleDelete = async (fileToDelete: UploadedFile, docId: string) => {
        if (!user || uploadingDocId) return;

        const confirm = window.confirm(`Are you sure you want to delete ${fileToDelete.fileName}?`);
        if (!confirm) return;
        
        setUploadingDocId(docId);

        try {
            const fileRef = ref(storage, fileToDelete.url);
            await deleteObject(fileRef);

            const newDocumentsData = structuredClone(applicationData.documents || {});
            const currentDoc = newDocumentsData[docId];
            if (!currentDoc) return;

            currentDoc.files = currentDoc.files.filter((f: UploadedFile) => f.url !== fileToDelete.url);
            if (currentDoc.files.length === 0) {
                currentDoc.status = 'Pending';
            }
            
            updateStepData('documents', newDocumentsData);

            toast({ title: 'File Deleted', description: `${fileToDelete.fileName} has been deleted.` });
        } catch (error: any) {
            console.error("Delete error:", error);
            toast({ variant: 'destructive', title: 'Delete Failed', description: `Could not delete ${fileToDelete.fileName}.` });
        } finally {
            setUploadingDocId(null);
        }
    };
    
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!user || uploadingDocId) return;

        let filesUploadedCount = 0;
        setUploadingDocId('dropzone'); // Set a general loading state for dropzone

        for (const file of acceptedFiles) {
            const docIdGuess = file.name.split('.')[0].toLowerCase().replace(/[^a-z0-9]/gi, '');
            const matchingDoc = documentList.find(d => docIdGuess.includes(d.id.toLowerCase()));
            
            if (matchingDoc) {
                try {
                    const storageRef = ref(storage, `users/${user.uid}/documents/${matchingDoc.id}/${file.name}`);
                    await uploadBytes(storageRef, file);
                    const downloadURL = await getDownloadURL(storageRef);

                    const newFile: UploadedFile = { fileName: file.name, url: downloadURL, date: new Date().toISOString() };

                    const newDocumentsData = structuredClone(applicationData.documents || {});
                    const currentDoc = newDocumentsData[matchingDoc.id] || { status: 'Pending', files: [] };
                    
                    currentDoc.files.push(newFile);
                    currentDoc.status = 'Uploaded';
                    newDocumentsData[matchingDoc.id] = currentDoc;
                    
                    updateStepData('documents', newDocumentsData);
                    filesUploadedCount++;
                } catch (error: any) {
                    console.error("Upload error:", error);
                    toast({ variant: 'destructive', title: 'Upload Failed', description: `Could not upload ${file.name}.` });
                }
            } else {
                toast({ variant: 'destructive', title: 'File Not Recognized', description: `Could not categorize '${file.name}'. Please use individual upload buttons.` });
            }
        }
        
        if (filesUploadedCount > 0) {
           toast({ title: 'Uploads Complete', description: `${filesUploadedCount} file(s) were successfully uploaded.` });
        }
        setUploadingDocId(null); // Clear loading state
    }, [user, applicationData.documents, toast, updateStepData, uploadingDocId]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: {'application/pdf':[], 'image/jpeg':[], 'image/png':[]},
        disabled: !!uploadingDocId 
    });
    
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
                <div {...getRootProps()} className={cn("border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    !!uploadingDocId ? "cursor-not-allowed bg-muted/50" : "cursor-pointer",
                    isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                )}>
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        {uploadingDocId === 'dropzone' ? (
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

                <div className="space-y-6">
                    <div>
                        <h4 className="text-base font-semibold mb-2">Core Documents</h4>
                        <div className="rounded-md border">
                            {coreDocs.map((doc, index, arr) => {
                                const statusData = applicationData.documents?.[doc.id];
                                const statusInfo = getStatusInfo(statusData?.files);
                                const isProcessing = uploadingDocId === doc.id;
                                return (
                                    <div key={doc.id}>
                                        <div className="p-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <statusInfo.icon className={cn("h-6 w-6 flex-shrink-0 mt-1 sm:mt-0", statusInfo.color)} />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{doc.name}</p>
                                                        <p className="text-xs text-muted-foreground">{doc.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                                                    <Badge variant={statusInfo.badgeVariant} className={cn("hidden md:inline-flex w-28 justify-center", statusInfo.badgeVariant === 'default' && 'bg-green-100 text-green-800')}>{statusInfo.label}</Badge>
                                                    <Button variant="secondary" size="sm" asChild disabled={isProcessing || !!uploadingDocId}>
                                                        <label className="cursor-pointer">
                                                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                                                            Upload
                                                            <input type="file" className="sr-only" disabled={isProcessing || !!uploadingDocId} onChange={(e) => handleFileUpload(e.target.files ? e.target.files[0] : null, doc.id)} />
                                                        </label>
                                                    </Button>
                                                </div>
                                            </div>
                                            {statusData?.files?.length > 0 && (
                                                <div className="mt-4 pl-10 space-y-2">
                                                    {statusData.files.map((file: UploadedFile) => (
                                                        <div key={file.url} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md">
                                                            <div className="flex items-center gap-2 truncate">
                                                                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs truncate hover:underline" title={file.fileName}>{file.fileName}</a>
                                                            </div>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDelete(file, doc.id)} disabled={isProcessing || !!uploadingDocId}>
                                                                <Trash2 className="h-3 w-3 text-destructive" />
                                                                <span className="sr-only">Delete file</span>
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {index < arr.length - 1 && <Separator />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    {situationalDocs.length > 0 && (
                         <div>
                            <h4 className="text-base font-semibold mb-2">Situational & Recommended Documents</h4>
                            <div className="rounded-md border">
                                {situationalDocs.map((doc, index, arr) => {
                                    const statusData = applicationData.documents?.[doc.id];
                                    const statusInfo = getStatusInfo(statusData?.files);
                                    const isProcessing = uploadingDocId === doc.id;
                                    return (
                                        <div key={doc.id}>
                                            <div className="p-4">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div className="flex items-start gap-4 flex-1">
                                                        <statusInfo.icon className={cn("h-6 w-6 flex-shrink-0 mt-1 sm:mt-0", statusInfo.color)} />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm">{doc.name}</p>
                                                            <p className="text-xs text-muted-foreground">{doc.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                                                        <Badge variant={statusInfo.badgeVariant} className={cn("hidden md:inline-flex w-28 justify-center", statusInfo.badgeVariant === 'default' && 'bg-green-100 text-green-800')}>{statusInfo.label}</Badge>
                                                        <Button variant="secondary" size="sm" asChild disabled={isProcessing || !!uploadingDocId}>
                                                            <label className="cursor-pointer">
                                                                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                                                                Upload
                                                                <input type="file" className="sr-only" disabled={isProcessing || !!uploadingDocId} onChange={(e) => handleFileUpload(e.target.files ? e.target.files[0] : null, doc.id)} />
                                                            </label>
                                                        </Button>
                                                    </div>
                                                </div>
                                                {statusData?.files?.length > 0 && (
                                                    <div className="mt-4 pl-10 space-y-2">
                                                        {statusData.files.map((file: UploadedFile) => (
                                                            <div key={file.url} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md">
                                                                <div className="flex items-center gap-2 truncate">
                                                                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs truncate hover:underline" title={file.fileName}>{file.fileName}</a>
                                                                </div>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDelete(file, doc.id)} disabled={isProcessing || !!uploadingDocId}>
                                                                    <Trash2 className="h-3 w-3 text-destructive" />
                                                                    <span className="sr-only">Delete file</span>
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {index < arr.length - 1 && <Separator />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </>
    );
}
