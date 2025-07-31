'use client';
import Link from 'next/link';
import { AppLayout } from '@/components/app-layout';
import { BookOpen, Workflow, Home, HeartPulse, Flag } from 'lucide-react';

const topics = [
  { title: 'Study Permit Basics', slug: 'study-permit-basics', description: 'Learn core requirements: financial proof, acceptance letters, biometrics.', icon: BookOpen },
  { title: 'Application Steps', slug: 'application-steps', description: 'Step-by-step guide to your permit application.', icon: Workflow },
  { title: 'Life in Canada', slug: 'life-in-canada', description: 'Housing, part-time work rules, and adjusting to Canadian culture.', icon: Home },
  { title: 'Health Insurance', slug: 'health-insurance', description: 'Coverage options for international students.', icon: HeartPulse },
  { title: 'Pathways to PR', slug: 'pathways-to-pr', description: 'Explore how to become a permanent resident.', icon: Flag },
];

export default function HubPage() {
  return (
    <AppLayout>
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-6">Learning Hub</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((t) => (
            <Link href={`/hub/${t.slug}`} key={t.slug} className="hub-card">
              <t.icon className="hub-card-icon" />
              <h2 className="hub-card-title">{t.title}</h2>
              <p className="hub-card-desc">{t.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}
