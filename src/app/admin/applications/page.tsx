
'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collectionGroup, getDocs, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

type Application = {
    id: string;
    userId: string;
    studentName: string;
    status: string;
    submittedAt: string;
    country: string;
}

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case 'submitted': return 'default';
        case 'Pending Review': return 'secondary';
        case 'Approved': return 'default';
        case 'Action Required': return 'destructive';
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
        async function getApplications() {
            setLoading(true);
            const applicationsCollection = collectionGroup(db, 'application');
            const q = query(applicationsCollection, orderBy('submittedAt', 'desc'));
            const appSnapshot = await getDocs(q);
            
            const applicationsList = appSnapshot.docs.map(doc => {
                const data = doc.data();
                const userId = doc.ref.parent.parent!.id;
                return {
                    id: doc.id,
                    userId: userId,
                    studentName: data.personalInfo?.givenNames ? `${data.personalInfo.givenNames} ${data.personalInfo.surname}` : (data.studentName || 'N/A'),
                    status: data.status || 'draft',
                    submittedAt: data.submittedAt?.toDate() ? format(data.submittedAt.toDate(), 'yyyy-MM-dd') : 'N/A',
                    country: data.personalInfo?.countryOfCitizenship || 'N/A',
                };
            });
            setApplications(applicationsList);
            setLoading(false);
        }
        getApplications();
    }, []);

    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = app.studentName.toLowerCase().includes(searchLower) || app.id.toLowerCase().includes(searchLower) || app.userId.toLowerCase().includes(searchLower);
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
                <CardTitle>All Applications (Submitted & Drafts)</CardTitle>
                <CardDescription>View, manage, and track all applications. Click a row to view details.</CardDescription>
                <div className="mt-4 flex space-x-2">
                    <Input 
                        placeholder="Search by name, app ID, or user ID..." 
                        className="max-w-xs"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="Pending Review">Pending Review</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Action Required">Action Required</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>App ID</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>User ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            filteredApplications.map(app => (
                                <TableRow key={`${app.userId}-${app.id}`} onClick={() => router.push(`/admin/applications/${app.id}?userId=${app.userId}`)} className="cursor-pointer">
                                    <TableCell className="font-mono">{app.id.substring(0, 7).toUpperCase()}</TableCell>
                                    <TableCell>{app.studentName}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(app.status) as any}>{app.status}</Badge>
                                    </TableCell>
                                    <TableCell>{app.submittedAt}</TableCell>
                                    <TableCell className="font-mono text-xs">{app.userId}</TableCell>
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
