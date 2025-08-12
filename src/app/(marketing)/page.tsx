'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const features = [
  {
    title: 'Find your match',
    desc: 'Programs that fit your background, budget, and goals.',
  },
  {
    title: 'Build it right',
    desc: 'Checklists, templates, and auto-filled forms.',
  },
  {
    title: 'Expert review',
    desc: 'RCICs verify your file before you submit.',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-24 py-24">
      <section className="container mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 font-display text-5xl tracking-tight"
        >
          Canada, without the guesswork.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground"
        >
          AI speed + RCIC accuracy to pick your college, build your file, and apply with confidence.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button asChild className="bg-red text-white hover:bg-red/90">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" className="border-blue text-blue hover:bg-blue/10">
            <Link href="/pricing">See Pricing</Link>
          </Button>
        </motion.div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.1 }}
              className={cn('rounded-lg bg-surface1 p-6 shadow-card')}
            >
              <h3 className="font-display text-xl mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

