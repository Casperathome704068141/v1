
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { getStripePublishableKey, createPaymentIntent } from '@/app/checkout/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

type CartItem = {
    name: string;
    price: number;
    quantity: number;
}

// Stripe Promise must be created outside of a component's render to avoid recreating it on every render.
const stripePromise = getStripePublishableKey().then(key => {
    if (!key) {
        console.error("Stripe publishable key is not available.");
        return null;
    }
    return loadStripe(key);
});


const Form = ({ clientSecret, cartItems }: { clientSecret: string; cartItems: CartItem[] }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?payment_success=true`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      toast({ variant: 'destructive', title: 'Payment Failed', description: error.message });
    } else {
      toast({ variant: 'destructive', title: 'An unexpected error occurred.', description: 'Please try again.' });
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
        <div>
            <h3 className="text-lg font-medium">Order Summary</h3>
            <Separator className="my-2" />
            <div className="space-y-2">
                {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-mono">${item.price.toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="font-mono">${totalAmount.toFixed(2)} CAD</span>
            </div>
        </div>

        <PaymentElement id="payment-element" />
        <Button disabled={isLoading || !stripe || !elements} id="submit" className="w-full" size="lg">
            <span id="button-text">
            {isLoading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
            </span>
        </Button>
    </form>
  )
};

export const CheckoutForm = () => {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [clientSecret, setClientSecret] = useState('');
    
    const cartItems: CartItem[] = useMemo(() => {
        const cartQuery = searchParams.get('cart');
        if (!cartQuery) return [];
        try {
            return JSON.parse(decodeURIComponent(cartQuery));
        } catch (e) {
            console.error("Failed to parse cart items:", e);
            return [];
        }
    }, [searchParams]);

    useEffect(() => {
        if (cartItems.length > 0) {
            createPaymentIntent(cartItems)
                .then(data => {
                    setClientSecret(data.clientSecret);
                })
                .catch(error => {
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: 'Could not initialize payment. Please try again.',
                    });
                    console.error("Error creating PaymentIntent:", error);
                });
        }
    }, [cartItems, toast]);

    if (!clientSecret || !stripePromise) {
        return <div className="text-center">Loading payment form...</div>;
    }
    
    const options = { clientSecret };

    return (
        <Elements options={options} stripe={stripePromise}>
            <Form clientSecret={clientSecret} cartItems={cartItems} />
        </Elements>
    );
};
