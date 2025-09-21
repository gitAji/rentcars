import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  try {
    const { carId, carMake, carModel, startDate, endDate, extras, totalPrice, customerName, customerEmail, bookingId } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Stripe expects amount in cents
      currency: 'nok',
      metadata: { // Store booking details in metadata
        carId,
        startDate,
        endDate,
        extras: extras.join(','),
        totalPrice: totalPrice.toString(),
        customerName,
        customerEmail,
        bookingId,
        carMake,
        carModel,
      },
      // You can add customer details here if you have a Stripe Customer ID
      // customer: 'cus_xyz',
      // receipt_email: customerEmail,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating Payment Intent:', error);
    return NextResponse.json({ error: 'Failed to create Payment Intent' }, { status: 500 });
  }
}