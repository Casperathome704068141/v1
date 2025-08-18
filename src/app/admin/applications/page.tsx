
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
import { Search, FileSearch } from 'lucide-react';

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

const NoResults = () => (
    <div className="text-center py-16">
        <FileSearch className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No applications found</h3>
        <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filter to find what you're looking for.</p>
    </div>
);


export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
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
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Manage Applications</h2>
                    <p className="text-muted-foreground">Here you can view, manage, and track all submitted student applications.</p>
                </div>
            </div>

            <Card>
                <CardHeader className="border-b">
                    <CardTitle>Applications</CardTitle>
                    <CardDescription>Browse and manage all applications.</CardDescription>
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name or ID..." 
                                className="pl-8 sm:w-full"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[240px]">
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
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Submitted At</TableHead>
                                    <TableHead className="text-right">Application ID</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-5 w-24 float-right" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredApplications.length > 0 ? (
                                    filteredApplications.map(app => (
                                        <TableRow key={app.id} onClick={() => router.push(`/admin/applications/${app.id}?userId=${app.userId}`)} className="cursor-pointer hover:bg-muted/50">
                                            <TableCell className="font-medium">{app.studentName}</TableCell>
                                            <TableCell className="text-muted-foreground">{app.country}</TableCell>
                                            <TableCell><Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge></TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{app.submittedAt}</TableCell>
                                            <TableCell className="font-mono text-xs text-right">{app.id.substring(0, 8).toUpperCase()}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <NoResults />
                                        </TableCell>
                                    </TableRow>
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
