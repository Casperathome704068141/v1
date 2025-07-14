
'use server';

import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CartItem = {
    name: string;
    price: number;
    quantity: number;
}

export async function createCheckoutSession(items: CartItem[]) {
    const origin = headers().get('origin') || 'http://localhost:3000';

    const line_items = items.map(item => ({
        price_data: {
            currency: 'cad',
            product_data: {
                name: item.name,
            },
            unit_amount: item.price * 100, // Price in cents
        },
        quantity: item.quantity,
    }));
    
    const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`, // Redirect to dashboard on success
        cancel_url: `${origin}/pricing`, // Return to pricing on cancellation
    });

    return { sessionId: session.id };
}
