
'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, orderBy, query, where, getCountFromServer } from 'firebase/firestore';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowRight, UserPlus, Hourglass, CheckCircle, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type Application = {
    id: string;
    studentName: string;
    status: string;
    submittedAt: string;
}

type Stats = {
    totalApplications: number;
    pendingReview: number;
    approvedVisas: number;
    newUsers: number;
};

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case 'Approved': return 'default';
        case 'Pending Review': return 'secondary';
        case 'Action Required': return 'destructive';
        default: return 'outline';
    }
}

export default function AdminDashboardPage() {
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats>({ totalApplications: 0, pendingReview: 0, approvedVisas: 0, newUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDashboardData() {
        try {
            const applicationsCollection = collection(db, 'applications');
            const usersCollection = collection(db, 'users');

            const recentApplicationsQuery = query(applicationsCollection, orderBy('submittedAt', 'desc'), limit(5));
            
            const totalAppsQuery = query(applicationsCollection);
            const pendingAppsQuery = query(applicationsCollection, where('status', '==', 'Pending Review'));
            const approvedAppsQuery = query(applicationsCollection, where('status', '==', 'Approved'));
            const totalUsersQuery = query(usersCollection);

            const [
                appSnapshot,
                totalAppsSnapshot,
                pendingAppsSnapshot,
                approvedAppsSnapshot,
                totalUsersSnapshot
            ] = await Promise.all([
                getDocs(recentApplicationsQuery),
                getCountFromServer(totalAppsQuery),
                getCountFromServer(pendingAppsQuery),
                getCountFromServer(approvedAppsQuery),
                getCountFromServer(totalUsersQuery)
            ]);
            
            const fetchedRecentApplications = appSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    studentName: data.studentName,
                    status: data.status,
                    submittedAt: data.submittedAt?.toDate() ? format(data.submittedAt.toDate(), 'PPP') : 'N/A',
                };
            });

            const fetchedStats = {
                totalApplications: totalAppsSnapshot.data().count,
                pendingReview: pendingAppsSnapshot.data().count,
                approvedVisas: approvedAppsSnapshot.data().count,
                newUsers: totalUsersSnapshot.data().count,
            };

            setRecentApplications(fetchedRecentApplications);
            setStats(fetchedStats);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            // Optionally, set an error state here to show a message to the user
        } finally {
            setLoading(false);
        }
    }

    getDashboardData();
  }, []);

  return (
    <AdminLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.totalApplications}</div>}
                    <p className="text-xs text-muted-foreground">All-time application count</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                     <Hourglass className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.pendingReview}</div>}
                    <p className="text-xs text-muted-foreground">Applications awaiting action</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved Applications</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.approvedVisas}</div>}
                    <p className="text-xs text-muted-foreground">Successfully approved applications</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                     <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.newUsers}</div>}
                    <p className="text-xs text-muted-foreground">Total registered users</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader className="flex items-center justify-between">
                <div>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>The last 5 applications submitted by students.</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link href="/admin/applications">
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Submitted On</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[100px] float-right" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            recentApplications.map(app => (
                                 <TableRow key={app.id}>
                                    <TableCell>
                                        <div className="font-medium">{app.studentName}</div>
                                        <div className="text-xs text-muted-foreground md:hidden">{app.id.substring(0, 7).toUpperCase()}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{app.submittedAt}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
}
