
'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, UserSearch } from 'lucide-react';

type User = {
    id: string;
    name: string;
    email: string;
    signedUp: string;
    plan: string;
};

function getPlanBadgeVariant(plan: string) {
    switch (plan?.toLowerCase()) {
        case 'elite': return 'default';
        case 'advantage': return 'secondary';
        case 'starter': return 'outline';
        default: return 'outline';
    }
}

const UsersTableSkeleton = () => (
    Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i}>
            <TableCell>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                </div>
            </TableCell>
            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-16 float-right" /></TableCell>
        </TableRow>
    ))
);

const NoResults = () => (
    <TableRow>
        <TableCell colSpan={4} className="h-48 text-center">
            <UserSearch className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No users found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search to find what you're looking for.</p>
        </TableCell>
    </TableRow>
);

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, orderBy('signedUp', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersList = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    email: data.email,
                    signedUp: data.signedUp?.toDate() ? format(data.signedUp.toDate(), 'PPP') : 'N/A',
                    plan: data.plan || 'Free',
                };
            });
            setUsers(usersList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching users:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const searchLower = searchTerm.toLowerCase();
            return user.name?.toLowerCase().includes(searchLower) || user.email?.toLowerCase().includes(searchLower);
        });
    }, [users, searchTerm]);

    return (
        <AdminLayout>
            <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight font-headline">User Management</h2>
                        <p className="text-muted-foreground">View and manage all registered user accounts.</p>
                    </div>
                </div>
                
                <Card>
                    <CardHeader className="border-b">
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>Browse and manage all registered users.</CardDescription>
                        <div className="mt-4">
                             <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by name or email..." 
                                    className="pl-8 sm:w-80"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Signed Up</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <UsersTableSkeleton />
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <TableRow key={user.id} className="hover:bg-muted/50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
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
                                            <TableCell className="text-muted-foreground">{user.signedUp}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" onClick={() => router.push(`/admin/users/${user.id}`)}>
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                   <NoResults />
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </AdminLayout>
    );
}
