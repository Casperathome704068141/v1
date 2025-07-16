
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, PlusCircle, Lock, PackageCheck, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/marketing/site-header';
import { useAuth } from '@/context/auth-context';
import { Checkbox } from '@/components/ui/checkbox';

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
    consultantTime: '0.75 h',
    whoShouldBuy: 'DIY-leaning students who already have an LOA & strong funds',
    quizScoreRange: [75, Infinity],
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
    consultantTime: '2.5 h',
    whoShouldBuy: 'Mid-risk applicants (quiz 50–74) or first-time filers who want hand-holding',
    quizScoreRange: [50, 74],
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
      'Spouse/child forms (prep only)',
      'Post-decision follow-up & airport-arrival playbook',
      'Priority WhatsApp (same-day)',
    ],
    consultantTime: '6–8 h',
    whoShouldBuy: 'Previous refusals, high-risk countries, busy families, corporate-sponsored',
    quizScoreRange: [-Infinity, 49], // For < 50 or refusal/medical flag
  },
];

const addons = [
    {
        id: 'addon_extra_college',
        name: 'Extra college application/LOA filing',
        description: 'Public colleges & universities; we manage the portal',
        price: 175,
    },
    {
        id: 'addon_ircc_submission',
        name: 'IRCC submission by RCIC',
        description: 'We upload, pay fees, monitor account',
        price: 250,
    },
    {
        id: 'addon_rush_processing',
        name: '24-hour rush processing',
        description: 'Forms & SOP delivered in 1 business day',
        price: 149,
    },
    {
        id: 'addon_hourly_consulting',
        name: 'Hourly consulting (beyond included)',
        description: 'Used for complex refusal histories',
        price: 125,
    },
    {
        id: 'addon_visa_refusal_session',
        name: 'Visa-refusal re-application strategy session',
        description: '60-min call + written action plan',
        price: 199,
    },
    {
        id: 'addon_health_insurance',
        name: 'Health-insurance arrangement (1 yr)',
        description: 'Guard.me / Morcare setup',
        price: 79,
    },
    {
        id: 'addon_biometrics_booking',
        name: 'Biometrics-appointment booking',
        description: 'Includes VAC fee guidance',
        price: 39,
    },
    {
        id: 'addon_medical_scheduling',
        name: 'Medical-exam scheduling',
        description: 'We locate panel physician & book slot',
        price: 49,
    },
    {
        id: 'addon_pal_handling',
        name: 'PAL (Provincial Attestation Letter) handling',
        description: 'Ontario / BC 2025 cap requirement',
        price: 89,
    },
    {
        id: 'addon_doc_translation',
        name: 'Document translation & notarization (per page)',
        description: 'English/French certified translators',
        price: 25,
    },
    {
        id: 'addon_airport_pickup',
        name: 'Airport pickup + SIM + SIN setup (GTA / YVR)',
        description: 'Partner shuttle; includes phone/SIN bank help',
        price: 299,
    },
    {
        id: 'addon_housing_search',
        name: 'Housing search & lease review',
        description: '3 listings + lease red-flag check',
        price: 199,
    },
    {
        id: 'addon_pre_arrival_webinar',
        name: 'Pre-arrival orientation webinar',
        description: '90-min live Zoom with Q&A',
        price: 49,
    },
    {
        id: 'addon_post_arrival_coaching',
        name: 'Post-arrival settlement coaching',
        description: '2 × 30-min calls within first month',
        price: 149,
    },
];

