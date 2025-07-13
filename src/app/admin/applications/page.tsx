
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';

const mockApplications = [
    { id: 'APP-001', student: 'John Doe', status: 'Pending Review', submitted: '2023-10-26', country: 'India' },
    { id: 'APP-002', student: 'Jane Smith', status: 'Approved', submitted: '2023-10-25', country: 'Nigeria' },
    { id: 'APP-003', student: 'Sam Wilson', status: 'Action Required', submitted: '2023-10-24', country: 'Brazil' },
    { id: 'APP-004', student: 'Li Wei', status: 'Pending Review', submitted: '2023-10-26', country: 'China' },
];

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case 'Approved': return 'default';
        case 'Pending Review': return 'secondary';
        case 'Action Required': return 'destructive';
        default: return 'outline';
    }
}

export default function AdminApplicationsPage() {
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
                <CardDescription>View, manage, and track all submitted applications.</CardDescription>
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
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockApplications.map(app => (
                            <TableRow key={app.id}>
                                <TableCell className="font-mono">{app.id}</TableCell>
                                <TableCell>{app.student}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                                </TableCell>
                                <TableCell>{app.submitted}</TableCell>
                                <TableCell>{app.country}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
}
