
'use client';

import { Suspense } from 'react';
import { AppLayout } from '@/components/app-layout';
import { ActionPlanDisplay } from '@/components/action-plan-display';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Zap } from 'lucide-react';

function ActionPlanPageContent() {
  return (
    <main className="flex-1 space-y-8 p-4 md:p-8">
      <div className="text-center">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <Lightbulb className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter">Your Personalized Action Plan</h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-2">
            Powered by AI, this roadmap is designed to strengthen your application.
        </p>
      </div>
      <Card className="max-w-4xl mx-auto border-border/50 shadow-xl">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold"><Zap className="h-6 w-6 text-primary"/>Your Roadmap to a Stronger Application</CardTitle>
          <CardDescription>Follow these steps to improve your chances of success.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
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
            <div className="space-y-3">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
             <div className="space-y-3">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
             <div className="space-y-3">
                <Skeleton className="h-8 w-1/2" />
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
