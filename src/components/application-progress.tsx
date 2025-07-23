
'use client';

import { Progress } from '@/components/ui/progress';
import { UserCheck, FileText, Send, CheckCircle, Circle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApplication, documentList } from '@/context/application-context';

const applicationStepsConfig = [
    { id: 'personalInfo', name: 'Profile Information', icon: UserCheck },
    { id: 'academics', name: 'Academic & Work History', icon: FileText },
    { id: 'language', name: 'Language Proficiency', icon: FileText },
    { id: 'finances', name: 'Financial Details', icon: FileText },
    { id: 'studyPlan', name: 'Study Plan', icon: FileText },
    { id: 'family', name: 'Family Information', icon: FileText },
    { id: 'background', name: 'Background & Security', icon: FileText },
    { id: 'documents', name: 'Upload Documents', icon: FileText },
    { id: 'submission', name: 'Application Submission', icon: Send },
];

const isStepCompleted = (stepId: keyof ReturnType<typeof useApplication>['applicationData'], applicationData: ReturnType<typeof useApplication>['applicationData']) => {
    // If application data or the specific step's data doesn't exist, it's not complete.
    if (!applicationData || !applicationData[stepId]) return false;
    
    const data = applicationData[stepId];

    // If data is an empty object, it's not complete.
    if (typeof data === 'object' && data !== null && Object.keys(data).length === 0) {
        return false;
    }

    switch (stepId) {
        case 'personalInfo':
            return !!data.surname && !!data.givenNames && !!data.dob && !!data.passportNumber;
        case 'academics':
            return (data.educationHistory?.length > 0) || (data.employmentHistory?.length > 0);
        case 'language':
            return data.testTaken !== 'none' ? !!data.overallScore : !!data.testPlanning;
        case 'finances':
            return !!data.totalFunds && data.fundingSources?.length > 0 && data.proofType?.length > 0;
        case 'studyPlan':
            return !!data.whyInstitution && !!data.howProgramFitsCareer;
        case 'family':
            return !!data.parent1Name;
        case 'background':
            return data.certification === true;
        case 'documents':
            const requiredDocs = documentList.filter(d => d.category === 'Core');
            return requiredDocs.every(doc => applicationData.documents?.[doc.id]?.files?.length > 0);
        case 'submission':
            return false; // This is a placeholder for the final step.
        default:
            return false;
    }
};

export function ApplicationProgress() {
  const { applicationData } = useApplication();

  const allSteps = applicationStepsConfig.map(step => ({
      ...step,
      completed: step.id ? isStepCompleted(step.id as any, applicationData) : (applicationData.status === 'submitted')
  }));

  const completedStepsCount = allSteps.filter(step => step.completed).length;
  const progressPercentage = (completedStepsCount / allSteps.length) * 100;

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Progress value={progressPercentage} className="h-2" />
            <span className="text-sm font-semibold text-muted-foreground">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="relative">
            {allSteps.map((step, index) => {
                const isCompleted = step.completed;
                return (
                <div key={step.name} className="flex items-start gap-4 pb-6 last:pb-0">
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
  );
}
