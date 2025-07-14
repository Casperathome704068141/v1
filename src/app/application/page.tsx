
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, School, BookOpen, Banknote, Briefcase, FileText, Users, ShieldCheck } from 'lucide-react';
import { PersonalInfoForm } from '@/components/forms/personal-info-form';
import { AcademicsForm } from '@/components/forms/academics-form';
import { LanguageForm } from '@/components/forms/language-form';
import { FinancesForm } from '@/components/forms/finances-form';
import { StudyPlanForm } from '@/components/forms/study-plan-form';
import { FamilyForm } from '@/components/forms/family-form';
import { DocumentsForm } from '@/components/forms/documents-form';
import { BackgroundForm } from '@/components/forms/background-form';

const steps = [
  { id: 'profile', name: 'Personal Info', icon: User, formId: 'form-profile' },
  { id: 'academics', name: 'Academics', icon: School, formId: 'form-academics' },
  { id: 'language', name: 'Language', icon: BookOpen, formId: 'form-language' },
  { id: 'finances', name: 'Finances', icon: Banknote, formId: 'form-finances' },
  { id: 'plan', name: 'Study Plan', icon: Briefcase, formId: 'form-plan' },
  { id: 'family', name: 'Family', icon: Users, formId: 'form-family' },
  { id: 'background', name: 'Background', icon: ShieldCheck, formId: 'form-background' },
  { id: 'documents', name: 'Documents', icon: FileText, formId: 'form-documents' },
];

function ApplicationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStepId = searchParams.get('step') || 'profile';

  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      const nextStep = steps[currentStepIndex + 1];
      router.push(`/application?step=${nextStep.id}`);
    } else {
      // On last step, the button's onClick will handle navigation
      router.push('/application/review');
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      router.push(`/application?step=${prevStep.id}`);
    }
  };

  const handleTabChange = (value: string) => {
    router.push(`/application?step=${value}`);
  };

  const handleFinishAndReview = () => {
    router.push('/application/review');
  }

  const isFirstStep = currentStepIndex === 0;

  return (
      <main className="flex-1 space-y-4 p-4 md:space-y-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-2xl md:text-3xl font-bold">Your Application</h1>
        </div>
        
        <div className="w-full">
          <Tabs value={currentStepId} onValueChange={handleTabChange} className="w-full">
            <div className="w-full overflow-x-auto pb-2">
                <TabsList className="grid w-max grid-cols-8">
                  {steps.map(step => (
                      <TabsTrigger key={step.id} value={step.id} className="flex-nowrap whitespace-nowrap px-3">
                          <step.icon className="mr-2 h-4 w-4 shrink-0" />
                          {step.name}
                      </TabsTrigger>
                  ))}
                </TabsList>
            </div>

            <Card className="mt-4 md:mt-6">
              <TabsContent value="profile" forceMount={true} hidden={currentStepId !== 'profile'}>
                  <PersonalInfoForm onSave={handleNext} />
              </TabsContent>

              <TabsContent value="academics" forceMount={true} hidden={currentStepId !== 'academics'}>
                <AcademicsForm onSave={handleNext} />
              </TabsContent>

              <TabsContent value="language" forceMount={true} hidden={currentStepId !== 'language'}>
                <LanguageForm onSave={handleNext} />
              </TabsContent>

              <TabsContent value="finances" forceMount={true} hidden={currentStepId !== 'finances'}>
                <FinancesForm onSave={handleNext} />
              </TabsContent>

              <TabsContent value="plan" forceMount={true} hidden={currentStepId !== 'plan'}>
                <StudyPlanForm onSave={handleNext} />
              </TabsContent>

              <TabsContent value="family" forceMount={true} hidden={currentStepId !== 'family'}>
                <FamilyForm onSave={handleNext} />
              </TabsContent>
              
              <TabsContent value="background" forceMount={true} hidden={currentStepId !== 'background'}>
                <BackgroundForm onSave={handleNext} />
              </TabsContent>

              <TabsContent value="documents" forceMount={true} hidden={currentStepId !== 'documents'}>
                <DocumentsForm />
              </TabsContent>

               <CardFooter className="flex justify-between border-t px-4 py-4 md:px-6 md:py-4">
                  <Button variant="outline" onClick={handlePrevious} disabled={isFirstStep}>Previous</Button>
                   {isLastStep ? (
                      <Button onClick={handleFinishAndReview}>Finish & Review</Button>
                  ) : (
                      <Button form={steps[currentStepIndex]?.formId} type="submit">Save and Continue</Button>
                  )}
              </CardFooter>
            </Card>
          </Tabs>
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
