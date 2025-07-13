
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, School, BookOpen, Banknote, Briefcase, FileText, Users, ShieldCheck } from 'lucide-react';
import { PersonalInfoForm } from '@/components/forms/personal-info-form';
import { AcademicsForm } from '@/components/forms/academics-form';
import { LanguageForm } from '@/components/forms/language-form';
import { FinancesForm } from '@/components/forms/finances-form';
import { StudyPlanForm } from '@/components/forms/study-plan-form';
import { FamilyForm } from '@/components/forms/family-form';
import { DocumentsForm } from '@/components/forms/documents-form';
import { BackgroundForm } from '@/components/forms/background-form';
import { ApplicationProvider } from '@/context/application-context';

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

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      router.push(`/application?step=${nextStep.id}`);
    } else {
      // Handle final submission
      console.log('Application finished!');
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

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Your Application</h1>
        </div>
        
        <Tabs value={currentStepId} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
            {steps.map(step => (
                <TabsTrigger key={step.id} value={step.id}>
                    <step.icon className="mr-2 h-4 w-4" />
                    {step.name}
                </TabsTrigger>
            ))}
          </TabsList>

          <Card className="mt-6">
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

             <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handlePrevious} disabled={isFirstStep}>Previous</Button>
                <Button form={steps[currentStepIndex]?.formId} type="submit">
                  {isLastStep ? 'Finish & Review' : 'Save and Continue'}
                </Button>
            </CardFooter>
          </Card>
        </Tabs>
      </main>
  );
}


export default function ApplicationPage() {
  return (
    <AppLayout>
      <ApplicationProvider>
        <ApplicationPageContent />
      </ApplicationProvider>
    </AppLayout>
  )
}
