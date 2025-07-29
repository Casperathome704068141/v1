
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, Check, Circle, UserCheck, Send, FileText, Loader } from 'lucide-react';
import Link from 'next/link';
import { useApplication, documentList } from '@/context/application-context';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { motion } from 'framer-motion';

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
        <Card className="bg-gradient-to-br from-card to-card-foreground/5 transition-shadow hover:shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl font-black tracking-tight">Your Application Progress</CardTitle>
                <CardDescription className="text-lg">Complete your profile to submit your application.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-full">
                            <Progress value={progressPercentage} className="h-3" />
                            <p className="text-sm text-muted-foreground mt-2 text-right">{Math.round(progressPercentage)}% Complete</p>
                        </div>
                    </div>
                    <div className="relative">
                        {allSteps.map((step, index) => {
                            const isCompleted = step.completed;
                            const isActive = !isCompleted && (index === 0 || allSteps[index - 1].completed);

                            return (
                            <motion.div 
                                key={step.name} 
                                className="flex items-start gap-4 pb-8 last:pb-0"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {index < allSteps.length - 1 && (
                                    <div className={cn(
                                        "absolute left-4 top-5 -ml-px h-full w-0.5 transition-colors duration-500",
                                        isCompleted ? "bg-primary" : "bg-border"
                                    )}></div>
                                )}

                                <div className={cn(
                                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
                                    isCompleted ? 'bg-success shadow-lg shadow-success/30' : isActive ? 'bg-primary ring-4 ring-primary/20' : 'bg-muted',
                                )}>
                                    {isCompleted ? (
                                        <Check className="h-5 w-5 text-success-foreground" />
                                    ) : isActive ? (
                                        <Loader className="h-4 w-4 text-primary-foreground animate-spin" />
                                    ) : (
                                        <step.icon className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>
                                
                                <div className="flex-1 -mt-1.5">
                                    <p className={cn(
                                        "font-medium text-lg",
                                        isCompleted ? "text-success" : isActive ? "text-foreground font-bold" : "text-muted-foreground"
                                    )}>
                                        {step.name}
                                    </p>
                                </div>
                            </motion.div>
                        )})}
                    </div>
                </div>
            </CardContent>
             <CardFooter>
                <Button asChild className="w-full text-lg py-6 bg-electric-violet hover:bg-electric-violet/90">
                    <Link href="/application">
                        {progressPercentage === 100 ? 'Review Application' : 'Continue Application'} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
