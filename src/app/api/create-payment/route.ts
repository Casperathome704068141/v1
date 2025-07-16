
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/lib/firebaseAdmin'; // Using Admin SDK for backend verification

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface RequestBody {
    amount: number;
    planName: string;
}

export async function POST(req: NextRequest) {
    const { amount, planName }: RequestBody = await req.json();

    // 1. Verify user authentication
    const authorization = req.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];

    let decodedToken;
    try {
        decodedToken = await auth.verifyIdToken(idToken);
    } catch (error) {
        console.error('Error verifying auth token:', error);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = decodedToken.uid;

    if (!amount || !planName || !userId) {
        return NextResponse.json({ error: 'Missing required parameters: amount, planName, or userId' }, { status: 400 });
    }

    try {
        // 2. Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount should be in the smallest currency unit (e.g., cents)
            currency: 'cad',
            metadata: { 
                userId: userId,
                planName: planName 
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // 3. Send the client secret back to the client
        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error: any) {
        console.error('Error creating PaymentIntent:', error);
        return NextResponse.json({ error: `Failed to create payment intent: ${error.message}` }, { status: 500 });
    }
}
