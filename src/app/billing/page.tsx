
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

function getPlanFeatures(plan: string) {
    const allFeatures = {
        starter: [
            'Auto-filled IMM Forms',
            'Dynamic Document Checklist',
            'AI SOP Template Generator',
            '1 x 30-min RCIC Video Call'
        ],
        advantage: [
            'Everything in Starter',
            'Full SOP/LOE Ghost-Writing',
            'Proof-of-Funds Verification',
            '2 x 45-min RCIC Sessions',
            'Final Pre-Submission QA Check'
        ],
        elite: [
            'All Advantage features',
            'Up to 3 College LOA Sourcing',
            'Full IRCC Portal Submission',
            'Priority WhatsApp Support',
        ],
        free: [
            'Eligibility Quiz',
            'College Match Tool',
            'Application Form Access'
        ]
    };

    switch(plan.toLowerCase()) {
        case 'starter': return allFeatures.starter;
        case 'advantage': return allFeatures.advantage;
        case 'elite': return allFeatures.elite;
        default: return allFeatures.free;
    }
}

type PaymentRecord = {
    id: string;
    amount: number;
    paidAt: {
        toDate: () => Date;
    };
    planDetails: any[];
}


export default function BillingPage() {
    const { user, profile, loading } = useAuth();
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(true);

    useEffect(() => {
        if (!user?.uid) {
            setLoadingPayments(false);
            return;
        }

        const paymentsRef = collection(db, 'users', user.uid, 'payments');
        const q = query(paymentsRef, orderBy('paidAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const paymentsData: PaymentRecord[] = [];
            querySnapshot.forEach((doc) => {
                paymentsData.push({ id: doc.id, ...doc.data() } as PaymentRecord);
            });
            setPayments(paymentsData);
            setLoadingPayments(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) {
        return (
            <AppLayout>
                <main className="flex-1 space-y-6 p-4 md:p-8">
                     <Skeleton className="h-8 w-48 mb-4" />
                     <Card>
                        <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                        <CardContent className="space-y-4">
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                        <CardFooter><Skeleton className="h-10 w-32" /></CardFooter>
                     </Card>
                </main>
            </AppLayout>
        )
    }

    const currentPlan = profile?.plan || 'Free';
    const features = getPlanFeatures(currentPlan);

    return (
        <AppLayout>
            <main className="flex-1 space-y-6 p-4 md:p-8">
                 <div>
                    <h1 className="font-headline text-3xl font-bold">Billing & Plan</h1>
                    <p className="text-muted-foreground">Manage your subscription and billing details.</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Your Current Plan</CardTitle>
                                    <div className="flex items-center gap-2 pt-2">
                                        <Badge variant={currentPlan.toLowerCase() === 'free' ? 'secondary' : 'default'} className="text-base">{currentPlan}</Badge>
                                    </div>
                                </div>
                                <Button asChild>
                                    <Link href="/pricing">
                                        <Zap className="mr-2 h-4 w-4" />
                                        {currentPlan.toLowerCase() === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <p className="font-semibold mb-4">Your plan includes:</p>
                                <ul className="space-y-3">
                                    {features.map(feature => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="border-t pt-4 mt-6">
                                <CardDescription>
                                    To manage payment methods or view invoices, please visit your Stripe customer portal.
                                </CardDescription>
                            </CardFooter>
                        </Card>
                    </div>

                     <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Wallet className="h-5 w-5 text-primary"/>
                                    Payment History
                                </CardTitle>
                                <CardDescription>Your recent transactions.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loadingPayments ? (
                                    <Skeleton className="h-20 w-full" />
                                ) : payments.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {payments.map(payment => (
                                                <TableRow key={payment.id}>
                                                    <TableCell>{format(payment.paidAt.toDate(), 'PPP')}</TableCell>
                                                    <TableCell className="text-right font-mono">${(payment.amount / 100).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No payments found.</p>
                                )}
                            </CardContent>
                        </Card>
                     </div>

                </div>
            </main>
        </AppLayout>
    )
}
