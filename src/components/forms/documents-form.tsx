'use client';

import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, UploadCloud, Trash2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
        return { icon: CheckCircle2, color: 'text-green-500', badgeVariant: 'secondary' as const, label: 'Uploaded' };
    }
    return { icon: FileText, color: 'text-muted-foreground', badgeVariant: 'outline' as const, label: 'Pending' };
}

export function DocumentsForm() {
    const { applicationData, updateStepData } = useApplication();
    
    // We use a local state to manage loading status for specific files/docs
    const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

    const updateAndPersist = (newDocData: any) => {
        updateStepData('documents', newDocData);
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
                <FileUploadDropzone 
                    onUploadStart={(docId) => setUploadingDocId(docId)} 
                    onUploadComplete={(newDocData) => {
                        updateAndPersist(newDocData);
                        setUploadingDocId(null);
                    }}
                />

                <div className="space-y-6">
                    <div>
                        <h4 className="text-base font-semibold mb-2">Core Documents</h4>
                        <div className="rounded-md border">
                            {coreDocs.map((doc, index, arr) => (
                                <div key={doc.id}>
                                    <DocumentItem 
                                        docInfo={doc}
                                        statusData={applicationData.documents?.[doc.id]}
                                        isUploading={uploadingDocId === doc.id}
                                        onDataChange={updateAndPersist}
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
                                            statusData={applicationData.documents?.[doc.id]}
                                            isUploading={uploadingDocId === doc.id}
                                            onDataChange={updateAndPersist}
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

function FileUploadDropzone({ onUploadStart, onUploadComplete }: { onUploadStart: (docId: string) => void, onUploadComplete: (newDocData: any) => void }) {
    const { user } = useAuth();
    const { applicationData } = useApplication();
    const { toast } = useToast();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Not logged in', description: 'You must be logged in to upload files.' });
            return;
        }

        for (const file of acceptedFiles) {
            // Find a matching document type based on filename. This is a best-effort guess.
            const docIdGuess = file.name.split('.')[0].toLowerCase().replace(/[^a-z0-9]/gi, '');
            const matchingDoc = documentList.find(d => docIdGuess.includes(d.id.toLowerCase()));
            
            if (matchingDoc) {
                onUploadStart(matchingDoc.id);
                try {
                    const storageRef = ref(storage, `users/${user.uid}/documents/${matchingDoc.id}/${file.name}`);
                    await uploadBytes(storageRef, file);
                    const downloadURL = await getDownloadURL(storageRef);

                    const newFile: UploadedFile = {
                        fileName: file.name,
                        url: downloadURL,
                        date: new Date().toISOString()
                    };

                    const newDocData = { ...applicationData.documents };
                    const currentDoc = newDocData[matchingDoc.id] || { files: [] };
                    
                    newDocData[matchingDoc.id] = {
                        ...currentDoc,
                        status: 'Uploaded',
                        files: [...currentDoc.files, newFile]
                    };
                    onUploadComplete(newDocData);

                    toast({ title: 'File Uploaded', description: `${file.name} was successfully uploaded.`});
                } catch (error) {
                    console.error("Upload error:", error);
                    toast({ variant: 'destructive', title: 'Upload Failed', description: `Could not upload ${file.name}.`});
                    onUploadComplete(applicationData.documents); // Resets loading state
                }
            } else {
                toast({ variant: 'destructive', title: 'File Not Recognized', description: `Could not automatically categorize '${file.name}'. Please use the individual upload buttons.` });
            }
        }
    }, [user, applicationData.documents, toast, onUploadStart, onUploadComplete]);

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

function DocumentItem({ docInfo, statusData, isUploading, onDataChange }: { 
    docInfo: typeof documentList[0];
    statusData: any; 
    isUploading: boolean;
    onDataChange: (newDocData: any) => void;
}) {
    const { user } = useAuth();
    const { applicationData } = useApplication();
    const { toast } = useToast();
    const statusInfo = getStatusInfo(statusData?.files);

    const handleFileUpload = async (file: File | null) => {
        if (!file || !user) return;
        
        onDataChange({ ...applicationData.documents, [docInfo.id]: { ...(statusData || { files:[] }), isUploading: true }});

        try {
            const storageRef = ref(storage, `users/${user.uid}/documents/${docInfo.id}/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            const newFile: UploadedFile = { fileName: file.name, url: downloadURL, date: new Date().toISOString() };
            const currentDoc = applicationData.documents?.[docInfo.id] || { files: [] };
            const newDocData = { ...applicationData.documents, [docInfo.id]: { ...currentDoc, status: 'Uploaded', files: [...currentDoc.files, newFile] }};
            
            onDataChange(newDocData);
            toast({ title: 'File Uploaded', description: `${file.name} was successfully uploaded.`});
        } catch (error) {
            console.error("Upload error:", error);
            toast({ variant: 'destructive', title: 'Upload Failed', description: `Could not upload ${file.name}.`});
            onDataChange(applicationData.documents); // Reset state on failure
        }
    };
    
    const handleDelete = async (fileToDelete: UploadedFile) => {
        if (!user) return;
        
        const confirm = window.confirm(`Are you sure you want to delete ${fileToDelete.fileName}?`);
        if (!confirm) return;

        try {
            const fileRef = ref(storage, `users/${user.uid}/documents/${docInfo.id}/${fileToDelete.fileName}`);
            await deleteObject(fileRef);

            const newDocData = { ...applicationData.documents };
            const currentDoc = newDocData[docInfo.id];
            if (!currentDoc) return;

            currentDoc.files = currentDoc.files.filter((f: UploadedFile) => f.fileName !== fileToDelete.fileName || f.date !== fileToDelete.date);
            if (currentDoc.files.length === 0) {
                currentDoc.status = 'Pending';
            }
            onDataChange(newDocData);
            toast({ title: 'File Deleted', description: `${fileToDelete.fileName} has been deleted.`});
        } catch (error) {
            console.error("Delete error:", error);
            toast({ variant: 'destructive', title: 'Delete Failed', description: `Could not delete ${fileToDelete.fileName}.`});
        }
    };

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
                     <Button variant="secondary" size="sm" asChild disabled={isUploading}>
                        <label className="cursor-pointer">
                           {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                            Upload
                            <input type="file" className="sr-only" onChange={(e) => handleFileUpload(e.target.files ? e.target.files[0] : null)} />
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
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDelete(file)}>
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