export default function PricingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();
    const [selectedTier, setSelectedTier] = useState<typeof tiers[0] | null>(null);
    const [selectedAddons, setSelectedAddons] = useState<typeof addons>([]);
    const [quizScore, setQuizScore] = useState<number | null>(null); // Placeholder for quiz score: set this based on user's quiz results or profile.
    const [hasRefusalMedicalFlag, setHasRefusalMedicalFlag] = useState<boolean>(false); // Placeholder for refusal/medical flag

    // Example of how you might set quizScore and refusal/medical flag from user context or API
    // useEffect(() => {
    //   if (user?.quizScore) {
    //     setQuizScore(user.quizScore);
    //   }
    //   if (user?.hasRefusalMedicalFlag) {
    //     setHasRefusalMedicalFlag(user.hasRefusalMedicalFlag);
    //   }
    // }, [user]);

    const handleSelectTier = (tier: typeof tiers[0]) => {
        setSelectedTier(tier);
        // If Elite Concierge is selected, automatically select all add-ons
        if (tier.id === 'price_elite_1200') {
            setSelectedAddons(addons);
        } else {
            setSelectedAddons([]); // Clear addons if switching from Elite
        }
    }
    
    const handleToggleAddon = (addon: typeof addons[0]) => {
        if (selectedTier?.id === 'price_elite_1200') {
            // Addons are always included with Elite, so do nothing
            return;
        }
        setSelectedAddons(prev => 
            prev.some(a => a.id === addon.id)
                ? prev.filter(a => a.id !== addon.id)
                : [...prev, addon]
        );
    }
    
    const totalAmount = useMemo(() => {
        const tierPrice = selectedTier?.price || 0;
        let addonsPrice = 0;
        // Only calculate add-on price if not Elite tier. Elite includes all add-ons in its base price.
        if (selectedTier?.id !== 'price_elite_1200') {
            addonsPrice = selectedAddons.reduce((acc, addon) => acc + addon.price, 0);
        }
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
            // Only include add-ons in cart if not Elite tier, as Elite's price covers them
            ...(selectedTier.id !== 'price_elite_1200' ? selectedAddons.map(addon => ({ name: addon.name, price: addon.price, quantity: 1 })) : [])
        ];

        const encodedCart = encodeURIComponent(JSON.stringify(cart));
        router.push(`/checkout?cart=${encodedCart}`);
    };

    const getTierBadgeClass = (tier: typeof tiers[0]) => {
        if (quizScore === null && !hasRefusalMedicalFlag) return ''; 

        if (tier.id === 'price_starter_450' && quizScore !== null && quizScore >= 75) {
            return 'border-green-500 ring-green-500/20';
        }
        if (tier.id === 'price_advantage_745' && quizScore !== null && quizScore >= 50 && quizScore <= 74) {
            return 'border-yellow-500 ring-yellow-500/20';
        }
        // Elite tier condition: quizScore < 50 OR hasRefusalMedicalFlag is true
        if (tier.id === 'price_elite_1200' && (quizScore !== null && quizScore < 50 || hasRefusalMedicalFlag)) {
            return 'border-red-500 ring-red-500/20';
        }
        return '';
    };

    const showUpsellNudger = selectedTier && selectedTier.id !== 'price_elite_1200' && totalAmount > 900;

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
                              `flex flex-col h-full transition-all duration-300 hover:shadow-lg`, 
                              selectedTier?.id === tier.id ? 
                                'border-2 border-primary ring-4 ring-primary/20 shadow-xl' : 
                                'border border-gray-200 shadow-sm', // Adjusted default border/shadow
                              tier.popular && selectedTier?.id !== tier.id && 'border-secondary', // Popular badge only if not selected
                              getTierBadgeClass(tier) 
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
                                      {feature.includes('Everything in Starter, plus') ? (
                                          <PlusCircle className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                                      ) : feature.includes('Everything—no add-on needed') ? (
                                          <Star className="mr-3 h-5 w-5 flex-shrink-0 text-amber-500" />
                                      ) : (
                                          <Check className="mr-3 h-5 w-5 text-green-500" />
                                      )}
                                      <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                               <CardFooter className="p-4 pt-0">
                                <Button 
                                    className={cn(
                                        "w-full",
                                        selectedTier?.id === tier.id ? 
                                            (tier.id === 'price_advantage_745' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300') 
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    )}
                                    onClick={() => handleSelectTier(tier)}
                                >
                                    {selectedTier?.id === tier.id ? 'Selected' : 'Get Started'}
                                </Button>
                              </CardFooter>
                            </Card>
                        </motion.div>
                      ))}
                    </div>

                    <div className="text-center mt-8 text-sm text-muted-foreground">
                        <p><span className="font-bold">Payment plans:</span> Split-pay 50 % now / 50 % at IRCC submission for Advantage & Elite.</p>
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
                          <h2 className="font-headline text-3xl font-black text-foreground">
                            Optional Add-ons
                          </h2>
                          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                            Enhance your selected package with these a-la-carte services. All included in Elite Concierge.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
                            {addons.map(addon => (
                                <Card 
                                    key={addon.id} 
                                    className={cn("transition-all", 
                                        selectedAddons.some(a => a.id === addon.id) && 'border-primary ring-2 ring-primary/20',
                                        selectedTier?.id === 'price_elite_1200' && 'opacity-70 cursor-not-allowed bg-gray-50' // Dim, disable, and change background if Elite is selected
                                    )}
                                >
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <Checkbox 
                                            id={addon.id}
                                            checked={selectedAddons.some(a => a.id === addon.id)}
                                            onCheckedChange={() => handleToggleAddon(addon)}
                                            className="h-6 w-6"
                                            disabled={selectedTier?.id === 'price_elite_1200'} // Disable checkbox if Elite is selected
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
                                <Card className="bg-background/95 backdrop-blur-sm shadow-2xl border-primary">
                                    <CardContent className="p-4 flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-bold">{selectedTier.name} Plan</p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedAddons.length > 0 && selectedTier.id !== 'price_elite_1200' ? `${selectedAddons.length} add-on(s) selected` : selectedTier.id === 'price_elite_1200' ? 'All add-ons included' : 'No add-ons selected'}
                                            </p>
                                            {showUpsellNudger && (
                                                <p className="text-xs text-amber-500 mt-1">
                                                    Elite Concierge costs only $1,200 and adds 6 more premium services—upgrade?
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                 <p className="text-2xl font-bold">${totalAmount}</p>
                                                 <p className="text-xs text-muted-foreground">Total (CAD)</p>
                                            </div>
                                            <Button size="lg" onClick={handleCheckout} className="bg-blue-600 hover:bg-blue-700 text-white">
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
