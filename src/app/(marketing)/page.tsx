'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Layers,
  ShieldCheck,
  Sparkles,
  Timer,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ProcessLoader } from '@/components/marketing/process-loader';
import { TestimonialMarquee } from '@/components/marketing/testimonial-marquee';

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing },
  },
};

const staggered: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easing,
      delay: i * 0.12,
    },
  }),
};

const metrics = [
  { value: '1,200+', label: 'programs tracked in real time' },
  { value: '94%', label: 'files approved on first RCIC review' },
  { value: '<10 min', label: 'to generate your action plan' },
];

const depthCards = [
  {
    title: 'Match Engine',
    description:
      'Blend your academics, finances, and goals to surface intake-ready programs ranked by fit and acceptance odds.',
    ctaLabel: 'Explore matching',
    href: '/how-it-works',
    badgeLabel: 'Phase',
    badgeValue: '01',
  },
  {
    title: 'Application Workspace',
    description:
      'Auto-build checklists, gather templates, and manage deadlines in one workspace that updates as requirements change.',
    ctaLabel: 'See the workspace',
    href: '/documents',
    badgeLabel: 'Phase',
    badgeValue: '02',
  },
  {
    title: 'RCIC Safety Net',
    description:
      'Licensed experts audit every document, flagging gaps and giving you green lights only when the file is visa-ready.',
    ctaLabel: 'Meet the experts',
    href: '/support',
    badgeLabel: 'Phase',
    badgeValue: '03',
  },
];

const detailFeatures = [
  {
    icon: Compass,
    title: 'Personal intake',
    description:
      'Answer 12 focused questions and watch the platform align recommended programs, scholarships, and visa paths.',
  },
  {
    icon: Sparkles,
    title: 'AI copilots',
    description:
      'Draft letters, summarize requirements, and translate school updates instantly with our in-app AI assistants.',
  },
  {
    icon: Layers,
    title: 'Task orchestration',
    description:
      'Weekly nudges, smart dependencies, and progress views keep you ahead of each submission milestone.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance ready',
    description:
      'Every checklist mirrors IRCC expectations with built-in document quality checks before RCIC sign-off.',
  },
];

const processSteps = [
  {
    title: 'Clarify your pathway',
    description:
      'Pin down your goal, province preferences, and intake timelines so the platform can scope what is realistic.',
    bullets: [
      'Set your study or immigration target',
      'Upload academic history once',
      'Align on budgets and scholarships',
    ],
  },
  {
    title: 'Build your submission kit',
    description:
      'Collaborate inside one workspace with document templates, AI drafting help, and smart reminders that adapt to your pace.',
    bullets: [
      'Draft SOPs with AI suggestions',
      'Collect docs with smart upload requests',
      'Track deadlines with one calendar',
    ],
  },
  {
    title: 'Validate and launch',
    description:
      'RCICs review your file, highlight final tweaks, and hand you a submission-ready package with confidence scoring.',
    bullets: [
      'Run automated compliance scans',
      'Book your RCIC review slot',
      'Submit with status tracking and receipts',
    ],
  },
];

