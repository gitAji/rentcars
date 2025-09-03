import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const bookingsFilePath = path.join(process.cwd(), 'data', 'bookings.json');

async function readBookings() {
  const fileContents = await fs.readFile(bookingsFilePath, 'utf8');
  return JSON.parse(fileContents);
}

interface Booking {
  id: number; // Assuming id is a number based on Math.max usage
  carMake: string;
  carModel: string;
  customerName: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  bookingDate: string;
  extras: string[];
  // Add other properties as needed based on the booking object structure
}

async function writeBookings(bookings: Booking[]) {
  await fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2), 'utf8');
}

export async function GET() {
  const bookings = await readBookings();
  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  const newBooking = await request.json();
  const bookings = await readBookings();
  const newId = bookings.length > 0 ? Math.max(...bookings.map((booking: Booking) => booking.id)) + 1 : 1;
  const bookingWithId = { id: newId, ...newBooking };
  bookings.push(bookingWithId);
  await writeBookings(bookings);
  return NextResponse.json(bookingWithId, { status: 201 });
}
