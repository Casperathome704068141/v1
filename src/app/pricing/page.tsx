
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const tiers = [
  {
    id: 'price_starter',
    name: 'Starter',
    price: 149,
    priceSuffix: 'CAD',
    description: 'For high-score quiz users (≥75) who just need compliant paperwork.',
    features: [
      'Auto-filled IMM Forms',
      'Dynamic Document Checklist',
      'AI SOP Template Generator',
      'Live Chat Support (24h)',
    ],
    cta: 'Select Plan',
    variant: 'outline' as const,
  },
  {
    id: 'price_advantage',
    name: 'Advantage',
    price: 299,
    priceSuffix: 'CAD',
    description: 'For mid-score users (50–74) who want an expert to double-check their work.',
    features: [
      'Everything in Starter, plus:',
      '45-min RCIC Consultation',
      'Expert SOP Review & Edit',
      'Final Application QA Check',
    ],
    cta: 'Select Plan',
    popular: true,
    variant: 'default' as const,
  },
  {
    id: 'price_elite',
    name: 'Elite',
    price: 1099,
    priceSuffix: 'CAD',
    description: 'For low-score users (<50) or busy families wanting full representation.',
    features: [
      'All Advantage features, plus:',
      'Up to 3 College LOA Sourcing',
      'Full IRCC Portal Submission',
      'Priority WhatsApp Support',
    ],
    cta: 'Select Plan',
    variant: 'outline' as const,
  },
];

const addOns = [
    { id: "addon_sop", name: "SOP/LOE Full Ghost-Writing", price: 50 },
    { id: "addon_extra_app", name: "Extra College Application", price: 100 },
    { id: "addon_submission", name: "IRCC Submission (for Starter/Advantage)", price: 150 },
    { id: "addon_rush", name: "24-Hour Rush Processing", price: 79 },
    { id: "addon_consulting", name: "Hourly Consulting (beyond included)", price: 100 },
];

export default function PricingPage() {
    const [selectedPlan, setSelectedPlan] = useState<typeof tiers[0] | null>(null);
    const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleSelectPlan = (plan: typeof tiers[0]) => {
        setSelectedPlan(plan.id === selectedPlan?.id ? null : plan);
    };

    const handleAddonToggle = (addonId: string) => {
        setSelectedAddons(prev => ({ ...prev, [addonId]: !prev[addonId] }));
    };
    
    const calculateTotal = () => {
        let total = selectedPlan?.price || 0;
        for (const addonId in selectedAddons) {
            if (selectedAddons[addonId]) {
                const addon = addOns.find(a => a.id === addonId);
                if (addon) {
                    total += addon.price;
                }
            }
        }
        return total;
    };

    const total = calculateTotal();

    const handleCheckout = () => {
        setIsProcessing(true);

        const cartItems = [];
        if (selectedPlan) {
            cartItems.push({ name: selectedPlan.name, price: selectedPlan.price, quantity: 1 });
        }
        for (const addonId in selectedAddons) {
            if (selectedAddons[addonId]) {
                const addon = addOns.find(a => a.id === addonId);
                if (addon) {
                    cartItems.push({ name: addon.name, price: addon.price, quantity: 1 });
                }
            }
        }
        
        if (cartItems.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Empty Cart',
                description: 'Please select a plan before checking out.',
            });
            setIsProcessing(false);
            return;
        }

        const cartQueryParam = encodeURIComponent(JSON.stringify(cartItems));
        router.push(`/checkout?cart=${cartQueryParam}`);
    };

  return (
    <AppLayout>
      <main className="flex-1 space-y-12 p-4 md:p-8">
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
            Select a base package and add any optional services to build your perfect plan.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
          {tiers.map((tier, i) => (
            <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
            >
                <Card className={cn(
                  `flex flex-col h-full transition-all duration-300`, 
                  selectedPlan?.id === tier.id ? 'border-2 border-primary shadow-2xl scale-105' : 'border-border',
                  tier.popular && !selectedPlan && 'border-primary'
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
                          {feature.includes('plus:') ? (
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
                        variant={selectedPlan?.id === tier.id ? 'default' : 'outline'}
                        onClick={() => handleSelectPlan(tier)}
                    >
                      {selectedPlan?.id === tier.id ? 'Plan Selected' : tier.cta}
                    </Button>
                  </CardFooter>
                </Card>
            </motion.div>
          ))}
        </div>
        
        <Separator />

        <AnimatePresence>
        {selectedPlan && (
            <motion.div 
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-2xl">Customize Your Plan</CardTitle>
                        <CardDescription>Select any à-la-carte services to add to your package.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {addOns.map((addon, i) => (
                                <motion.li 
                                    key={addon.id} 
                                    className="flex justify-between items-center rounded-lg border p-4"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.1 }}
                                >
                                    <div>
                                        <Label htmlFor={addon.id} className="font-medium">{addon.name}</Label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-primary">${addon.price}</span>
                                        <Switch 
                                            id={addon.id} 
                                            checked={!!selectedAddons[addon.id]}
                                            onCheckedChange={() => handleAddonToggle(addon.id)}
                                        />
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>
        )}
        </AnimatePresence>

        <CartSummary total={total} onCheckout={handleCheckout} isProcessing={isProcessing} />

      </main>
    </AppLayout>
  );
}

function CartSummary({ total, onCheckout, isProcessing }: { total: number, onCheckout: () => void, isProcessing: boolean }) {
    return (
        <AnimatePresence>
            {total > 0 && (
                <motion.div
                    className="sticky bottom-0 w-full p-4"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    <Card className="max-w-2xl mx-auto shadow-2xl bg-background/95 backdrop-blur-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-lg font-bold">Total</p>
                                <p className="text-muted-foreground">Your customized package</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <p className="text-2xl font-black text-primary">${total.toLocaleString()}</p>
                                <Button size="lg" onClick={onCheckout} disabled={isProcessing || total <= 0}>
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={isProcessing ? 'processing' : 'checkout'}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                                        </motion.span>
                                    </AnimatePresence>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
