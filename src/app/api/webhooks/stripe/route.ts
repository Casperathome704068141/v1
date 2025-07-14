
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = headers().get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.error(`❌ Error message: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('✅ PaymentIntent was successful!', paymentIntent.id);

        const { userId, planName } = paymentIntent.metadata;

        if (!userId || !planName) {
            console.error('❌ Missing metadata: userId or planName');
            // Still return 200 to Stripe to acknowledge receipt of the event
            return NextResponse.json({ received: true, message: 'Missing metadata' });
        }
        
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                plan: planName,
            });
            console.log(`✅ User ${userId} plan updated to ${planName}`);
        } catch (error) {
            console.error(`🔥 Failed to update user plan in Firestore:`, error);
            // If this fails, you might want to log it for manual intervention
             return NextResponse.json({ error: 'Failed to update user in database' }, { status: 500 });
        }

    } else {
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
