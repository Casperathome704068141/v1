
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/marketing/site-header';
import { useAuth } from '@/context/auth-context';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const tiers = [
  { id: 'price_starter_450', name: 'Starter', price: { monthly: 45, annually: 450 }, description: 'For confident students who need compliant paperwork.', features: ['Auto-filled IMM forms', 'Dynamic document checklist', 'AI SOP generator', '1 × 30-min RCIC video call'] },
  { id: 'price_advantage_745', name: 'Advantage', price: { monthly: 75, annually: 745 }, description: 'Shore up weak spots & file with professional confidence.', features: ['Everything in Starter', 'Full SOP/LOE ghost-writing', 'Proof-of-funds verification', '2 × 45-min RCIC sessions', 'Final pre-submission QA'], popular: true },
  { id: 'price_elite_1200', name: 'Elite Concierge', price: { monthly: 120, annually: 1200 }, description: 'White-glove, end-to-end representation by our experts.', features: ['Everything in Advantage', 'Full IRCC portal submission', 'Up to 3 college applications', 'GIC & tuition payment help', 'Priority WhatsApp support'] },
];

const PlanCard = ({ tier, isSelected, onSelect, billingCycle }) => (
    <Card 
        className={cn(`flex flex-col h-full transition-all duration-300 cursor-pointer group`, isSelected ? 'border-primary ring-4 ring-primary/20 shadow-2xl scale-105' : 'hover:shadow-xl hover:-translate-y-1')}
        onClick={() => onSelect(tier)}
    >
        {tier.popular && <Badge variant="accent" className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 shadow-lg border text-sm">Most Popular</Badge>}
        <CardHeader className="pt-12">
            <CardTitle className="text-2xl font-bold font-headline">{tier.name}</CardTitle>
            <CardDescription>{tier.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
            <div>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">${tier.price[billingCycle]}</span>
                    <span className="text-muted-foreground">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <ul className="space-y-3">
                    {tier.features.map(feature => (
                        <li key={feature} className="flex items-start text-sm"><Check className="mr-3 h-5 w-5 flex-shrink-0 text-success" /><span>{feature}</span></li>
                    ))}
                </ul>
            </div>
        </CardContent>
        <CardFooter>
            <Button className="w-full" variant={isSelected ? 'default' : 'outline'}>
                {isSelected ? 'Selected' : 'Choose Plan'}
            </Button>
        </CardFooter>
    </Card>
);

export default function PricingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();
    const [selectedTier, setSelectedTier] = useState<any>(tiers[1]);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');
    
    const handleCheckout = () => {
        if (!selectedTier) {
            toast({ variant: 'destructive', title: 'No Plan Selected' });
            return;
        }
        if (!user) {
            router.push('/signup');
            return;
        }
        
        const cart = [{ name: selectedTier.name, price: selectedTier.price[billingCycle], quantity: 1, type: 'plan' }];
        router.push(`/checkout?cart=${encodeURIComponent(JSON.stringify(cart))}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <SiteHeader />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-16">
                    <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                      <h1 className="text-4xl md:text-5xl font-bold font-headline text-balance">Find the Plan That's Right For You</h1>
                      <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground text-balance">Flexible pricing for every stage of your journey to Canada.</p>
                      <div className="flex items-center justify-center gap-4 mt-8">
                          <Label htmlFor="billing-cycle" className={cn(billingCycle === 'monthly' && 'text-primary')}>Monthly</Label>
                          <Switch id="billing-cycle" checked={billingCycle === 'annually'} onCheckedChange={(checked) => setBillingCycle(checked ? 'annually' : 'monthly')} />
                          <Label htmlFor="billing-cycle" className={cn(billingCycle === 'annually' && 'text-primary')}>Annually</Label>
                          <AnimatePresence>
                          {billingCycle === 'annually' && (
                            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}>
                                <Badge variant="success">Save 10%</Badge>
                            </motion.div>
                          )}
                          </AnimatePresence>
                      </div>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-start mt-16">
                      {tiers.map((tier, i) => (
                        <motion.div key={tier.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                            <PlanCard tier={tier} isSelected={selectedTier?.id === tier.id} onSelect={setSelectedTier} billingCycle={billingCycle} />
                        </motion.div>
                      ))}
                    </div>

                    <AnimatePresence>
                    {selectedTier && (
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-4 left-4 right-4 z-50">
                            <Card className="max-w-3xl mx-auto bg-card/90 backdrop-blur-sm shadow-2xl border">
                                <CardContent className="p-4 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-bold">{selectedTier.name} Plan ({billingCycle === 'annually' ? 'Annual' : 'Monthly'})</p>
                                        <p className="text-sm text-muted-foreground">You have selected the best plan for your needs.</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                             <p className="text-2xl font-bold">${selectedTier.price[billingCycle]}</p>
                                             <p className="text-xs text-muted-foreground">Total (CAD)</p>
                                        </div>
                                        <Button size="lg" onClick={handleCheckout}>Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </main>
             <footer className="bg-card border-t">
                <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-5">
                    <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Image src="/logo.svg" alt="Logo" width={24} height={24} /><span className="font-bold text-lg font-headline">Maple Leafs Education</span></div>
                    <p className="text-xs text-muted-foreground">&copy; 2024 MLE. A BENO 1017 Product.</p>
                    </div>
                    <div>
                    <h4 className="font-semibold mb-2">Platform</h4>
                    <nav className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <Link href="/#how-it-works" className="hover:text-primary hover:underline">How It Works</Link>
                        <Link href="/#testimonials" className="hover:text-primary hover:underline">Testimonials</Link>
                        <Link href="/pricing" className="hover:text-primary hover:underline">Pricing</Link>
                    </nav>
                    </div>
                    <div>
                    <h4 className="font-semibold mb-2">Company</h4>
                    <nav className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <Link href="/about" className="hover:text-primary hover:underline">About Us</Link>
                        <Link href="/support" className="hover:text-primary hover:underline">Contact</Link>
                        <Link href="/privacy" className="hover:text-primary hover:underline">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary hover:underline">Terms of Service</Link>
                    </nav>
                    </div>
                    <div>
                    <h4 className="font-semibold mb-2">Get Started</h4>
                    <nav className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <Link href="/login" className="hover:text-primary hover:underline">Log In</Link>
                        <Link href="/signup" className="hover:text-primary hover:underline">Sign Up</Link>
                        <Link href="/support" className="hover:text-primary hover:underline">Support</Link>
                    </nav>
                    </div>
                </div>
                </div>
            </footer>
        </div>
    );
}
