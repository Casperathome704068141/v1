import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BrainCircuit, CalendarClock, FileText } from 'lucide-react';
import Link from 'next/link';

const featureCards = [
  {
    title: 'Eligibility Scanner',
    description: 'Take a 3-minute quiz to see your approval likelihood and get personalized tips.',
    icon: <FileText className="h-8 w-8" />,
    link: '/eligibility-quiz',
    cta: 'Start Quiz',
  },
  {
    title: 'College Match AI',
    description: 'Find your perfect school. Our AI matches you with the best DLIs based on your profile.',
    icon: <BrainCircuit className="h-8 w-8" />,
    link: '/college-match',
    cta: 'Find Colleges',
  },
  {
    title: 'Application Timeline',
    description: 'Stay on track with a visual timeline of all your important application milestones.',
    icon: <CalendarClock className="h-8 w-8" />,
    link: '#',
    cta: 'View Timeline',
  },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((card) => (
            <Card
              key={card.title}
              className="flex transform flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <div className="space-y-2">
                  <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </div>
                <div className="rounded-lg bg-secondary p-3 text-secondary-foreground">{card.icon}</div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full font-semibold">
                  <Link href={card.link}>
                    {card.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Profile Readiness</CardTitle>
            <CardDescription>
              Complete all required steps to maximize your application's success.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 rounded-lg bg-green-50 p-4">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <p className="text-sm font-medium text-green-800">Your profile is looking great!</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
