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
import { ArrowRight, UserPlus, Hourglass, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

type Application = {
    id: string;
    studentName: string;
    status: string;
    submittedAt: string;
};

type Stats = {
    totalApplications: number;
    pendingReview: number;
    approvedVisas: number;
    newUsers: number;
};

const StatCard = ({ title, value, icon: Icon, description, loading }: { title: string, value: number, icon: React.ElementType, description: string, loading: boolean }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{value}</div>}
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const Greeting = () => {
    const { user } = useAuth();
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Welcome back, {user?.displayName?.split(' ')[0] || 'Admin'}!</h1>
                <p className="text-muted-foreground">Here's a snapshot of what's happening today.</p>
            </div>
        </div>
    );
};

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case 'Approved': return 'success';
        case 'Pending Review': return 'secondary';
        case 'Action Required': return 'destructive';
        default: return 'outline';
    }
}

export default function AdminDashboardPage() {
    const [recentApplications, setRecentApplications] = useState<Application[]>([]);
    const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
    const [stats, setStats] = useState<Stats>({ totalApplications: 0, pendingReview: 0, approvedVisas: 0, newUsers: 0 });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function getDashboardData() {
            setLoading(true);
            try {
                const applicationsCollection = collection(db, 'applications');
                const usersCollection = collection(db, 'users');

                const recentApplicationsQuery = query(applicationsCollection, orderBy('submittedAt', 'desc'), limit(5));
                const pendingApplicationsQuery = query(applicationsCollection, where('status', '==', 'Pending Review'), orderBy('submittedAt', 'asc'), limit(5));

                const [
                    appSnapshot,
                    pendingSnapshot,
                    totalAppsSnapshot,
                    pendingAppsCountSnapshot,
                    approvedAppsSnapshot,
                    totalUsersSnapshot
                ] = await Promise.all([
                    getDocs(recentApplicationsQuery),
                    getDocs(pendingApplicationsQuery),
                    getCountFromServer(collection(db, 'applications')),
                    getCountFromServer(query(collection(db, 'applications'), where('status', '==', 'Pending Review'))),
                    getCountFromServer(query(collection(db, 'applications'), where('status', '==', 'Approved'))),
                    getCountFromServer(collection(db, 'users'))
                ]);

                const fetchedRecentApplications = appSnapshot.docs.map(doc => ({
                    id: doc.id,
                    studentName: doc.data().studentName,
                    status: doc.data().status,
                    submittedAt: doc.data().submittedAt?.toDate() ? format(doc.data().submittedAt.toDate(), 'PPP') : 'N/A',
                }));

                const fetchedPendingApplications = pendingSnapshot.docs.map(doc => ({
                    id: doc.id,
                    studentName: doc.data().studentName,
                    status: doc.data().status,
                    submittedAt: doc.data().submittedAt?.toDate() ? format(doc.data().submittedAt.toDate(), 'PPP') : 'N/A',
                }));

                setRecentApplications(fetchedRecentApplications);
                setPendingApplications(fetchedPendingApplications);
                setStats({
                    totalApplications: totalAppsSnapshot.data().count,
                    pendingReview: pendingAppsCountSnapshot.data().count,
                    approvedVisas: approvedAppsSnapshot.data().count,
                    newUsers: totalUsersSnapshot.data().count,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        getDashboardData();
    }, []);

    const statCards = [
        { title: 'Total Applications', value: stats.totalApplications, icon: FileText, description: 'All-time application count' },
        { title: 'Pending Review', value: stats.pendingReview, icon: Hourglass, description: 'Applications awaiting action' },
        { title: 'Approved Applications', value: stats.approvedVisas, icon: CheckCircle, description: 'Successfully approved applications' },
        { title: 'Total Users', value: stats.newUsers, icon: UserPlus, description: 'Total registered users' },
    ];

    return (
        <AdminLayout>
            <div className="flex-1 space-y-8 p-4 md:p-8">
                <Greeting />
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map(card => <StatCard key={card.title} {...card} loading={loading} />)}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Applications</CardTitle>
                                <CardDescription>The last 5 applications submitted.</CardDescription>
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
                                        <TableHead>Student</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Submitted</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-4 w-[100px] float-right" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : recentApplications.length > 0 ? (
                                        recentApplications.map(app => (
                                            <TableRow key={app.id} onClick={() => router.push(`/admin/applications/${app.id}`)} className="cursor-pointer hover:bg-muted/50">
                                                <TableCell className="font-medium">{app.studentName}</TableCell>
                                                <TableCell><Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge></TableCell>
                                                <TableCell className="text-right">{app.submittedAt}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">No recent applications.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                <span>Pending Queue</span>
                            </CardTitle>
                            <CardDescription>The oldest applications needing your attention.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="flex items-center">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="ml-4 space-y-1">
                                                <Skeleton className="h-4 w-[150px]" />
                                                <Skeleton className="h-3 w-[100px]" />
                                            </div>
                                        </div>
                                    ))
                                ) : pendingApplications.length > 0 ? (
                                    pendingApplications.map(app => (
                                        <div key={app.id} className="flex items-center space-x-4 cursor-pointer" onClick={() => router.push(`/admin/applications/${app.id}`)}>
                                            <Hourglass className="h-6 w-6 text-muted-foreground" />
                                            <div className="flex-1">
                                                <p className="font-medium">{app.studentName}</p>
                                                <p className="text-sm text-muted-foreground">{app.submittedAt}</p>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-muted-foreground py-4">No applications pending review.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
