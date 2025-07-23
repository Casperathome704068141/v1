
'use client';

import { Check, Circle, FileText, Send, Fingerprint, Stethoscope, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const journeySteps = [
    { id: 'Pending Review', name: 'Application Submitted', icon: Send },
    { id: 'Awaiting LOA', name: 'Awaiting LOA', icon: FileText },
    { id: 'Application Submitted to IRCC', name: 'Submitted to IRCC', icon: Send },
    { id: 'Awaiting Biometrics', name: 'Awaiting Biometrics', icon: Fingerprint },
    { id: 'Awaiting Medical', name: 'Awaiting Medical', icon: Stethoscope },
    { id: 'Passport Request', name: 'Passport Request (PPR)', icon: CheckCircle },
    { id: 'Approved', name: 'Visa Approved', icon: CheckCircle },
];

export function UserApplicationProgress({ currentStatus }: { currentStatus: string }) {

  const currentStepIndex = journeySteps.findIndex(step => step.id === currentStatus);

  const allSteps = journeySteps.map((step, index) => {
    const isCompleted = currentStepIndex >= index;
    const isActive = currentStepIndex === index;
    return { ...step, isCompleted, isActive };
  });

  return (
    <div className="relative">
        {allSteps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4 pb-8 last:pb-0">
                {index < allSteps.length - 1 && (
                    <div className={cn(
                        "absolute left-4 top-5 -ml-px h-full w-0.5",
                        step.isCompleted ? "bg-primary" : "bg-border"
                    )}></div>
                )}

                <div className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                    step.isCompleted ? 'bg-primary' : 'bg-muted border',
                )}>
                    {step.isActive && <div className="absolute h-8 w-8 rounded-full bg-primary/30 animate-ping" />}
                    {step.isCompleted ? (
                        <Check className="h-5 w-5 text-primary-foreground" />
                    ) : (
                        <step.icon className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
                
                <div className="flex-1 -mt-1.5">
                    <p className={cn(
                        "font-medium transition-colors",
                        step.isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}>
                        {step.name}
                    </p>
                </div>
            </div>
        ))}
    </div>
  );
}
