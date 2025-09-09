
'use client';

import { Progress } from '@/components/ui/progress';
import { Send, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApplication } from '@/context/application-context';
import { applicationStepsConfig, isStepCompleted } from '@/lib/application-steps-config';

export function ApplicationProgress() {
  const { applicationData } = useApplication();

  const allSteps = applicationStepsConfig.map(step => ({
      ...step,
      completed: isStepCompleted(step.id, applicationData)
  }));

  const completedStepsCount = allSteps.filter(step => step.completed).length;
  const progressPercentage = (completedStepsCount / allSteps.length) * 100;
  const isSubmitted = applicationData.status === 'submitted';

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
             <div className="flex items-start gap-4 pb-6 last:pb-0">
                <div className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full",
                    isSubmitted ? 'bg-primary' : 'bg-muted',
                )}>
                    {isSubmitted ? (
                        <Check className="h-5 w-5 text-primary-foreground" />
                    ) : (
                        <Send className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
                <div className="flex-1 -mt-1.5">
                    <p className={cn(
                        "font-medium",
                        isSubmitted ? "text-foreground" : "text-muted-foreground"
                    )}>
                        Application Submission
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}
