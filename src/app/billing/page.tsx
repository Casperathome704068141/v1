
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Check, CheckCircle, Lock, PackageCheck, Star, Wallet, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

const tiers = [
  {
    id: 'price_starter_450',
    name: 'Starter',
    price: 450,
    description: 'For confident students who just need compliant paperwork',
    features: [
      'Auto-filled IMM1294/5645',
      'Dynamic document checklist',
      'AI SOP generator',
      '1 × 30-min RCIC video call',
      'Live-chat (48 h SLA)',
    ],
  },
  {
    id: 'price_advantage_745',
    name: 'Advantage',
    price: 745,
    description: 'Shore up weak spots & file with confidence',
    features: [
      'Everything in Starter, plus',
      'Full SOP/LOE ghost-writing (1 round of edits)',
      'Proof-of-funds verification & bank-letter template',
      '2 × 45-min RCIC sessions (or 1 × 90 min)',
      'Final pre-submission QA checklist',
      '72 h priority chat',
    ],
    popular: true,
  },
  {
    id: 'price_elite_1200',
    name: 'Elite Concierge',
    price: 1200,
    description: 'White-glove, end-to-end representation',
    features: [
      'Everything—no add-on needed',
      'Up to 3 college applications & LOA sourcing',
      '$10 000 GIC + tuition payment processing',
      'Full IRCC portal submission under RCIC rep (IMM5476)',
      'Provincial Attestation Letter (PAL) handling (ON/BC caps)',
      'Priority WhatsApp (same-day)',
    ],
  },
];

const addons = [
    { id: 'addon_ircc_submission', name: 'IRCC submission by RCIC', description: 'We upload, pay fees, monitor account', price: 250 },
    { id: 'addon_rush_processing', name: '24-hour rush processing', description: 'Forms & SOP delivered in 1 business day', price: 149 },
    { id: 'addon_hourly_consulting', name: 'Hourly consulting (beyond included)', description: 'Used for complex refusal histories', price: 125 },
];

function getPlanFeatures(plan: string) {
    const planData = tiers.find(t => t.name.toLowerCase() === plan.toLowerCase());
    return planData?.features || [ 'Eligibility Quiz', 'College Match Tool', 'Application Form Access' ];
}

type PaymentRecord = {
    id: string;
    amount: number;
    paidAt: { toDate: () => Date; };
    planDetails: any[];
}


