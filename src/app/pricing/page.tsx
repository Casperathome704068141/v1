
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, PlusCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/marketing/site-header';
import { useAuth } from '@/context/auth-context';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const tiers = [
  {
    id: 'price_starter_450',
    name: 'Starter',
    price: 450,
    description: 'For confident students who just need compliant paperwork.',
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
    description: 'Shore up weak spots & file with confidence.',
    features: [
      'Everything in Starter, plus:',
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
    description: 'White-glove, end-to-end representation.',
    features: [
      'Everything—no add-on needed',
      'Up to 3 college applications & LOA sourcing',
      '$10 000 GIC + tuition payment processing',
      'Full IRCC portal submission under RCIC rep (IMM5476)',
      'Provincial Attestation Letter (PAL) handling',
      'Priority WhatsApp (same-day)',
    ],
  },
];

const addons = [
    { id: 'addon_ircc_submission', name: 'IRCC submission by RCIC', description: 'We upload, pay fees, monitor account', price: 250 },
    { id: 'addon_rush_processing', name: '24-hour rush processing', description: 'Forms & SOP delivered in 1 business day', price: 149 },
    { id: 'addon_hourly_consulting', name: 'Hourly consulting (beyond included)', description: 'Used for complex refusal histories', price: 125 },
    { id: 'addon_visa_refusal_session', name: 'Visa-refusal re-application strategy session', description: '60-min call + written action plan', price: 199},
];

export default function PricingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();
    const [selectedTier, setSelectedTier] = useState<typeof tiers[0] | null>(null);
    const [selectedAddons, setSelectedAddons] = useState<typeof addons>([]);
    
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
        if (!user) {
            toast({ title: 'Authentication Required', description: 'Please log in or sign up to complete your purchase.' });
            router.push('/login');
            return;
        }
        
        const cart = [
            { name: selectedTier.name, price: selectedTier.price, quantity: 1 },
            ...(selectedTier.id !== 'price_elite_1200' ? selectedAddons.map(addon => ({ name: addon.name, price: addon.price, quantity: 1 })) : [])
        ];
        const encodedCart = encodeURIComponent(JSON.stringify(cart));
        router.push(`/checkout?cart=${encodedCart}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <SiteHeader />
            <main className="flex-1">
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                      <h1 className="font-bold text-4xl text-foreground text-balance">
                        Find the Plan That's Right For You
                      </h1>
                      <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground text-balance">
                        Choose a package that fits your needs. All plans are designed to maximize your chance of success.
                      </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-end mt-16">
                      {tiers.map((tier, i) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <Card 
                                className={cn(
                                    `flex flex-col h-full transition-all duration-300 hover:shadow-2xl cursor-pointer`, 
                                    selectedTier?.id === tier.id ? 'border-2 border-primary ring-4 ring-primary/20 shadow-2xl' : 'border-border/50 shadow-lg',
                                    tier.popular && 'relative'
                                )}
                                onClick={() => handleSelectTier(tier)}
                            >
                                {tier.popular && <Badge variant="secondary" className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">Most Popular</Badge>}
                                <CardHeader className="pt-8 pb-4">
                                    <CardTitle className="font-bold text-2xl">{tier.name}</CardTitle>
                                    <div className="pt-2 flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                                        <span className="text-sm font-semibold text-muted-foreground">CAD</span>
                                    </div>
                                    <CardDescription className="mt-2 text-muted-foreground text-sm h-10">{tier.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 py-4">
                                    <ul className="space-y-3">
                                    {tier.features.map((feature, index) => (
                                        <li key={index} className="flex items-start text-sm">
                                            {feature.includes('plus:') || feature.includes('needed') ? 
                                                <PlusCircle className="mr-3 h-5 w-5 flex-shrink-0 text-primary" /> : 
                                                <Check className="mr-3 h-5 w-5 flex-shrink-0 text-success" />
                                            }
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                    </ul>
                                </CardContent>
                               <CardFooter className="p-4 pt-0">
                                    <Button className="w-full" variant={selectedTier?.id === tier.id ? 'default' : 'outline'}>
                                        {selectedTier?.id === tier.id ? 'Selected' : 'Select Plan'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                      ))}
                    </div>

                    <AnimatePresence>
                    {selectedTier && (
                      <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <Separator className="my-16" />

                        <div className="text-center">
                          <h2 className="font-bold text-3xl text-foreground text-balance">
                            Optional Add-ons
                          </h2>
                          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground text-balance">
                            Enhance your selected package. All add-ons are included in the Elite Concierge plan.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-4xl mx-auto">
                            {addons.map(addon => (
                                <Card 
                                    key={addon.id} 
                                    className={cn("transition-all", 
                                        selectedAddons.some(a => a.id === addon.id) && 'border-primary ring-2 ring-primary/20',
                                        selectedTier?.id === 'price_elite_1200' && 'opacity-60 cursor-not-allowed bg-muted/30'
                                    )}
                                >
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <Checkbox 
                                            id={addon.id}
                                            checked={selectedAddons.some(a => a.id === addon.id)}
                                            onCheckedChange={() => handleToggleAddon(addon)}
                                            className="h-6 w-6"
                                            disabled={selectedTier?.id === 'price_elite_1200'}
                                        />
                                        <div className="grid gap-1.5 flex-1">
                                            <Label htmlFor={addon.id} className="text-base font-semibold cursor-pointer">
                                                {addon.name}
                                            </Label>
                                            <p className="text-sm text-muted-foreground">{addon.description}</p>
                                        </div>
                                        <div className="font-bold text-lg">
                                            {selectedTier?.id === 'price_elite_1200' ? (
                                                <Lock className="h-5 w-5 text-muted-foreground" />
                                            ) : (
                                                `$${addon.price}`
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                      </motion.div>
                    )}
                    </AnimatePresence>

                    <AnimatePresence>
                    {selectedTier && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: 50, height: 0 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="fixed bottom-0 left-0 right-0 z-50 p-4"
                        >
                            <div className="container mx-auto max-w-4xl">
                                <Card className="bg-background/95 backdrop-blur-sm shadow-2xl border-primary/50">
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
                                            <Button size="lg" onClick={handleCheckout}>
                                                <Lock className="mr-2 h-4 w-4" />
                                                Proceed to Checkout
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>

                </div>
            </main>
            <footer className="bg-background border-t">
                <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-5">
                    <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Image src="/logo.svg" alt="Maple Leafs Education Logo" width={24} height={24} />
                        <span className="font-bold text-lg">Maple Leafs Education</span>
                    </div>
                    <p className="text-xs text-muted-foreground">&copy; 2024 Maple Leafs Education. <br /> A BENO 1017 Product.</p>
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
