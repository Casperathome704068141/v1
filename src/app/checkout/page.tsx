
'use client';

import { Suspense } from 'react';
import { AppLayout } from '@/components/app-layout';
import { CheckoutForm } from '@/components/checkout-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function CheckoutPageContent() {
  return (
    <main className="flex-1 space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Complete Your Purchase</h1>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Secure Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

function CheckoutSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
             <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
             <Skeleton className="h-12 w-full" />
        </div>
    )
}

export default function CheckoutPage() {
  return (
    <AppLayout>
      <CheckoutPageContent />
    </AppLayout>
  );
}
