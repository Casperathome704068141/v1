
'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

type User = {
    id: string;
    name: string;
    email: string;
    signedUp: string;
    plan: string;
};

function getPlanBadgeVariant(plan: string) {
    switch (plan.toLowerCase()) {
        case 'elite': return 'default';
        case 'advantage': return 'secondary';
        default: return 'outline';
    }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUsers() {
        setLoading(true);
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, orderBy('signedUp', 'desc'));
        const userSnapshot = await getDocs(q);
        
        const usersList = userSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                email: data.email,
                signedUp: data.signedUp?.toDate() ? format(data.signedUp.toDate(), 'yyyy-MM-dd') : 'N/A',
                plan: data.plan || 'Free',
            };
        });
        setUsers(usersList);
        setLoading(false);
    }
    getUsers();
  }, []);

  return (
    <AdminLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">User Management</h1>
          <Button>Add New User</Button>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>View and manage all user accounts.</CardDescription>
                <div className="mt-4">
                    <Input placeholder="Search by name or email..." className="max-w-xs" />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Sign-up Date</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} data-ai-hint="user avatar" alt={user.name} />
                                            <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getPlanBadgeVariant(user.plan)}>{user.plan}</Badge>
                                </TableCell>
                                <TableCell>{user.signedUp}</TableCell>
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
