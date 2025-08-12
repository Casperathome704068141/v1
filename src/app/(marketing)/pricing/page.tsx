
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const plans = [
  {
    id: 'starter',
    name: 'Starter — DIY, but safer',
    price: { monthly: 45, yearly: 486 },
    features: ['Auto-filled IMM forms', 'Dynamic document checklist', 'AI SOP generator'],
    cta: "Choose Starter"
  },
  {
    id: 'advantage',
    name: 'Advantage — Most popular: expert-polished',
    price: { monthly: 75, yearly: 810 },
    features: ['Everything in Starter', 'Proof-of-funds check', '2× RCIC sessions', 'Final pre-submission QA'],
    popular: true,
    cta: "Choose Advantage"
  },
  {
    id: 'elite',
    name: 'Elite Concierge — White-glove end-to-end',
    price: { monthly: 120, yearly: 1296 },
    features: ['Everything in Advantage', 'Full IRCC submission', 'Priority support', 'GIC & Tuition Payment'],
    cta: "Choose Elite"
  },
];

const faqs = [
    { q: "Is there a free trial?", a: "You can start for free to use our eligibility checker and explore college matches. A paid plan is required to use our application-building tools." },
    { q: "What if my visa gets refused?", a: "While we cannot guarantee outcomes, our expert review significantly increases your chances. Elite plan members may be eligible for a partial credit towards a re-application." },
    { q: "Can I upgrade my plan later?", a: "Yes, you can upgrade your plan at any time from your billing dashboard. You will only be charged the prorated difference." },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="container mx-auto space-y-20 py-24 px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight text-balance">
          Choose the plan that's right for you.
        </h1>
        <p className="mt-4 text-lg text-slateMuted max-w-2xl mx-auto text-balance">
            Simple, transparent pricing. All plans include our core platform features to help you succeed.
        </p>
      </motion.div>

      <div className="flex items-center justify-center gap-4">
        <Label htmlFor="billing-cycle" className={!isYearly ? 'text-white' : 'text-slateMuted'}>Monthly</Label>
        <Switch id="billing-cycle" checked={isYearly} onCheckedChange={setIsYearly} />
        <Label htmlFor="billing-cycle" className={isYearly ? 'text-white' : 'text-slateMuted'}>
            Annual <Badge variant="secondary" className="bg-green text-white ml-2">-10%</Badge>
        </Label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="h-full"
          >
            <Card className={`flex flex-col h-full bg-surface1 border-white/10 ${plan.popular ? 'border-blue shadow-2xl' : ''}`}>
              {plan.popular && (
                  <div className="py-1 px-4 bg-blue text-white text-sm font-bold rounded-t-lg">MOST POPULAR</div>
              )}
              <CardHeader className="text-left">
                <CardTitle className="font-display text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-2 pt-2">
                    <span className="font-display text-4xl">${isYearly ? plan.price.yearly / 12 : plan.price.monthly}</span>
                    <span className="text-slateMuted">/ month</span>
                </div>
                <p className="text-sm text-slateMuted">{isYearly ? `Billed as $${plan.price.yearly} per year.` : `Billed monthly.`}</p>
              </CardHeader>
              <CardContent className="flex-1 text-left space-y-4">
                <div className="w-full h-px bg-white/10"></div>
                <ul className="space-y-3">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green" />
                      <span className="text-slateMuted">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild size="lg" className="w-full bg-blue text-white hover:bg-blue/90">
                    <Link href="/signup">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

       <div className="max-w-3xl mx-auto text-left">
           <h3 className="font-display text-2xl text-center mb-8">Frequently Asked Questions</h3>
            <div className="space-y-4">
            {faqs.map(faq => (
                <details key={faq.q} className="p-4 rounded-lg bg-surface1 border border-white/10 group">
                    <summary className="flex items-center justify-between font-medium cursor-pointer list-none">
                        <span>{faq.q}</span>
                        <HelpCircle className="h-5 w-5 text-slateMuted group-open:text-white" />
                    </summary>
                    <p className="mt-4 text-slateMuted">{faq.a}</p>
                </details>
            ))}
            </div>
       </div>

    </div>
  );
}
