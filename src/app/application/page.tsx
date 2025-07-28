
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
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

const steps = [
  { id: 'profile', name: 'Personal Info', form: PersonalInfoForm },
  { id: 'academics', name: 'Academics', form: AcademicsForm },
  { id: 'language', name: 'Language', form: LanguageForm },
  { id: 'finances', name: 'Finances', form: FinancesForm },
  { id: 'plan', name: 'Study Plan', form: StudyPlanForm },
  { id: 'family', name: 'Family', form: FamilyForm },
  { id: 'background', name: 'Background', form: BackgroundForm },
  { id: 'documents', name: 'Documents', form: DocumentsForm },
];

function ApplicationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStepId = searchParams.get('step') || 'profile';

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

  const CurrentForm = steps[currentStepIndex].form;

  return (
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Application</h1>
          <p className="text-muted-foreground">Complete each step to build your profile for Canadian institutions.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <aside className="lg:col-span-1">
                <nav className="space-y-1">
                    {steps.map((step, index) => (
                        <button 
                          key={step.id} 
                          onClick={() => goToStep(step.id)}
                          disabled={index > currentStepIndex}
                          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                              currentStepId === step.id 
                                ? 'bg-primary text-primary-foreground' 
                                : index < currentStepIndex 
                                ? 'bg-secondary text-secondary-foreground hover:bg-muted'
                                : 'text-muted-foreground'
                          }`}
                        >
                            {index < currentStepIndex ? <Check className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                            <span>{step.name}</span>
                        </button>
                    ))}
                </nav>
            </aside>
            <div className="lg:col-span-3">
                <Card>
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
                    
                    <CardFooter className="flex justify-between border-t bg-card-footer px-6 py-4">
                        <Button variant="outline" onClick={handlePrevious} disabled={currentStepIndex === 0}>
                            Previous Step
                        </Button>
                        {isLastStep ? (
                            <Button onClick={() => router.push('/application/review')}>Finish & Review</Button>
                        ) : (
                            <Button form={`form-${currentStepId}`} type="submit">
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

export default function ApplicationPage() {
  return (
    <AppLayout>
        <ApplicationPageContent />
    </AppLayout>
  )
}
