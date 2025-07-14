
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, AlertTriangle, User, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { UserProfile } from '@/context/auth-context';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

type Application = {
    id: string;
    status: string;
    submittedAt: string;
    submittedAtTimestamp: Timestamp | null;
};

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case 'Approved': return 'default';
        case 'Pending Review': return 'secondary';
        case 'Action Required': return 'destructive';
        default: return 'outline';
    }
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const id = params.id;
        if (!id) return;
        
        async function getUserData() {
            setLoading(true);
            setError(null);
            try {
                // Fetch user document
                const userDocRef = doc(db, 'users', id);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    setUser(userDocSnap.data() as UserProfile);
                } else {
                    setError("No user found with this ID.");
                    setLoading(false);
                    return;
                }

                // Fetch user's applications
                const appsQuery = query(
                    collection(db, 'applications'),
                    where('userId', '==', id)
                );
                const appsSnapshot = await getDocs(appsQuery);
                const appsList = appsSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        status: data.status,
                        submittedAtTimestamp: data.submittedAt || null,
                        submittedAt: data.submittedAt?.toDate() ? format(data.submittedAt.toDate(), 'yyyy-MM-dd') : 'N/A',
                    };
                });

                // Sort applications client-side to avoid needing a composite index
                appsList.sort((a, b) => {
                    if (!a.submittedAtTimestamp) return 1;
                    if (!b.submittedAtTimestamp) return -1;
                    return b.submittedAtTimestamp.toMillis() - a.submittedAtTimestamp.toMillis();
                });

                setApplications(appsList);

            } catch (err: any) {
                console.error("Firebase error getting document:", err);
                if (err.code === 'failed-precondition') {
                     setError("This query requires a Firestore index. Please check the browser console for a link to create it, or contact support.");
                } else {
                    setError("An error occurred while fetching the user's data.");
                }
            } finally {
                setLoading(false);
            }
        }
        getUserData();
    }, [params]);
    
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
                     <Button variant="ghost" onClick={() => router.back()} className="mb-4">
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
                     <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Submitted Applications
                                </CardTitle>
                                <CardDescription>All applications submitted by this user.</CardDescription>
                            </CardHeader>
                             <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>App ID</TableHead>
                                            <TableHead>Submitted On</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {applications.length > 0 ? applications.map(app => (
                                            <TableRow key={app.id} onClick={() => router.push(`/admin/applications/${app.id}`)} className="cursor-pointer">
                                                <TableCell className="font-mono">{app.id.substring(0, 7).toUpperCase()}</TableCell>
                                                <TableCell>{app.submittedAt}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-muted-foreground">No applications found.</TableCell>
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

    