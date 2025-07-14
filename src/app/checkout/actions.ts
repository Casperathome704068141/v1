
'use server';

import Stripe from 'stripe';
import { auth } from '@/lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CartItem = {
    name: string;
    price: number;
    quantity: number;
}

export async function getStripePublishableKey() {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
}

export async function createPaymentIntent(items: CartItem[]) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated.');
    }

    const calculateOrderAmount = (items: CartItem[]) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0) * 100; // Total in cents
    };
    
    const amount = calculateOrderAmount(items);
    
    if (amount <= 0) {
        throw new Error("Invalid order amount.");
    }
    
    // Find the primary plan from the cart items (assuming it doesn't have "addon" in the id)
    const primaryPlan = items.find(item => !item.name.toLowerCase().includes("addon"));

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'cad',
        automatic_payment_methods: {
            enabled: true,
        },
        metadata: {
            userId: user.uid,
            planName: primaryPlan?.name || 'Custom Plan',
        }
    });

    return { clientSecret: paymentIntent.client_secret, totalAmount: amount };
}
