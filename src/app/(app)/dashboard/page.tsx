
import { Suspense } from 'react';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardSkeleton() {
    return (
        <main className="flex-1 space-y-8 p-4 md:p-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
            </div>
             <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Skeleton className="h-96 w-full" />
                </div>
                <div className="space-y-8 md:col-span-1">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        </main>
    );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
