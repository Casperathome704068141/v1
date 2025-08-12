
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PersonalInfoForm } from '@/components/forms/personal-info-form';
import { AcademicsForm } from '@/components/forms/academics-form';
import { LanguageForm } from '@/components/forms/language-form';
import { FinancesForm } from '@/components/forms/finances-form';
import { StudyPlanForm } from '@/components/forms/study-plan-form';
import { FamilyForm } from '@/components/forms/family-form';
import { DocumentsForm } from '@/components/forms/documents-form';
import { BackgroundForm } from '@/components/forms/background-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { useApplication } from '@/context/application-context';
import { cn } from '@/lib/utils';
import { applicationStepsConfig, isStepCompleted } from '@/lib/application-steps-config';

const forms = {
  profile: PersonalInfoForm,
  academics: AcademicsForm,
  language: LanguageForm,
  finances: FinancesForm,
  plan: StudyPlanForm,
  family: FamilyForm,
  background: BackgroundForm,
  documents: DocumentsForm,
};

export default function ApplicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { applicationData } = useApplication();
  const currentStepId = searchParams.get('step') || 'profile';

  const steps = applicationStepsConfig.map(step => ({
    ...step,
    completed: isStepCompleted(step.id, applicationData)
  }));
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);
  const isLastStep = currentStepIndex === steps.length - 1;

  const goToStep = (stepId: string) => {
    router.push(`/application?step=${stepId}`);
  };

  const handleNext = () => {
    if (!isLastStep) {
      goToStep(steps[currentStepIndex + 1].id);
    } else {
      router.push('/application/review');
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      goToStep(steps[currentStepIndex - 1].id);
    }
  };

  const CurrentForm = forms[currentStepId as keyof typeof forms] || PersonalInfoForm;

  return (
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-display tracking-tight">Your Application</h1>
          <p className="text-slateMuted">Complete each step to build your profile for Canadian institutions.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <aside className="lg:col-span-1 lg:sticky lg:top-20 self-start">
                <nav className="space-y-1">
                    {steps.map((step, index) => {
                      const isCompleted = isStepCompleted(step.id, applicationData);
                      return (
                        <button
                          key={step.id}
                          onClick={() => goToStep(step.id)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors disabled:cursor-not-allowed',
                            currentStepId === step.id 
                              ? 'bg-blue text-white' 
                              : isCompleted
                              ? 'bg-surface2 text-white/80 hover:bg-surface2/80'
                              : 'text-slateMuted hover:bg-surface1',
                          )}
                          disabled={!isCompleted && index > currentStepIndex && !steps[index-1]?.completed}
                        >
                            {isCompleted ? <Check className="h-5 w-5 text-green" /> : <ChevronRight className="h-5 w-5" />}
                            <span>{step.name}</span>
                        </button>
                    )})}
                </nav>
            </aside>
            <div className="lg:col-span-3">
                <Card className="bg-surface1 border-white/10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStepId}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CurrentForm onSave={handleNext} />
                        </motion.div>
                    </AnimatePresence>
                    
                    <CardFooter className="flex justify-between border-t border-white/10 bg-surface2/50 px-6 py-4">
                        <Button variant="outline" onClick={handlePrevious} disabled={currentStepIndex === 0}>
                            Previous Step
                        </Button>
                        {isLastStep ? (
                            <Button onClick={() => router.push('/application/review')} className="bg-red hover:bg-red/90">Finish & Review</Button>
                        ) : (
                            <Button form={`form-${currentStepId}`} type="submit" className="bg-blue hover:bg-blue/90">
                                Save and Continue
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
      </main>
  );
}
