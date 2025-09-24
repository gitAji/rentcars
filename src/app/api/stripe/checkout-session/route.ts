import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  console.log("--- DEBUG: Inside API route ---");
  console.log("process.env.STRIPE_SECRET_KEY (raw):", process.env.STRIPE_SECRET_KEY);
  console.log("--- END DEBUG ---");

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is not set.");
    return NextResponse.json({ error: 'Server configuration error: Stripe secret key is missing.' }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  });

  let body;
  try {
    body = await req.json();
    console.log("Incoming checkout session request body:", body);
  } catch (jsonError) {
    console.error('Error parsing request body as JSON:', jsonError);
    return NextResponse.json({ error: 'Invalid request body: Must be valid JSON.' }, { status: 400 });
  }

  try {
    const { carId, carMake, carModel, startDate, endDate, extras, totalPrice } = body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Stripe expects amount in cents
      currency: 'nok',
      metadata: { // Store booking details in metadata
        carId,
        startDate,
        endDate,
        extras: extras.join(','),
        totalPrice: totalPrice.toString(),
        carMake,
        carModel,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) { // Explicitly type error as 'any' for easier logging
    console.error('Error creating Payment Intent:', error);
    // Always return the error message from Stripe if available, otherwise a generic message
    return NextResponse.json({ error: error.message || 'Failed to create Payment Intent' }, { status: 500 });
  }
}