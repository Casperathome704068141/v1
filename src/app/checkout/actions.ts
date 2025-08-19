
'use server';

import Stripe from 'stripe';
import { auth } from '@/lib/firebase';

type CartItem = {
    name: string;
    price: number;
    quantity: number;
}

export async function getStripePublishableKey() {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
        throw new Error('Stripe publishable key not found.');
    }
    return key;
}

export async function createPaymentIntent({items, userId}: {items: CartItem[], userId: string}) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    if (!userId) {
        throw new Error('User not authenticated.');
    }

    const calculateOrderAmount = (items: CartItem[]) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0) * 100; // Total in cents
    };
    
    const amount = calculateOrderAmount(items);
    
    if (amount <= 0) {
        throw new Error("Invalid order amount.");
    }
    
    // Find the primary plan from the cart items
    const primaryPlan = items.find(item => !item.name.toLowerCase().includes("addon"));

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'cad',
        automatic_payment_methods: {
            enabled: true,
        },
        metadata: {
            userId: userId,
            planName: primaryPlan?.name || 'Custom Plan',
        }
    });

    if (!paymentIntent.client_secret) {
        throw new Error('Failed to create PaymentIntent.');
    }

    return { clientSecret: paymentIntent.client_secret };
}
