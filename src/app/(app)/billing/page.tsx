
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Check, CheckCircle, Lock, PackageCheck, Star, Wallet, Zap, ArrowRight } from 'lucide-react';
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
import { Label } from '@/components/ui/label';

const tiers = [
  { id: 'price_starter_450', name: 'Starter', price: 450, description: 'For confident students who just need compliant paperwork.', features: ['Auto-filled IMM forms', 'Dynamic document checklist', 'AI SOP generator', '1 × 30-min RCIC video call', 'Live-chat support (48h SLA)'] },
  { id: 'price_advantage_745', name: 'Advantage', price: 745, description: 'Shore up weak spots & file with professional confidence.', features: ['Everything in Starter, plus:', 'Full SOP/LOE ghost-writing', 'Proof-of-funds verification', '2 × 45-min RCIC sessions', 'Final pre-submission QA', '72h priority chat'], popular: true },
  { id: 'price_elite_1200', name: 'Elite', price: 1200, description: 'White-glove, end-to-end representation by our experts.', features: ['Everything in Advantage, plus:', 'Full IRCC portal submission', 'Up to 3 college applications', '$10k GIC & tuition payment', 'PAL handling (ON/BC caps)', 'Priority WhatsApp support'], popular: false },
];

const addons = [
    { id: 'addon_ircc_submission', name: 'RCIC IRCC Portal Submission', description: 'We handle the final submission steps on the IRCC portal.', price: 250 },
    { id: 'addon_rush_processing', name: '24-Hour Rush Processing', description: 'Your forms and SOP draft delivered in 1 business day.', price: 149 },
    { id: 'addon_hourly_consulting', name: 'Additional Consulting Hour', description: 'For complex cases or extensive refusal histories.', price: 125 },
];

