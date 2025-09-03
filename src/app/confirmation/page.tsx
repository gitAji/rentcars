"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import Loading from "@/components/loading"; // Added import

interface Booking {
  id: string;
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

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null); // Typed bookingDetails state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ... useEffect ...

  if (loading) { // Modified loading check
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }
  if (error) return <div className="text-center p-4 text-accent">Error: {error}</div>;

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Booking Confirmed!</h1>
          {bookingDetails && (
            <>
              <p className="text-lg text-neutral mb-2">Booking ID: <span className="font-semibold">{bookingDetails.id}</span></p>
              <p className="text-lg text-neutral mb-4">{bookingDetails.message}</p>
              <p className="text-md text-neutral-light mb-6">{bookingDetails.details}</p>
            </>
          )}
          <Link href="/" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            Go to Home
          </Link>
        </div>
      </div>
    </>
  );
}