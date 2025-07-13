
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/hooks/use-user';
import { ArrowRight, BrainCircuit, CheckCircle, FileText, UserCheck } from 'lucide-react';
import Link from 'next/link';

const applicationSteps = [
    { name: 'Profile Information', completed: true, href: '#' },
    { name: 'Academic & Work History', completed: true, href: '#' },
    { name: 'Language Proficiency', completed: false, href: '#' },
    { name: 'Financial Details', completed: false, href: '#' },
    { name: 'Study Plan', completed: false, href: '#' },
    { name: 'Upload Documents', completed: false, href: '#' },
];

const completedSteps = applicationSteps.filter(step => step.completed).length;
const progressPercentage = (completedSteps / applicationSteps.length) * 100;

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <AppLayout>
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-muted-foreground">
                Let's continue your journey to studying in Canada. Here's your dashboard.
            </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
                <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Application Progress</CardTitle>
                        <CardDescription>You are {Math.round(progressPercentage)}% done with your application.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Progress value={progressPercentage} className="h-2" />
                        <ul className="space-y-4">
                            {applicationSteps.map((step) => (
                                <li key={step.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step.completed ? 'bg-primary' : 'bg-muted'}`}>
                                            <CheckCircle className={`h-5 w-5 ${step.completed ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                                        </div>
                                        <span className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{step.name}</span>
                                    </div>
                                    <Button asChild variant={step.completed ? 'ghost' : 'secondary'} size="sm">
                                        <Link href={step.href}>
                                            {step.completed ? 'Review' : 'Continue'} <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-8 md:col-span-1">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FileText className="h-5 w-5 text-primary" />
                            Eligibility Quiz
                        </CardTitle>
                        <CardDescription>
                            Confirm you meet the basic requirements for a study permit.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/eligibility-quiz">Take the Quiz</Link>
                        </Button>
                    </CardContent>
                </Card>

                 <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <BrainCircuit className="h-5 w-5 text-primary" />
                           College Match AI
                        </CardTitle>
                        <CardDescription>
                            Find Designated Learning Institutions that fit your profile and goals.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/college-match">Find a College</Link>
                        </Button>
                    </CardContent>
                </Card>

                 <Card className="bg-primary/5 border-primary/20 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-primary">
                            <UserCheck className="h-5 w-5 text-primary" />
                           Expert Review
                        </CardTitle>
                        <CardDescription>
                           Upgrade to our Premium or Ultimate plans for an RCIC expert to review your application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
                            <Link href="/pricing">View Plans</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </AppLayout>
  );
}
