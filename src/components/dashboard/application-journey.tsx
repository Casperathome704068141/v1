
'use client';

import { cn } from '@/lib/utils';
import { Check, Circle, Loader, Milestone, X } from 'lucide-react';

const journeySteps = [
    { key: 'Pending Review', label: 'Application Submitted' },
    { key: 'Awaiting LOA', label: 'Awaiting LOA' },
    { key: 'Application Submitted to IRCC', label: 'Submitted to IRCC' },
    { key: 'Awaiting Biometrics', label: 'Awaiting Biometrics' },
    { key: 'Passport Request', label: 'Passport Request (PPR)' },
    { key: 'Approved', label: 'Approved!' },
];

export function ApplicationJourney({ currentStatus, statusHistory }: { currentStatus: string, statusHistory: any[] }) {
    const currentStepIndex = journeySteps.findIndex(step => step.key === currentStatus);
    const isRejected = currentStatus === 'Rejected' || currentStatus === 'Action Required';

    if (isRejected) {
        return (
            <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-destructive text-destructive-foreground mx-auto mb-2">
                    <X className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-destructive text-lg">Action Required</h3>
                <p className="text-sm text-destructive/80">{statusHistory[0]?.notes || 'Please check your email or contact support for more information.'}</p>
            </div>
        )
    }

    return (
        <div className="relative">
            {journeySteps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isActive = index === currentStepIndex;

                return (
                    <div key={step.key} className="flex items-start gap-4 pb-8 last:pb-0">
                        {index < journeySteps.length - 1 && (
                            <div className={cn(
                                "absolute left-4 top-5 -ml-px mt-1 h-full w-0.5",
                                isCompleted ? "bg-primary" : "bg-border"
                            )}></div>
                        )}

                        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background">
                             <div className={cn(
                                "flex h-full w-full items-center justify-center rounded-full transition-all duration-300",
                                isCompleted ? 'bg-success shadow-lg shadow-success/30' : isActive ? 'bg-primary ring-4 ring-primary/20' : 'bg-muted',
                            )}>
                                {isCompleted ? (
                                    <Check className="h-5 w-5 text-success-foreground" />
                                ) : isActive ? (
                                    <Loader className="h-4 w-4 text-primary-foreground animate-spin" />
                                ) : (
                                    <Circle className="h-4 w-4 text-muted-foreground" />
                                )}
                            </div>
                        </div>

                        <div className="flex-1 -mt-1.5">
                            <p className={cn(
                                "font-medium text-lg",
                                isCompleted ? "text-success" : isActive ? "text-foreground font-bold" : "text-muted-foreground"
                            )}>
                                {step.label}
                            </p>
                            {isActive && statusHistory[0]?.notes && (
                                <p className="text-sm text-muted-foreground mt-1">{statusHistory[0].notes}</p>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
