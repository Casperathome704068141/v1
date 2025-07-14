
'use server';

import Stripe from 'stripe';

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
    const origin = 'http://localhost:9002'; // In production, this should be dynamic from headers()

    const calculateOrderAmount = (items: CartItem[]) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0) * 100; // Total in cents
    };
    
    const amount = calculateOrderAmount(items);
    
    if (amount <= 0) {
        throw new Error("Invalid order amount.");
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'cad',
        automatic_payment_methods: {
            enabled: true,
        },
    });

    return { clientSecret: paymentIntent.client_secret, totalAmount: amount };
}