const PlanCard = ({ tier, isSelected, currentPlan, onSelect }: any) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card 
            className={cn(`bg-surface1 border-white/10 flex flex-col h-full transition-all duration-300 hover:shadow-xl cursor-pointer`, isSelected ? 'border-2 border-blue ring-4 ring-blue/20' : 'hover:border-blue/50', tier.popular && !isSelected && 'border-red', currentPlan === tier.name && 'bg-surface2')}
            onClick={() => onSelect(tier)}
        >
            {tier.popular && <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center"><Badge variant="destructive" className="shadow-lg border-white/20">Most Popular</Badge></div>}
            <CardHeader className="pt-10 pb-4">
                <CardTitle className="text-2xl font-display">{tier.name}</CardTitle>
                <div className="pt-2 flex items-baseline"><span className="text-4xl font-display">${tier.price}</span><span className="text-sm font-semibold text-slateMuted ml-1">CAD</span></div>
                <CardDescription className="h-10 text-slateMuted">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <ul className="space-y-3">
                    {tier.features.map((feature: string) => (
                        <li key={feature} className="flex items-start text-sm"><Check className="mr-3 h-5 w-5 flex-shrink-0 text-green" /><span className="text-slateMuted">{feature}</span></li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button className="w-full" variant={isSelected ? 'default' : 'outline'} disabled={currentPlan === tier.name}>
                    {currentPlan === tier.name ? 'Current Plan' : isSelected ? 'Selected' : 'Select Plan'}
                </Button>
            </CardFooter>
        </Card>
    </motion.div>
);

const AddonCard = ({ addon, isSelected, isElite, onToggle }: any) => (
    <Card className={cn("bg-surface2 border-white/10 transition-all", isSelected && 'border-blue', isElite && 'opacity-60 cursor-not-allowed')}>
        <CardContent className="p-4 flex items-center gap-4">
            <Checkbox id={addon.id} checked={isSelected} onCheckedChange={() => onToggle(addon)} className="h-6 w-6" disabled={isElite} />
            <Label htmlFor={addon.id} className="flex-1 grid gap-1 cursor-pointer"><span className="font-semibold">{addon.name}</span><p className="text-sm text-slateMuted">{addon.description}</p></Label>
            <div className="font-bold text-lg">{isElite ? <Lock className="h-5 w-5 text-slateMuted" /> : `$${addon.price}`}</div>
        </CardContent>
    </Card>
);

export default function BillingPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [payments, setPayments] = useState<any[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(true);
    const [selectedTier, setSelectedTier] = useState<any>(null);
    const [selectedAddons, setSelectedAddons] = useState<any[]>([]);

    const currentPlan = useMemo(() => profile?.plan || 'Free', [profile]);
    
    useEffect(() => {
        if (!user?.uid) { setLoadingPayments(false); return; }
        const q = query(collection(db, 'users', user.uid, 'payments'), orderBy('paidAt', 'desc'));
        const unsub = onSnapshot(q, snap => {
            setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoadingPayments(false);
        });
        return () => unsub();
    }, [user]);
    
    useEffect(() => {
        const currentTierData = tiers.find(t => t.name === currentPlan);
        setSelectedTier(currentTierData);
    }, [currentPlan]);

    const handleSelectTier = (tier: any) => {
        if (tier.name === currentPlan) return;
        setSelectedTier(tier);
        if (tier.name === 'Elite') {
            setSelectedAddons(addons);
        } else if (selectedTier?.name === 'Elite') {
            setSelectedAddons([]);
        }
    }
    
    const handleToggleAddon = (addon: any) => {
        if (selectedTier?.name === 'Elite') return;
        setSelectedAddons(prev => prev.some(a => a.id === addon.id) ? prev.filter(a => a.id !== addon.id) : [...prev, addon]);
    }
    
    const totalAmount = useMemo(() => {
        const tierPrice = selectedTier?.name !== currentPlan ? selectedTier?.price || 0 : 0;
        const addonsPrice = selectedTier?.name === 'Elite'
            ? 0
            : selectedAddons.reduce((acc, addon) => acc + addon.price, 0);
        return tierPrice + addonsPrice;
    }, [selectedTier, selectedAddons, currentPlan]);
    
    const handleCheckout = () => {
        if (!selectedTier || selectedTier.name === currentPlan) {
            toast({ variant: 'destructive', title: 'No Upgrade Selected' });
            return;
        }
        const cart = [
            { name: selectedTier.name, price: selectedTier.price, quantity: 1, type: 'plan' },
            ...(selectedTier.name !== 'Elite' ? selectedAddons.map(a => ({ name: a.name, price: a.price, quantity: 1, type: 'addon' })) : [])
        ];
        router.push(`/checkout?cart=${encodeURIComponent(JSON.stringify(cart))}`);
    };

    if (loading) return <main className="flex-1 p-8"><Skeleton className="h-64 w-full" /></main>;

    return (
        <main className="flex-1 space-y-12 p-4 md:p-8">
            <div>
                <h1 className="text-3xl font-display tracking-tight">Billing & Plan</h1>
                <p className="text-slateMuted mt-1">Manage your subscription, view payment history, and upgrade your plan.</p>
            </div>
            
            <Card className="bg-surface1 border-white/10">
                <CardHeader>
                    <CardTitle className="font-display">Your Current Plan</CardTitle>
                    <Badge variant={currentPlan === 'Free' ? 'secondary' : 'default'} className="w-fit text-base mt-2">{currentPlan}</Badge>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold mb-4">Your plan includes:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        {(tiers.find(t => t.name === currentPlan)?.features || ['Eligibility Quiz', 'College Match Tool', 'Application Form Access']).map(f => (
                            <li key={f} className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green" /><span className="text-slateMuted">{f}</span></li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <div className="text-center">
                <h2 className="text-3xl font-display tracking-tight">Upgrade Your Plan</h2>
                <p className="text-slateMuted mt-2 max-w-2xl mx-auto">Choose a package that fits your needs. All plans are designed to maximize your chance of success.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
                {tiers.map(tier => <PlanCard key={tier.id} tier={tier} isSelected={selectedTier?.id === tier.id} currentPlan={currentPlan} onSelect={handleSelectTier} />)}
            </div>

            <AnimatePresence>
            {selectedTier && selectedTier.name !== 'Free' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <div className="text-center mt-12"><h2 className="text-2xl font-display">Optional Add-ons</h2><p className="mt-1 text-slateMuted">Enhance your package. All included in Elite.</p></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
                        {addons.map(addon => <AddonCard key={addon.id} addon={addon} isSelected={selectedAddons.some(a => a.id === addon.id)} isElite={selectedTier?.name === 'Elite'} onToggle={handleToggleAddon} />)}
                    </div>
                </motion.div>
            )}
            </AnimatePresence>

            <Card className="bg-surface1 border-white/10">
                <CardHeader><CardTitle className="font-display flex items-center gap-2"><Wallet className="h-5 w-5 text-blue"/>Payment History</CardTitle><CardDescription className="text-slateMuted">Your recent transactions.</CardDescription></CardHeader>
                <CardContent>
                    {loadingPayments ? <Skeleton className="h-24 w-full" /> : payments.length > 0 ? (
                        <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                        <TableBody>{payments.map(p => (<TableRow key={p.id}><TableCell>{format(p.paidAt.toDate(), 'PPP')}</TableCell><TableCell className="text-right font-mono">${(p.amount / 100).toFixed(2)}</TableCell></TableRow>))}</TableBody></Table>
                    ) : (<p className="text-sm text-slateMuted text-center py-6">No payment history.</p>)}
                </CardContent>
            </Card>
            
            <AnimatePresence>
            {selectedTier && selectedTier.name !== currentPlan && (
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="sticky bottom-4 z-50">
                    <Card className="bg-surface2/90 border-white/10 backdrop-blur-sm shadow-2xl max-w-3xl mx-auto">
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-bold">{selectedTier.name} Plan</p>
                                <p className="text-sm text-slateMuted">{selectedAddons.length > 0 && selectedTier.name !== 'Elite' ? `${selectedAddons.length} add-on(s)` : 'No add-ons'}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right"><p className="text-2xl font-bold">${totalAmount}</p><p className="text-xs text-slateMuted">Total (CAD)</p></div>
                                <Button size="lg" onClick={handleCheckout} className="bg-red hover:bg-red/90">Checkout <ArrowRight className="ml-2 h-4 w-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
            </AnimatePresence>
        </main>
    )
}
