
'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

type Application = {
    id: string;
    studentName: string;
    status: string;
    submittedAt: string;
    country: string;
}

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case 'Approved': return 'default';
        case 'Pending Review': return 'secondary';
        case 'Action Required': return 'destructive';
        default: return 'outline';
    }
}

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function getApplications() {
            setLoading(true);
            const applicationsCollection = collection(db, 'applications');
            const q = query(applicationsCollection, orderBy('submittedAt', 'desc'));
            const appSnapshot = await getDocs(q);
            
            const applicationsList = appSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    studentName: data.studentName,
                    status: data.status,
                    submittedAt: data.submittedAt?.toDate() ? format(data.submittedAt.toDate(), 'yyyy-MM-dd') : 'N/A',
                    country: data.personalInfo?.countryOfCitizenship || 'N/A',
                };
            });
            setApplications(applicationsList);
            setLoading(false);
        }
        getApplications();
    }, []);

  return (
    <AdminLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Manage Applications</h1>
          <Button>Export Data</Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Student Applications</CardTitle>
                <CardDescription>View, manage, and track all submitted applications. Click a row to view details.</CardDescription>
                <div className="mt-4 flex space-x-2">
                    <Input placeholder="Search by name or ID..." className="max-w-xs" />
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="required">Action Required</SelectItem>
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
                            <TableHead>Submitted On</TableHead>
                            <TableHead>Country</TableHead>
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
                            applications.map(app => (
                                <TableRow key={app.id} onClick={() => router.push(`/admin/applications/${app.id}`)} className="cursor-pointer">
                                    <TableCell className="font-mono">{app.id.substring(0, 7).toUpperCase()}</TableCell>
                                    <TableCell>{app.studentName}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(app.status) as any}>{app.status}</Badge>
                                    </TableCell>
                                    <TableCell>{app.submittedAt}</TableCell>
                                    <TableCell>{app.country}</TableCell>
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
