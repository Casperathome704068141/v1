
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, PlusCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/marketing/site-header';

const tiers = [
  {
    id: 'price_starter_450',
    name: 'Starter',
    price: 450,
    priceSuffix: 'CAD',
    description: 'For DIY-leaning students who already have an LOA & strong funds.',
    features: [
      'Auto-filled IMM1294/5645',
      'Dynamic document checklist',
      'AI SOP generator',
      '1 × 30-min RCIC video call',
      'Live-chat (48 h SLA)',
    ],
    cta: 'Get Started',
    variant: 'outline' as const,
  },
  {
    id: 'price_advantage_745',
    name: 'Advantage',
    price: 745,
    priceSuffix: 'CAD',
    description: 'For mid-risk applicants or first-time filers who want hand-holding.',
    features: [
      'Everything in Starter, plus:',
      'Full SOP/LOE ghost-writing',
      'Proof-of-funds verification',
      '2 × 45-min RCIC sessions',
      'Final pre-submission QA check',
    ],
    cta: 'Get Started',
    popular: true,
    variant: 'default' as const,
  },
  {
    id: 'price_elite_1200',
    name: 'Elite Concierge',
    price: 1200,
    priceSuffix: 'CAD',
    description: 'For previous refusals, busy families, or corporate-sponsored clients.',
    features: [
      'Everything—no add-on needed',
      'Up to 3 college LOA sourcing',
      'Full IRCC portal submission',
      'PAL & GIC handling',
      'Priority WhatsApp (same-day)',
    ],
    cta: 'Get Started',
    variant: 'outline' as const,
  },
];

export default function PricingPage() {
    const router = useRouter();

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
                    
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-start mt-16">
                      {tiers.map((tier, i) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <Card className={cn(
                              `flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:scale-105`, 
                              tier.popular && 'border-2 border-primary'
                            )}>
                              {tier.popular && (
                                  <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                                    <motion.div 
                                        className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
                                    >
                                      Most Popular
                                    </motion.div>
                                  </div>
                              )}
                              <CardHeader className="pt-8">
                                <CardTitle className="font-headline text-2xl font-bold">{tier.name}</CardTitle>
                                <div className="pt-4 flex items-baseline">
                                    <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                                    {tier.priceSuffix && <span className="text-sm font-semibold text-muted-foreground ml-1">{tier.priceSuffix}</span>}
                                </div>
                                <CardDescription className="h-12">{tier.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="flex-1">
                                <ul className="space-y-4">
                                  {tier.features.map((feature, index) => (
                                    <motion.li 
                                        key={feature} 
                                        className="flex items-start"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: i * 0.1 + 0.2 + index * 0.05 }}
                                    >
                                      {feature.includes('plus:') || feature.includes('needed') ? (
                                          <PlusCircle className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                                      ) : (
                                          <Check className="mr-3 h-5 w-5 text-green-500" />
                                      )}
                                      <span className="text-sm text-muted-foreground">{feature}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </CardContent>
                              <CardFooter>
                                <Button 
                                    className="w-full" 
                                    variant={tier.variant}
                                    onClick={() => router.push('/signup')}
                                >
                                  {tier.cta}
                                </Button>
                              </CardFooter>
                            </Card>
                        </motion.div>
                      ))}
                    </div>
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
