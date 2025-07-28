
'use client';

import { Suspense } from 'react';
import { AppLayout } from '@/components/app-layout';
import { CheckoutForm } from '@/components/checkout-form';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Lock } from 'lucide-react';

const OrderSummary = () => {
    const searchParams = useSearchParams();
    const cartString = searchParams.get('cart');
    
    const { items, total } = useMemo(() => {
        if (!cartString) return { items: [], total: 0 };
        try {
            const cart = JSON.parse(decodeURIComponent(cartString));
            const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            return { items: cart, total: totalAmount };
        } catch (e) {
            return { items: [], total: 0 };
        }
    }, [cartString]);

    if (!items.length) {
        return <Card><CardContent><p>Your cart is empty.</p></CardContent></Card>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{item.name}</p>
                             <Badge variant={item.type === 'plan' ? 'default' : 'secondary'} className="capitalize">{item.type}</Badge>
                        </div>
                        <p className="font-mono">${item.price.toFixed(2)}</p>
                    </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <p>Total (CAD)</p>
                    <p>${total.toFixed(2)}</p>
                </div>
            </CardContent>
        </Card>
    );
}


function CheckoutPageContent() {
  return (
    <main className="flex-1 space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground mt-1">Complete your secure payment to activate your new plan.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
            <OrderSummary />
             <Card>
                <CardContent className="p-4 flex items-center gap-3">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <h3 className="font-semibold">Secure Payment</h3>
                        <p className="text-sm text-muted-foreground">Your payment information is encrypted and processed securely by Stripe.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>Enter your payment information below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                        <CheckoutForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <AppLayout>
      <Suspense fallback={<Skeleton className="h-screen w-screen" />}>
         <CheckoutPageContent />
      </Suspense>
    </AppLayout>
  );
}