export default function BillingPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(true);
    const [selectedTier, setSelectedTier] = useState<typeof tiers[0] | null>(null);
    const [selectedAddons, setSelectedAddons] = useState<typeof addons>([]);
    
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

    const handleSelectTier = (tier: typeof tiers[0]) => {
        setSelectedTier(tier);
        if (tier.id === 'price_elite_1200') {
            setSelectedAddons(addons);
        } else if(selectedTier?.id === 'price_elite_1200') {
            setSelectedAddons([]);
        }
    }
    
    const handleToggleAddon = (addon: typeof addons[0]) => {
        if (selectedTier?.id === 'price_elite_1200') return;
        setSelectedAddons(prev => prev.some(a => a.id === addon.id) ? prev.filter(a => a.id !== addon.id) : [...prev, addon]);
    }
    
    const totalAmount = useMemo(() => {
        const tierPrice = selectedTier?.price || 0;
        let addonsPrice = 0;
        if (selectedTier?.id !== 'price_elite_1200') {
            addonsPrice = selectedAddons.reduce((acc, addon) => acc + addon.price, 0);
        }
        return tierPrice + addonsPrice;
    }, [selectedTier, selectedAddons]);
    
    const handleCheckout = () => {
        if (!selectedTier) {
            toast({ variant: 'destructive', title: 'No Plan Selected', description: 'Please select a pricing plan to continue.' });
            return;
        }
        const cart = [
            { name: selectedTier.name, price: selectedTier.price, quantity: 1 },
            ...(selectedTier.id !== 'price_elite_1200' ? selectedAddons.map(addon => ({ name: addon.name, price: addon.price, quantity: 1 })) : [])
        ];
        const encodedCart = encodeURIComponent(JSON.stringify(cart));
        router.push(`/checkout?cart=${encodedCart}`);
    };

    const currentPlan = profile?.plan || 'Free';

    if (loading) {
        return (
            <AppLayout>
                <main className="flex-1 space-y-6 p-4 md:p-8">
                     <Skeleton className="h-8 w-48 mb-4" />
                     <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></CardContent><CardFooter><Skeleton className="h-10 w-32" /></CardFooter></Card>
                </main>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <main className="flex-1 space-y-8 p-4 md:p-8">
                 <div>
                    <h1 className="font-headline text-3xl font-bold">Billing & Plan</h1>
                    <p className="text-muted-foreground">Manage your subscription, view payment history, and upgrade your plan.</p>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Your Current Plan</CardTitle>
                        <div className="flex items-center gap-2 pt-2">
                            <Badge variant={currentPlan.toLowerCase() === 'free' ? 'secondary' : 'default'} className="text-base">{currentPlan}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold mb-4">Your plan includes:</p>
                        <ul className="space-y-3">
                            {getPlanFeatures(currentPlan).map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h2 className="font-headline text-2xl font-bold text-center">Upgrade Your Plan</h2>
                    <p className="text-muted-foreground text-center max-w-2xl mx-auto">Choose a package that fits your needs. All plans are designed to maximize your chance of success.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch mt-8">
                    {tiers.map((tier) => (
                    <motion.div key={tier.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Card 
                            className={cn(
                                `flex flex-col h-full transition-all duration-300 hover:shadow-lg cursor-pointer`,
                                selectedTier?.id === tier.id ? 'border-2 border-primary ring-4 ring-primary/20 shadow-xl' : 'shadow-sm',
                                tier.popular && selectedTier?.id !== tier.id && 'border-secondary',
                                currentPlan === tier.name && 'bg-muted'
                            )}
                            onClick={() => handleSelectTier(tier)}
                        >
                            {tier.popular && <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center"><div className="bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">Most Popular</div></div>}
                            <CardHeader className="pt-8 pb-4">
                                <CardTitle className="font-headline text-2xl font-bold">{tier.name}</CardTitle>
                                <div className="pt-2 flex items-baseline">
                                    <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                                    <span className="text-base font-semibold text-muted-foreground ml-1">CAD</span>
                                </div>
                                <CardDescription className="mt-2 text-muted-foreground text-sm h-12 flex items-center">{tier.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 py-4">
                                <ul className="space-y-3">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start text-sm">
                                        <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full" variant={selectedTier?.id === tier.id ? 'default' : 'outline'} disabled={currentPlan === tier.name}>
                                    {currentPlan === tier.name ? 'Current Plan' : selectedTier?.id === tier.id ? 'Selected' : 'Select Plan'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {selectedTier && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
                            <Separator className="my-12" />
                            <div className="text-center"><h2 className="font-headline text-2xl font-bold">Optional Add-ons</h2><p className="mt-2 text-muted-foreground">Enhance your selected package. All included in Elite Concierge.</p></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
                                {addons.map(addon => (
                                    <Card key={addon.id} className={cn("transition-all", selectedAddons.some(a => a.id === addon.id) && 'border-primary ring-2 ring-primary/20', selectedTier?.id === 'price_elite_1200' && 'opacity-70 cursor-not-allowed bg-gray-50')}>
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <Checkbox id={addon.id} checked={selectedAddons.some(a => a.id === addon.id)} onCheckedChange={() => handleToggleAddon(addon)} className="h-6 w-6" disabled={selectedTier?.id === 'price_elite_1200'} />
                                            <div className="grid gap-1.5 flex-1"><Label htmlFor={addon.id} className="text-base font-semibold cursor-pointer">{addon.name}</Label><p className="text-sm text-muted-foreground">{addon.description}</p></div>
                                            <div className="font-bold text-lg">{selectedTier?.id === 'price_elite_1200' ? (<Lock className="h-5 w-5 text-muted-foreground" />) : (`$${addon.price}`)}</div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-primary"/>Payment History</CardTitle>
                        <CardDescription>Your recent transactions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingPayments ? (<Skeleton className="h-20 w-full" />) : payments.length > 0 ? (
                            <Table>
                                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {payments.map(payment => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{format(payment.paidAt.toDate(), 'PPP')}</TableCell>
                                            <TableCell className="text-right font-mono">${(payment.amount / 100).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (<p className="text-sm text-muted-foreground text-center py-4">No payments found.</p>)}
                    </CardContent>
                </Card>

                <AnimatePresence>
                    {selectedTier && selectedTier.name !== currentPlan && (
                        <motion.div initial={{ opacity: 0, y: 50, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: 50, height: 0 }} transition={{ duration: 0.5, ease: 'easeInOut' }} className="fixed bottom-0 left-0 right-0 z-50 p-4">
                            <div className="container mx-auto max-w-4xl">
                                <Card className="bg-background/95 backdrop-blur-sm shadow-2xl border-primary">
                                    <CardContent className="p-4 flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-bold">{selectedTier.name} Plan</p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedAddons.length > 0 && selectedTier.id !== 'price_elite_1200' ? `${selectedAddons.length} add-on(s) selected` : selectedTier.id === 'price_elite_1200' ? 'All add-ons included' : 'No add-ons selected'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                 <p className="text-2xl font-bold">${totalAmount}</p>
                                                 <p className="text-xs text-muted-foreground">Total (CAD)</p>
                                            </div>
                                            <Button size="lg" onClick={handleCheckout}><Lock className="mr-2 h-4 w-4" />Proceed to Checkout</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </AppLayout>
    )
}
