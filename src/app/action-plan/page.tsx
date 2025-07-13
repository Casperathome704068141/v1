
'use client';

import { Suspense } from 'react';
import { AppLayout } from '@/components/app-layout';
import { ActionPlanDisplay } from '@/components/action-plan-display';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function ActionPlanPageContent() {
  return (
    <main className="flex-1 space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Your Personalized Action Plan</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Roadmap to a Stronger Application</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ActionPlanSkeleton />}>
            <ActionPlanDisplay />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

function ActionPlanSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    )
}

export default function ActionPlanPage() {
  return (
    <AppLayout>
      <ActionPlanPageContent />
    </AppLayout>
  );
}
