'use client';

import { Suspense } from 'react';
import { AppLayout } from '@/components/app-layout';
import { SelectProgramForm } from '@/components/forms/select-program-form';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function SelectProgramPageContent() {
  return (
    <main className="flex-1 space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Select Your Program</h1>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Confirm Your Choice</CardTitle>
          <CardDescription>
            You've selected a college. Now, please enter the specific program you intend to apply for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ProgramFormSkeleton />}>
            <SelectProgramForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

function ProgramFormSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-full" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-full" />
            </div>
             <Skeleton className="h-12 w-full" />
        </div>
    )
}


export default function SelectProgramPage() {
  return (
    <AppLayout>
      <SelectProgramPageContent />
    </AppLayout>
  );
}