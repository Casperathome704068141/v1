
'use client';
import Link from 'next/link';
import { BookOpen, Workflow, Home, HeartPulse, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

const topics = [
  { title: 'Study Permit Basics', slug: 'study-permit-basics', description: 'Learn core requirements: financial proof, acceptance letters, biometrics.', icon: BookOpen },
  { title: 'Application Steps', slug: 'application-steps', description: 'Step-by-step guide to your permit application.', icon: Workflow },
  { title: 'Life in Canada', slug: 'life-in-canada', description: 'Housing, part-time work rules, and adjusting to Canadian culture.', icon: Home },
  { title: 'Health Insurance', slug: 'health-insurance', description: 'Coverage options for international students.', icon: HeartPulse },
  { title: 'Pathways to PR', slug: 'pathways-to-pr', description: 'Explore how to become a permanent resident.', icon: Flag },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
    },
  }),
};

export default function HubPage() {
  return (
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-4xl font-display mb-2">Learning Hub</h1>
        <p className="text-lg text-slateMuted mb-8">Your resource center for a successful journey to Canada.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((t, index) => {
            const Icon = t.icon;
            return (
                <motion.div
                  key={t.slug}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                <Link href={`/hub/${t.slug}`} className="block p-6 bg-surface1 rounded-lg border border-white/10 hover:border-blue hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue/20 h-full">
                  <Icon className="h-8 w-8 text-blue mb-3" />
                  <h2 className="text-xl font-bold font-display">{t.title}</h2>
                  <p className="text-slateMuted mt-1">{t.description}</p>
                </Link>
                </motion.div>
            )
          })}
        </div>
      </main>
  );
}
