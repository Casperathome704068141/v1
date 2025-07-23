
'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

type Application = {
    id: string;
    userId: string;
    studentName: string;
    status: string;
    submittedAt: string; // ISO date string or 'N/A'
    country: string;
    updatedAt: Date; // For sorting drafts without submission date
}

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case 'submitted': return 'default';
        case 'Pending Review': return 'secondary';
        case 'Awaiting LOA': return 'secondary';
        case 'Application Submitted to IRCC': return 'default';
        case 'Approved': return 'success';
        case 'Passport Request': return 'success';
        case 'Action Required': return 'destructive';
        case 'Rejected': return 'destructive';
        case 'draft': return 'outline';
        default: return 'outline';
    }
}

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        // Query the top-level 'applications' collection for all submitted applications
        const applicationsCollection = collection(db, 'applications');
        const q = query(applicationsCollection, orderBy('submittedAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const applicationsList: Application[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    userId: data.userId,
                    studentName: data.studentName || 'N/A',
                    status: data.status || 'Pending Review',
                    submittedAt: data.submittedAt?.toDate() ? format(data.submittedAt.toDate(), 'PPP') : 'N/A',
                    country: data.personalInfo?.countryOfCitizenship || 'N/A',
                    updatedAt: data.updatedAt?.toDate() || new Date(0),
                };
            });
            setApplications(applicationsList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching applications:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const searchLower = searchTerm.toLowerCase();
            const name = app.studentName || '';
            const matchesSearch = name.toLowerCase().includes(searchLower) || app.id.toLowerCase().includes(searchLower) || app.userId.toLowerCase().includes(searchLower);
            const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [applications, searchTerm, statusFilter]);

  return (
    <AdminLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Manage Applications</h1>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Submitted Applications</CardTitle>
                <CardDescription>View, manage, and track all submitted applications. Click a row to view details.</CardDescription>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Input 
                        placeholder="Search by name, app ID, or user ID..." 
                        className="max-w-xs"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[220px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Pending Review">Pending Review</SelectItem>
                            <SelectItem value="Awaiting LOA">Awaiting LOA</SelectItem>
                            <SelectItem value="Application Submitted to IRCC">Submitted to IRCC</SelectItem>
                            <SelectItem value="Passport Request">Passport Request</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Action Required">Action Required</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted At</TableHead>
                                <TableHead>App ID</TableHead>
                                <TableHead>User ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                filteredApplications.map(app => (
                                    <TableRow key={app.id} onClick={() => router.push(`/admin/applications/${app.id}`)} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell className="font-medium">{app.studentName}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {app.submittedAt}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{app.id.substring(0, 10)}...</TableCell>
                                        <TableCell className="font-mono text-xs">{app.userId}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
}
