
import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminDashboardContent } from '@/components/admin/admin-dashboard-content';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function AdminDashboardSkeleton() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 animate-pulse">
            <div className="flex items-center space-x-4">
                <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-80" />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Skeleton className="h-96" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="h-80" />
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    return (
        <AdminLayout>
            <Suspense fallback={<AdminDashboardSkeleton />}>
                <AdminDashboardContent />
            </Suspense>
        </AdminLayout>
    );
}
