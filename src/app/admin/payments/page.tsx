
'use client';

import { useEffect, useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { getPayments, type Payment } from './actions';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, DollarSign, Receipt, Users, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const StatCard = ({ title, value, icon: Icon, description }: { title: string, value: string, icon: React.ElementType, description: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      setError(null);
      try {
        const paymentData = await getPayments();
        setPayments(paymentData);
      } catch (err) {
        setError('Failed to load payment data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = payments.reduce((acc, p) => acc + parseFloat(p.amount.replace(/[^0-9.-]+/g,"")), 0);
    const uniqueCustomers = new Set(payments.map(p => p.customerEmail)).size;
    return {
        totalRevenue: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue),
        totalTransactions: payments.length.toString(),
        uniqueCustomers: uniqueCustomers.toString(),
    };
  }, [payments]);

  return (
    <AdminLayout>
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Payments</h1>
            <p className="text-muted-foreground">Track all transactions and revenue.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Total Revenue" value={loading ? '...' : stats.totalRevenue} icon={DollarSign} description="All-time gross revenue" />
            <StatCard title="Transactions" value={loading ? '...' : stats.totalTransactions} icon={Receipt} description="All-time successful payments" />
            <StatCard title="Unique Customers" value={loading ? '...' : stats.uniqueCustomers} icon={Users} description="Total number of paying users" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>A list of all successful payments made by users.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell>
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-16 float-right" /></TableCell>
                    </TableRow>
                  ))
                ) : payments.length > 0 ? (
                  payments.map(payment => (
                    <TableRow key={payment.id} className="hover:bg-muted/50">
                      <TableCell className="text-muted-foreground">{payment.date}</TableCell>
                      <TableCell>
                        <Link href={`/admin/users/${payment.userId}`} className="font-medium hover:underline">
                          {payment.customerName}
                        </Link>
                        <div className="text-xs text-muted-foreground">{payment.customerEmail}</div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{payment.planName}</Badge></TableCell>
                      <TableCell className="font-mono text-right">{payment.amount}</TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-48 text-center">
                           <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                           <h3 className="mt-4 text-lg font-medium">No payments yet</h3>
                           <p className="mt-1 text-sm text-muted-foreground">Successful transactions will appear here.</p>
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
}
