
'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { format, formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, AlertTriangle, User, FileText } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { UserProfile } from '@/context/auth-context';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

type Application = {
    id: string; // The doc ID from the subcollection, e.g. "draft"
    status: string;
    submittedAt: string;
    submittedAtTimestamp: Timestamp | null;
    submittedAppId?: string; // The ID of the submitted app in the top-level collection
};

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case 'Approved': return 'success';
        case 'submitted': return 'default';
        case 'Pending Review': return 'secondary';
        case 'Action Required': return 'destructive';
        case 'Rejected': return 'destructive';
        case 'draft': return 'outline';
        default: return 'outline';
    }
}

export default function UserDetailPage() {
    const params = useParams() as { id: string };
    const { id } = params;
    const [user, setUser] = useState<UserProfile | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        
        async function getUserData() {
            setLoading(true);
            setError(null);
            try {
                const userDocRef = doc(db, 'users', id);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    setUser(userDocSnap.data() as UserProfile);
                } else {
                    setError("No user found with this ID.");
                    setLoading(false);
                    return;
                }

                // Fetch the application draft from the user's subcollection
                const appsCollectionRef = collection(db, 'users', id, 'application');
                const appsSnapshot = await getDocs(appsCollectionRef);

                const appsList = appsSnapshot.docs.map(docSnap => {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        status: data.status || 'draft',
                        submittedAtTimestamp: data.submittedAt || null,
                        submittedAt: data.submittedAt?.toDate() ? formatDistanceToNow(data.submittedAt.toDate(), { addSuffix: true }) : 'Draft',
                        submittedAppId: data.submittedAppId,
                    };
                });
                
                appsList.sort((a, b) => {
                    if (!a.submittedAtTimestamp) return 1;
                    if (!b.submittedAtTimestamp) return -1;
                    return b.submittedAtTimestamp.toMillis() - a.submittedAtTimestamp.toMillis();
                });

                setApplications(appsList);

            } catch (err: any) {
                console.error("Firebase error getting document:", err);
                setError("An error occurred while fetching the user's data.");
            } finally {
                setLoading(false);
            }
        }
        getUserData();
    }, [id]);
    
    const handlePlanUpdate = async (newPlan: string) => {
        if (!user) return;
        setIsUpdating(true);
        const docRef = doc(db, 'users', user.uid);
        try {
            await updateDoc(docRef, { plan: newPlan });
            toast({
                title: 'Plan Updated',
                description: `${user.name}'s plan changed to ${newPlan}.`,
            });
            setUser(prev => prev ? { ...prev, plan: newPlan } : null);
        } catch (error) {
            console.error("Error updating plan: ", error);
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: 'Could not update the user plan.',
            });
        } finally {
            setIsUpdating(false);
        }
    };
    
    if (loading) {
        return (
             <AdminLayout>
                <main className="flex-1 space-y-6 p-4 md:p-8">
                     <Skeleton className="h-8 w-48 mb-4" />
                     <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-1 space-y-8">
                            <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-4 w-full" /></CardContent></Card>
                        </div>
                        <div className="lg:col-span-2">
                             <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
                        </div>
                     </div>
                </main>
            </AdminLayout>
        )
    }

     if (error) {
        return (
            <AdminLayout>
                <main className="p-4 md:p-8">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Users
                    </Button>
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </main>
            </AdminLayout>
        );
    }
    
    if (!user) {
        return <AdminLayout><main className="p-8">User not found.</main></AdminLayout>;
    }


    return (
        <AdminLayout>
            <main className="flex-1 space-y-6 p-4 md:p-8">
                <div>
                     <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Users
                    </Button>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} data-ai-hint="user avatar" />
                            <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                             <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
                             <p className="text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                     <div className="lg:col-span-1 space-y-8">
                        <Card>
                             <CardHeader>
                                <CardTitle>User Profile</CardTitle>
                                <CardDescription>Manage user plan and details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <div className="space-y-2">
                                     <Label className="text-sm font-medium">Subscription Plan</Label>
                                     <Select defaultValue={user.plan} onValueChange={handlePlanUpdate} disabled={isUpdating}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Set new plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Free">Free</SelectItem>
                                            <SelectItem value="Starter">Starter</SelectItem>
                                            <SelectItem value="Advantage">Advantage</SelectItem>
                                            <SelectItem value="Elite">Elite</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground pt-2">Changing the plan will grant or revoke access to paid features.</p>
                                </div>
                                <Separator/>
                                 <dl>
                                    <dt className="text-sm text-muted-foreground">Signed Up</dt>
                                    <dd className="font-medium">{user.signedUp?.toDate() ? format(user.signedUp.toDate(), 'PPP') : 'N/A'}</dd>
                                </dl>
                            </CardContent>
                        </Card>
                     </div>
                     <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    User Applications
                                </CardTitle>
                                <CardDescription>All applications (drafts and submitted) by this user.</CardDescription>
                            </CardHeader>
                             <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Last Updated</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {applications.length > 0 ? applications.map(app => {
                                            const isDraft = app.status === 'draft';
                                            const appId = isDraft ? app.id : app.submittedAppId;
                                            const url = `/admin/applications/${appId}?userId=${id}${isDraft ? '&isDraft=true' : ''}`;

                                            return (
                                            <TableRow key={app.id}>
                                                <TableCell className="font-mono">{isDraft ? 'DRAFT' : 'SUBMITTED'}</TableCell>
                                                <TableCell>{app.submittedAt}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                  <Link href={url}>
                                                    <Button variant="outline" size="sm">View Details</Button>
                                                  </Link>
                                                </TableCell>
                                            </TableRow>
                                        )}) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground">No applications found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                     </div>
                </div>
            </main>
        </AdminLayout>
    )
}
