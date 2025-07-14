
'use client';

import { Suspense } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart } from 'lucide-react';
import { SignupsChart } from '@/components/admin/charts/signups-chart';
import { StatusChart } from '@/components/admin/charts/status-chart';
import { Skeleton } from '@/components/ui/skeleton';

function ChartSkeleton() {
    return <Skeleton className="h-[350px] w-full" />;
}

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Analytics</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" />
                        New Users (Last 7 Days)
                    </CardTitle>
                    <CardDescription>A breakdown of user sign-ups over the past week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<ChartSkeleton />}>
                        <SignupsChart />
                    </Suspense>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-primary" />
                        Application Status Distribution
                    </CardTitle>
                    <CardDescription>The current status of all submitted applications.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<ChartSkeleton />}>
                        <StatusChart />
                    </Suspense>
                </CardContent>
            </Card>
        </div>

      </main>
    </AdminLayout>
  );
}
