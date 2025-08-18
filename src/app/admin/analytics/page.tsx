
'use client';

import { Suspense } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart as BarChartIcon, PieChart as PieChartIcon, TrendingUp, CheckCircle, Hourglass, XCircle, FileWarning } from 'lucide-react';
import { SignupsChart } from '@/components/admin/charts/signups-chart';
import { StatusChart } from '@/components/admin/charts/status-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const ChartSkeleton = () => (
    <div className="h-[350px] w-full flex items-center justify-center">
        <Skeleton className="h-full w-full" />
    </div>
);

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Data Analytics</h1>
            <p className="text-muted-foreground">Visualize key metrics and trends for your platform.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ delay: 0.1 }}>
                <Card className="transition-shadow duration-300 hover:shadow-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl font-headline">
                            <TrendingUp className="h-6 w-6 text-primary" />
                            <span>User Sign-up Trends</span>
                        </CardTitle>
                        <CardDescription>Tracks the number of new user registrations over the last 7 days to monitor growth.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<ChartSkeleton />}>
                            <SignupsChart />
                        </Suspense>
                    </CardContent>
                </Card>
            </motion.div>
            <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ delay: 0.2 }}>
                <Card className="transition-shadow duration-300 hover:shadow-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl font-headline">
                            <PieChartIcon className="h-6 w-6 text-primary" />
                            <span>Application Status Overview</span>
                        </CardTitle>
                        <CardDescription>A real-time distribution of all application statuses, providing insight into the processing pipeline.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Suspense fallback={<ChartSkeleton />}>
                            <StatusChart />
                        </Suspense>
                    </CardContent>
                </Card>
            </motion.div>
        </div>

        <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ delay: 0.3 }}>
            <Card>
                <CardHeader>
                    <CardTitle>Status Legend</CardTitle>
                    <CardDescription>Guide to understanding the application status categories in the chart.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-success/10 rounded-full"><CheckCircle className="h-5 w-5 text-success" /></div>
                        <div>
                            <p className="font-medium">Approved</p>
                            <p className="text-muted-foreground text-xs">Application successful</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-400/10 rounded-full"><Hourglass className="h-5 w-5 text-yellow-500" /></div>
                        <div>
                            <p className="font-medium">Pending Review</p>
                            <p className="text-muted-foreground text-xs">Awaiting admin action</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                         <div className="p-2 bg-destructive/10 rounded-full"><XCircle className="h-5 w-5 text-destructive" /></div>
                        <div>
                            <p className="font-medium">Rejected</p>
                            <p className="text-muted-foreground text-xs">Application denied</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-orange-400/10 rounded-full"><FileWarning className="h-5 w-5 text-orange-500" /></div>
                        <div>
                            <p className="font-medium">Action Required</p>
                            <p className="text-muted-foreground text-xs">Needs user input</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

      </main>
    </AdminLayout>
  );
}
