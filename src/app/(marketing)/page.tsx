
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, Search, FileSignature } from 'lucide-react';
import Image from 'next/image';

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export default function HomePage() {
  const heroTitle = "Canada, without the guesswork.";
  const heroSubhead = "AI speed + RCIC accuracy to pick your college, build your file, and apply with confidence.";
  const features = [
    {
      icon: Search,
      title: "Find your match",
      desc: "Programs that fit your background, budget, and goals.",
    },
    {
      icon: FileSignature,
      title: "Build it right",
      desc: "Checklists, templates, and auto-filled forms.",
    },
    {
      icon: CheckCircle,
      title: "Expert review",
      desc: "RCICs verify your file before you submit.",
    },
  ];

  return (
    <div className="overflow-x-clip">
      <section className="container mx-auto px-4 py-24 md:py-32 text-center relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(26,60,255,0.2),_rgba(26,60,255,0)_50%)]" />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-display text-4xl md:text-6xl text-balance"
        >
          {heroTitle}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slateMuted text-balance"
        >
          {heroSubhead}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="bg-red text-white hover:bg-red/90 w-full sm:w-auto">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="text-blue hover:text-blue hover:bg-transparent w-full sm:w-auto">
            <Link href="/pricing">See Pricing</Link>
          </Button>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={featureVariants}
              className="bg-surface1 p-8 rounded-lg border border-white/10 shadow-card text-center"
            >
              <div className="mb-4 inline-block rounded-full bg-blue p-3">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-display text-xl mb-2">{feature.title}</h3>
              <p className="text-slateMuted">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
       <section className="py-24">
        <div className="container mx-auto text-center">
            <p className="font-bold text-slateMuted uppercase tracking-widest">Trusted By Students Worldwide</p>
            <div className="mt-8 flex justify-center items-center gap-12 opacity-60 grayscale">
                <Image src="/logo.svg" alt="Partner logo" width={100} height={40} data-ai-hint="company logo" />
                <Image src="/logo.svg" alt="Partner logo" width={100} height={40} data-ai-hint="company logo" />
                <Image src="/logo.svg" alt="Partner logo" width={100} height={40} data-ai-hint="company logo" />
                <Image src="/logo.svg" alt="Partner logo" width={100} height={40} data-ai-hint="company logo" />
            </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-3xl md:text-4xl">Start free—build your profile in minutes.</h2>
        <p className="mt-4 text-lg text-slateMuted">No credit card required. See where you stand today.</p>
        <Button size="lg" asChild className="mt-8 bg-red text-white hover:bg-red/90">
            <Link href="/signup">Create Your Account</Link>
        </Button>
      </section>
    </div>
  );
}