export default function HomePage() {
  const heroTitle = 'Canada, without the guesswork.';
  const heroSubhead =
    'AI speed + RCIC accuracy to pick your college, build your file, and apply with confidence.';

  return (
    <div className="overflow-x-clip">
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(26,60,255,0.35),_rgba(10,18,54,0)_55%)]" />
        <div className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/10 blur-3xl" />
        <div className="container mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-10 text-center lg:text-left">
            <motion.span
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slateMuted/80 backdrop-blur"
            >
              Built for international students
            </motion.span>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-balance font-display text-4xl md:text-5xl lg:text-6xl"
            >
              {heroTitle}
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mx-auto max-w-2xl text-lg text-slateMuted lg:mx-0"
            >
              {heroSubhead}
            </motion.p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col items-center justify-start gap-4 sm:flex-row lg:justify-start"
            >
              <Button
                asChild
                size="lg"
                className="w-full bg-red text-white hover:bg-red/90 sm:w-auto"
              >
                <Link href="/signup">Get started</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-white/20 bg-white/5 text-blue hover:bg-white/10 sm:w-auto"
              >
                <Link href="/how-it-works">See how it works</Link>
              </Button>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="grid gap-6 text-left sm:grid-cols-3"
            >
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <p className="text-2xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-2 text-sm text-slateMuted">{metric.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: easing }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-surface1/70 to-surface2/80 p-6 shadow-[0_40px_120px_rgba(7,19,64,0.45)] backdrop-blur">
              <div className="absolute inset-x-6 top-6 -z-10 h-32 rounded-full bg-blue/40 blur-3xl" />
              <ProcessLoader
                className="mx-auto"
                overline="Workspace preview"
                headline="Building your submission hub"
                description="Aggregating deadlines, document tasks, and funding checkpoints tailored to your profile."
                accentClassName="text-blue"
              />
              <div className="mt-8 space-y-4 text-left">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slateMuted backdrop-blur">
                  <span className="font-semibold text-foreground">Next task</span>
                  <span>Upload passport scan</span>
                </div>
                <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em] text-slateMuted/80">
                    <span>Progress</span>
                    <span className="text-foreground">68%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10">
                    <div className="h-full w-[68%] rounded-full bg-blue" />
                  </div>
                  <p className="text-xs text-slateMuted">
                    Docs verified: 13 / 19 | Deadlines locked in for Winter &apos;26
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-gradient-to-r from-blue/30 via-blue/20 to-transparent px-4 py-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slateMuted/80">
                    Upcoming review
                  </p>
                  <p className="mt-2 text-sm text-foreground">
                    RCIC audit scheduled in <span className="font-semibold text-white">2 days</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <motion.span
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slateMuted/80 backdrop-blur"
          >
            What you get
          </motion.span>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mt-6 text-balance font-display text-3xl md:text-4xl"
          >
            Your journey, mapped into three deeply guided phases
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mx-auto mt-4 max-w-2xl text-lg text-slateMuted"
          >
            Each phase combines automation, human review, and progress insights so you never guess the next move.
          </motion.p>
        </div>
        <div className="mt-16 grid justify-items-center gap-10 lg:grid-cols-3">
          {depthCards.map((card, index) => (
            <motion.div
              key={card.title}
              className="depth-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={staggered}
              custom={index}
            >
              <div className="depth-card__inner">
                <div className="depth-card__content">
                  <div className="depth-card__marker" aria-hidden="true">
                    <span className="depth-card__marker-label">{card.badgeLabel}</span>
                    <span className="depth-card__marker-value">{card.badgeValue}</span>
                  </div>
                  <h3 className="depth-card__title">{card.title}</h3>
                  <p className="depth-card__body">{card.description}</p>
                  <Link href={card.href} className="depth-card__cta">
                    <span>{card.ctaLabel}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="relative py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(20,32,84,0.75),_rgba(10,18,54,0)_70%)]" />
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[minmax(0,0.9fr)_1fr] lg:items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="space-y-6"
          >
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slateMuted/80 backdrop-blur">
              Always-on guidance
            </span>
            <h2 className="text-balance font-display text-3xl md:text-4xl">
              Confidence at every milestone
            </h2>
            <p className="text-lg text-slateMuted">
              Stay focused with proactive alerts, AI copilots, and human experts all inside one workspace. No juggling spreadsheets or wondering what&apos;s next.
            </p>
            <div className="space-y-5 text-sm text-slateMuted">
              <div className="flex items-start gap-3">
                <Timer className="mt-1 h-5 w-5 text-blue" />
                <div>
                  <p className="font-semibold text-foreground">Stay on schedule</p>
                  <p>Smart reminders bundle tasks by priority and adjust automatically when intakes shift.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5 text-blue" />
                <div>
                  <p className="font-semibold text-foreground">Create with confidence</p>
                  <p>Draft statements, resumes, and cover letters alongside examples that match your background.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-blue" />
                <div>
                  <p className="font-semibold text-foreground">Trust every submission</p>
                  <p>Compliance rules from RCICs run in the background so you never submit incomplete files.</p>
                </div>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="mt-6 w-full bg-blue text-white hover:bg-blue/90 sm:w-auto"
            >
              <Link href="/how-it-works">Take the guided tour</Link>
            </Button>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2">
            {detailFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggered}
                custom={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-blue/60 hover:bg-blue/10"
              >
                <feature.icon className="h-8 w-8 text-blue" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-slateMuted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="grid gap-10 md:grid-cols-3 md:items-center"
        >
          <div className="space-y-4 md:col-span-1">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slateMuted/80 backdrop-blur">
              Step-by-step clarity
            </span>
            <h2 className="text-balance font-display text-3xl md:text-4xl">
              What working with us feels like
            </h2>
            <p className="text-slateMuted">
              Three focus areas, countless nudges. Here’s how the journey unfolds once you activate your account.
            </p>
          </div>
          <div className="space-y-8 md:col-span-2">
            {processSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm text-slateMuted">{step.description}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slateMuted">
                  {step.bullets.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
      <section className="py-24">
        <TestimonialMarquee />
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="font-semibold uppercase tracking-[0.4em] text-slateMuted">
            Trusted by students worldwide
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-12 opacity-70 grayscale">
            {[1, 2, 3, 4].map((logo) => (
              <Image
                key={logo}
                src="/logo.svg"
                alt="Partner logo"
                width={120}
                height={48}
                data-ai-hint="company logo"
              />
            ))}
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 pb-24 text-center">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-surface1/70 to-surface2/80 p-10 backdrop-blur">
          <h2 className="text-balance font-display text-3xl md:text-4xl">
            Start free—build your profile in minutes
          </h2>
          <p className="mt-4 text-lg text-slateMuted">
            No credit card required. See exactly where you stand and unlock your personalized action plan today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full bg-red text-white hover:bg-red/90 sm:w-auto">
              <Link href="/signup">Create your account</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="w-full text-blue hover:text-blue hover:bg-transparent sm:w-auto"
            >
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
