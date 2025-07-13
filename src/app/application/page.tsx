
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, School, BookOpen, Banknote, Briefcase, FileText, Users, ShieldCheck } from 'lucide-react';
import { PersonalInfoForm } from '@/components/forms/personal-info-form';
import { AcademicsForm } from '@/components/forms/academics-form';

const steps = [
  { id: 'profile', name: 'Personal Info', icon: User },
  { id: 'academics', name: 'Academics', icon: School },
  { id: 'language', name: 'Language', icon: BookOpen },
  { id: 'finances', name: 'Finances', icon: Banknote },
  { id: 'plan', name: 'Study Plan', icon: Briefcase },
  { id: 'family', name: 'Family', icon: Users },
  { id: 'background', name: 'Background', icon: ShieldCheck },
  { id: 'documents', name: 'Documents', icon: FileText },
];

export default function ApplicationPage({
  searchParams,
}: {
  searchParams: { step: string };
}) {
  const currentStep = searchParams.step || 'profile';

  return (
    <AppLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Your Application</h1>
        </div>
        
        <Tabs defaultValue={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
            {steps.map(step => (
                <TabsTrigger key={step.id} value={step.id}>
                    <step.icon className="mr-2 h-4 w-4" />
                    {step.name}
                </TabsTrigger>
            ))}
          </TabsList>

          <Card className="mt-6">
            <TabsContent value="profile">
                <PersonalInfoForm />
            </TabsContent>

            <TabsContent value="academics">
              <AcademicsForm />
            </TabsContent>

            <TabsContent value="language">
              <CardHeader>
                <CardTitle>Language Proficiency</CardTitle>
                <CardDescription>Enter your language test scores.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Language proficiency form will go here.</p>
              </CardContent>
            </TabsContent>

            <TabsContent value="finances">
              <CardHeader>
                <CardTitle>Financial Details</CardTitle>
                <CardDescription>Provide details about how you will fund your studies.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Financial details form will go here.</p>
              </CardContent>
            </TabsContent>

            <TabsContent value="plan">
              <CardHeader>
                <CardTitle>Study Plan</CardTitle>
                <CardDescription>Tell us about your study and career goals.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Study plan form will go here.</p>
              </CardContent>
            </TabsContent>

            <TabsContent value="family">
              <CardHeader>
                <CardTitle>Family Information</CardTitle>
                <CardDescription>Provide details about your immediate family members for IRCC forms.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Family information form will go here.</p>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="background">
              <CardHeader>
                <CardTitle>Background & Security</CardTitle>
                <CardDescription>Answer standard IRCC background questions.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Background and security form will go here.</p>
              </CardContent>
            </TabsContent>

            <TabsContent value="documents">
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>Upload the required documents for your application.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Document uploader will go here.</p>
              </CardContent>
            </TabsContent>

             <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline">Previous</Button>
                <Button>Save and Continue</Button>
            </CardFooter>
          </Card>
        </Tabs>
      </main>
    </AppLayout>
  );
}
