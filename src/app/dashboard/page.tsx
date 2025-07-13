
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/hooks/use-user';
import { ArrowRight, BrainCircuit, Check, Circle, FileText, UserCheck, Send } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useApplication } from '@/context/application-context';

const applicationStepsConfig = [
    { id: 'personalInfo', name: 'Profile Information', href: '/application?step=profile' },
    { id: 'academics', name: 'Academic & Work History', href: '/application?step=academics' },
    { id: 'language', name: 'Language Proficiency', href: '/application?step=language' },
    { id: 'finances', name: 'Financial Details', href: '/application?step=finances' },
    { id: 'studyPlan', name: 'Study Plan', href: '/application?step=plan' },
    { id: 'family', name: 'Family Information', href: '/application?step=family' },
    { id: 'background', name: 'Background & Security', href: '/application?step=background' },
    { id: 'documents', name: 'Upload Documents', href: '/application?step=documents' },
    { name: 'Application Submission', icon: Send },
    { name: 'Biometrics Completed' },
    { name: 'Medical Exam Passed' },
    { name: 'Passport Request' },
    { name: 'Visa Approved' },
];

const isStepCompleted = (stepId: keyof typeof applicationData, applicationData: any) => {
    if (!stepId || !applicationData[stepId]) return false;
    
    // For most forms, checking if the object is not empty is enough.
    // For more complex forms with arrays, we can add specific checks.
    const data = applicationData[stepId];
    if (stepId === 'academics') {
        return (data.educationHistory && data.educationHistory.length > 0) || (data.employmentHistory && data.employmentHistory.length > 0);
    }
     if (stepId === 'personalInfo') {
        return data.surname && data.givenNames; // A proxy for completion
    }
    return Object.keys(data).length > 0 && data.constructor === Object;
};

export default function DashboardPage() {
  const { user } = useUser();
  const { applicationData } = useApplication();

  const applicationSteps = applicationStepsConfig.map(step => ({
      ...step,
      completed: step.id ? isStepCompleted(step.id as any, applicationData) : step.completed || false
  }));

  const completedStepsCount = applicationSteps.filter(step => step.completed).length;
  const progressPercentage = (completedStepsCount / applicationSteps.length) * 100;
  const currentStepIndex = applicationSteps.findIndex(step => !step.completed);

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
                        <CardTitle>Your Journey Overview</CardTitle>
                        <CardDescription>You've completed {completedStepsCount} of {applicationSteps.length} steps. Let's keep going!</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Progress value={progressPercentage} className="h-2" />
                            <span className="text-sm font-semibold text-muted-foreground">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="relative">
                            {applicationSteps.map((step, index) => {
                                const isCompleted = step.completed;
                                const isCurrent = index === currentStepIndex;

                                return (
                                <div key={step.name} className="flex items-start gap-4 pb-8">
                                    {/* Vertical line */}
                                    {index < applicationSteps.length - 1 && (
                                        <div className={cn(
                                            "absolute left-4 top-5 -ml-px h-full w-0.5",
                                            isCompleted ? "bg-primary" : "bg-border"
                                        )}></div>
                                    )}

                                    {/* Icon */}
                                    <div className={cn(
                                        "relative z-10 flex h-8 w-8 items-center justify-center rounded-full",
                                        isCompleted ? 'bg-primary' : isCurrent ? 'bg-primary/20 border-2 border-primary' : 'bg-muted',
                                        isCurrent && "animate-pulse"
                                    )}>
                                        {isCompleted ? (
                                            <Check className="h-5 w-5 text-primary-foreground" />
                                        ) : step.icon ? (
                                            <step.icon className={cn("h-4 w-4", isCurrent ? "text-primary" : "text-muted-foreground")} />
                                        ) : (
                                            <Circle className={cn(
                                                "h-3 w-3",
                                                isCurrent ? "text-primary fill-primary" : "text-muted-foreground fill-muted-foreground"
                                            )} />
                                        )}
                                    </div>
                                    
                                    {/* Step content */}
                                    <div className="flex-1 -mt-1.5">
                                         <div className="flex items-center justify-between">
                                            <p className={cn(
                                                "font-medium",
                                                isCompleted ? "text-foreground" : isCurrent ? "text-primary font-semibold" : "text-muted-foreground"
                                            )}>
                                                {step.name}
                                            </p>
                                            {step.href && (
                                                <Button asChild variant={isCurrent ? 'secondary' : 'ghost'} size="sm">
                                                    <Link href={step.href}>
                                                        {isCompleted ? 'Review' : 'Continue'} <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            )}
                                         </div>
                                        {isCurrent && <p className="text-sm text-muted-foreground mt-1">This is your next step.</p>}
                                    </div>
                                </div>
                            )})}
                        </div>
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
