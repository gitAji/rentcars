import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

const resend = resendApiKey ? new Resend(resendApiKey) : null;
const ADMIN_EMAIL = 'kontaktaone@gmail.com';

export async function POST(req: Request) {
  if (!resend) {
    console.error('Resend client not initialized due to missing RESEND_API_KEY environment variable.');
    return NextResponse.json({ error: 'Failed to send confirmation email: Resend client not initialized.' }, { status: 500 });
  }
  try {
    const { bookingDetails } = await req.json();

    // Email to the customer
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Replace with your verified domain in production
      to: bookingDetails.customerEmail,
      subject: 'Your Booking Confirmation',
      html: `<h1>Booking Confirmed!</h1>
             <p>Hi ${bookingDetails.customerName},</p>
             <p>Your booking for a ${bookingDetails.carMake} ${bookingDetails.carModel} from ${bookingDetails.startDate} to ${bookingDetails.endDate} is confirmed.</p>
             <p>Total Price: kr${bookingDetails.totalPrice.toFixed(2)}</p>
             <p>Booking ID: ${bookingDetails.id}</p>
             <p>Thank you for choosing RentCars!</p>`,
    });

    // Email to the admin
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Replace with your verified domain in production
      to: ADMIN_EMAIL,
      subject: 'New Booking Received',
      html: `<h1>New Booking</h1>
             <p>A new booking has been made.</p>
             <p><strong>Booking ID:</strong> ${bookingDetails.id}</p>
             <p><strong>Customer:</strong> ${bookingDetails.customerName} (${bookingDetails.customerEmail})</p>
             <p><strong>Car:</strong> ${bookingDetails.carMake} ${bookingDetails.carModel}</p>
             <p><strong>Dates:</strong> ${bookingDetails.startDate} to ${bookingDetails.endDate}</p>
             <p><strong>Total Price:</strong> kr${bookingDetails.totalPrice.toFixed(2)}</p>`,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 });
  }
}
