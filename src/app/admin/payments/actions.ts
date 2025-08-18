
'use server';

import Stripe from 'stripe';
import { admin } from '@/lib/firebaseAdmin';

// This function should be protected by an admin check on the calling page/route.
// A more robust solution would use a middleware or higher-order function to verify admin claims.

export type Payment = {
    id: string;
    amount: string;
    date: string;
    status: string;
    planName: string;
    customerEmail: string;
    customerName: string;
    userId: string;
};

export async function getPayments(): Promise<Payment[]> {
    // FIX: Instantiate Stripe inside the function to ensure it only runs on the server.
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    try {
        const paymentIntents = await stripe.paymentIntents.list({
            limit: 100, // Fetch up to 100 recent payments
            expand: ['data.customer'],
        });

        const successfulPayments = paymentIntents.data.filter(pi => pi.status === 'succeeded');
        
        const payments: Payment[] = successfulPayments.map(pi => {
            const customer = pi.customer as Stripe.Customer | null;
            return {
                id: pi.id,
                amount: `$${(pi.amount / 100).toFixed(2)} CAD`,
                date: new Date(pi.created * 1000).toLocaleDateString(),
                status: pi.status,
                planName: pi.metadata.planName || 'N/A',
                customerEmail: customer?.email || 'N/A',
                customerName: customer?.name || 'N/A',
                userId: pi.metadata.userId || 'N/A',
            }
        });

        return payments;
    } catch (error) {
        console.error("Stripe API error:", error);
        throw new Error("Could not fetch payments from Stripe.");
    }
}
