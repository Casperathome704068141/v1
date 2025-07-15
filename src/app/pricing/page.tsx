
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, PlusCircle, Lock, PackageCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/marketing/site-header';
import { useAuth } from '@/context/auth-context';

const tiers = [
  {
    id: 'price_starter_450',
    name: 'Starter',
    price: 450,
    description: 'For DIY-leaning students who already have an LOA & strong funds.',
    features: [
      'Auto-filled IMM Forms',
      'Dynamic Document Checklist',
      'AI SOP Template Generator',
      '1 x 30-min RCIC Video Call',
    ],
  },
  {
    id: 'price_advantage_745',
    name: 'Advantage',
    price: 745,
    description: 'For mid-risk applicants or first-time filers who want hand-holding.',
    features: [
      'Everything in Starter',
      'Full SOP/LOE Ghost-Writing',
      'Proof-of-Funds Verification',
      '2 x 45-min RCIC Sessions',
      'Final Pre-Submission QA Check'
    ],
    popular: true,
  },
  {
    id: 'price_elite_1200',
    name: 'Elite Concierge',
    price: 1200,
    description: 'For previous refusals, busy families, or corporate-sponsored clients.',
    features: [
      'All Advantage features',
      'Up to 3 College LOA Sourcing',
      'Full IRCC Portal Submission',
      'Priority WhatsApp Support',
    ],
  },
];

const addons = [
    {
        id: 'addon_sop_review',
        name: 'Expert SOP Review & Edit',
        description: 'An RCIC will review, edit, and strengthen your Statement of Purpose.',
        price: 150,
    },
    {
        id: 'addon_rcic_consult',
        name: 'Extra 45-min RCIC Consultation',
        description: 'Book an additional one-on-one session with an immigration consultant.',
        price: 200,
    }
]

export default function PricingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();
    const [selectedTier, setSelectedTier] = useState<typeof tiers[0] | null>(null);
    const [selectedAddons, setSelectedAddons] = useState<typeof addons>([]);

    const handleSelectTier = (tier: typeof tiers[0]) => {
        setSelectedTier(tier);
    }
    
    const handleToggleAddon = (addon: typeof addons[0]) => {
        setSelectedAddons(prev => 
            prev.some(a => a.id === addon.id)
                ? prev.filter(a => a.id !== addon.id)
                : [...prev, addon]
        );
    }
    
    const totalAmount = useMemo(() => {
        const tierPrice = selectedTier?.price || 0;
        const addonsPrice = selectedAddons.reduce((acc, addon) => acc + addon.price, 0);
        return tierPrice + addonsPrice;
    }, [selectedTier, selectedAddons]);
    
    const handleCheckout = () => {
        if (!selectedTier) {
            toast({
                variant: 'destructive',
                title: 'No Plan Selected',
                description: 'Please select a pricing plan to continue.',
            });
            return;
        }

        if (!user) {
            toast({
                title: 'Authentication Required',
                description: 'Please log in or sign up to complete your purchase.',
            });
            router.push('/login');
            return;
        }
        
        const cart = [
            { name: selectedTier.name, price: selectedTier.price, quantity: 1 },
            ...selectedAddons.map(addon => ({ name: addon.name, price: addon.price, quantity: 1 }))
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
                      <h1 className="font-headline text-4xl font-black text-foreground">
                        Find the Plan That's Right For You
                      </h1>
                      <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Choose a package that fits your needs. All plans are designed to maximize your chance of success.
                      </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch mt-16">
                      {tiers.map((tier, i) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <Card className={cn(
                              `flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer`, 
                              selectedTier?.id === tier.id ? 'border-2 border-primary ring-4 ring-primary/20' : '',
                              tier.popular && 'border-secondary'
                            )}
                            onClick={() => handleSelectTier(tier)}
                            >
                              {tier.popular && (
                                  <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                                    <div className="bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                                      Most Popular
                                    </div>
                                  </div>
                              )}
                              <CardHeader className="pt-8">
                                <CardTitle className="font-headline text-2xl font-bold">{tier.name}</CardTitle>
                                <div className="pt-4 flex items-baseline">
                                    <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                                    <span className="text-sm font-semibold text-muted-foreground ml-1">CAD</span>
                                </div>
                                <CardDescription className="h-12">{tier.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="flex-1">
                                <ul className="space-y-4">
                                  {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start">
                                      {feature.includes('plus:') || feature.includes('All') ? (
                                          <PlusCircle className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                                      ) : (
                                          <Check className="mr-3 h-5 w-5 text-green-500" />
                                      )}
                                      <span className="text-sm text-muted-foreground">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                               <CardFooter>
                                {selectedTier?.id === tier.id ? (
                                    <div className="w-full text-center font-bold text-primary flex items-center justify-center gap-2">
                                        <PackageCheck />
                                        Selected
                                    </div>
                                ) : (
                                     <div className="w-full text-center font-semibold text-muted-foreground">Select Plan</div>
                                )}
                              </CardFooter>
                            </Card>
                        </motion.div>
                      ))}
                    </div>

                    <Separator className="my-16" />

                     <div className="text-center">
                      <h2 className="font-headline text-3xl font-black text-foreground">
                        Optional Add-ons
                      </h2>
                      <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Enhance your selected package with these a-la-carte services.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
                        {addons.map(addon => (
                            <Card 
                                key={addon.id} 
                                className={cn("transition-all", selectedAddons.some(a => a.id === addon.id) && 'border-primary ring-2 ring-primary/20')}
                            >
                                <CardContent className="p-4 flex items-center gap-4">
                                    <Checkbox 
                                        id={addon.id}
                                        checked={selectedAddons.some(a => a.id === addon.id)}
                                        onCheckedChange={() => handleToggleAddon(addon)}
                                        className="h-6 w-6"
                                    />
                                    <div className="grid gap-1.5 flex-1">
                                        <Label htmlFor={addon.id} className="text-base font-semibold cursor-pointer">
                                            {addon.name}
                                        </Label>
                                        <p className="text-sm text-muted-foreground">{addon.description}</p>
                                    </div>
                                    <div className="font-bold text-lg">${addon.price}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    
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
                                <Card className="bg-background/95 backdrop-blur-sm shadow-2xl border-primary">
                                    <CardContent className="p-4 flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-bold">{selectedTier.name} Plan</p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedAddons.length > 0 ? `${selectedAddons.length} add-on(s) selected` : 'No add-ons selected'}
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
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                    <div>
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
