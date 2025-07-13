
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, School, BookOpen, Banknote, Briefcase, FileText } from 'lucide-react';

const steps = [
  { id: 'profile', name: 'Personal Info', icon: User },
  { id: 'academics', name: 'Academics', icon: School },
  { id: 'language', name: 'Language', icon: BookOpen },
  { id: 'finances', name: 'Finances', icon: Banknote },
  { id: 'plan', name: 'Study Plan', icon: Briefcase },
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            {steps.map(step => (
                <TabsTrigger key={step.id} value={step.id}>
                    <step.icon className="mr-2 h-4 w-4" />
                    {step.name}
                </TabsTrigger>
            ))}
          </TabsList>

          <Card className="mt-6">
            <TabsContent value="profile">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Please provide your personal details exactly as they appear on your passport.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Personal info form will go here.</p>
              </CardContent>
            </TabsContent>

            <TabsContent value="academics">
              <CardHeader>
                <CardTitle>Academic & Work History</CardTitle>
                <CardDescription>Provide your education and employment history for the last 10 years.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Academic & work history form will go here.</p>
              </CardContent>
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

            <TabsContent value="documents">
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>Upload the required documents for your application.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Document uploader will go here.</p>
              </CardContent>
            </TabsContent>

             <CardFooter className="flex justify-between">
                <Button variant="outline">Previous</Button>
                <Button>Next</Button>
            </CardFooter>
          </Card>
        </Tabs>
      </main>
    </AppLayout>
  );
}
