'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const plans = [
  {
    id: 'starter',
    name: 'Starter — DIY, but safer',
    price: { monthly: 45, yearly: 486 },
    features: ['Auto-filled IMM forms', 'Document checklist', 'AI SOP generator'],
  },
  {
    id: 'advantage',
    name: 'Advantage — Most popular: expert-polished',
    price: { monthly: 75, yearly: 810 },
    features: ['Everything in Starter', 'Proof-of-funds check', '2× RCIC sessions'],
    popular: true,
  },
  {
    id: 'elite',
    name: 'Elite Concierge — White-glove end-to-end',
    price: { monthly: 120, yearly: 1296 },
    features: ['Everything in Advantage', 'Full IRCC submission', 'Priority support'],
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="container mx-auto space-y-12 py-24 px-4 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 font-display text-5xl tracking-tight"
      >
        Choose your plan
      </motion.h1>
      <div className="flex items-center justify-center gap-2">
        <span className={!annual ? 'text-blue font-semibold' : ''}>Monthly</span>
        <button
          aria-label="Toggle billing cycle"
          className="h-5 w-10 rounded-full bg-muted relative"
          onClick={() => setAnnual(a => !a)}
        >
          <span
            className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform"
            style={{ transform: `translateX(${annual ? '20px' : '0'})` }}
          />
        </button>
        <span className={annual ? 'text-blue font-semibold' : ''}>Annual</span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full bg-surface1">
              <CardHeader>
                <CardTitle className="text-xl font-display">
                  {p.name}
                </CardTitle>
                <p className="mt-2 text-3xl font-bold">
                  ${annual ? p.price.yearly : p.price.monthly}
                  <span className="text-base font-normal text-muted-foreground">/{annual ? 'yr' : 'mo'}</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-2 text-left">
                <ul className="space-y-1">
                  {p.features.map(f => (
                    <li key={f} className="text-sm">• {f}</li>
                  ))}
                </ul>
                <Button className="mt-4 w-full bg-blue text-white hover:bg-blue/90">Choose</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

