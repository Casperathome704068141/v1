
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, Check, Circle, UserCheck, Send, FileText } from 'lucide-react';
import Link from 'next/link';
import { useApplication, documentList } from '@/context/application-context';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';

const applicationStepsConfig = [
    { id: 'personalInfo', name: 'Profile Information', icon: UserCheck },
    { id: 'academics', name: 'Academic & Work History', icon: FileText },
    { id: 'documents', name: 'Upload Documents', icon: FileText },
    { id: 'submission', name: 'Application Submission', icon: Send },
];


const isStepCompleted = (stepId: keyof ReturnType<typeof useApplication>['applicationData'] | 'submission', applicationData: any) => {
    // If application data or the specific step's data doesn't exist, it's not complete.
    if (!applicationData) return false;

    // Special case for submission
    if (stepId === 'submission') {
        return applicationData.status === 'submitted';
    }
    
    const data = applicationData[stepId as keyof typeof applicationData];
    if(!data) return false;

    // If data is an empty object, it's not complete.
    if (typeof data === 'object' && data !== null && Object.keys(data).length === 0) {
        return false;
    }

    switch (stepId) {
        case 'personalInfo':
            return !!data.surname && !!data.givenNames && !!data.dob && !!data.passportNumber;
        case 'academics':
            return (data.educationHistory?.length > 0) || (data.employmentHistory?.length > 0);
        case 'documents':
            const requiredDocs = documentList.filter(d => d.category === 'Core');
            return requiredDocs.every(doc => applicationData.documents?.[doc.id]?.files?.length > 0);
        default:
            return false;
    }
};

export function ApplicationProgress() {
    const { applicationData } = useApplication();

    const allSteps = applicationStepsConfig.map(step => ({
        ...step,
        completed: isStepCompleted(step.id as any, applicationData)
    }));
  
    const completedStepsCount = allSteps.filter(step => step.completed).length;
    const progressPercentage = (completedStepsCount / allSteps.length) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Application Journey</CardTitle>
                <CardDescription>Complete your profile to submit your application.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Progress value={progressPercentage} className="h-2" />
                        <span className="text-sm font-semibold text-muted-foreground">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="relative">
                        {allSteps.map((step, index) => {
                            const isCompleted = step.completed;
                            return (
                            <div key={step.name} className="flex items-start gap-4 pb-8 last:pb-0">
                                {index < allSteps.length - 1 && (
                                    <div className={cn(
                                        "absolute left-4 top-5 -ml-px h-full w-0.5",
                                        isCompleted ? "bg-primary" : "bg-border"
                                    )}></div>
                                )}

                                <div className={cn(
                                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full",
                                    isCompleted ? 'bg-primary' : 'bg-muted',
                                )}>
                                    {isCompleted ? (
                                        <Check className="h-5 w-5 text-primary-foreground" />
                                    ) : (
                                        <step.icon className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>
                                
                                <div className="flex-1 -mt-1.5">
                                    <p className={cn(
                                        "font-medium",
                                        isCompleted ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                        {step.name}
                                    </p>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>
            </CardContent>
             <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/application">
                        Go to Application <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

