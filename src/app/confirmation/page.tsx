"use client";

import { Suspense } from 'react';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import Loading from "@/components/loading";

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
  message?: string;
  details?: string;
}

function ConfirmationPageContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      const fetchBooking = async () => {
        try {
          // Replace with your actual API endpoint
          const res = await fetch(`/api/bookings/${bookingId}`);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          setBookingDetails(data);
        } catch (e: unknown) {
          setError((e as Error).message);
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    } else {
      setLoading(false);
      setError("Booking ID is missing");
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }
  if (error)
    return <div className="text-center p-4 text-accent">Error: {error}</div>;

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Booking Confirmed!
          </h1>
          {bookingDetails && (
            <>
              <p className="text-lg text-neutral mb-2">
                Booking ID:{" "}
                <span className="font-semibold">{bookingDetails.id}</span>
              </p>
              <p className="text-lg text-neutral mb-4">
                {bookingDetails.message}
              </p>
              <p className="text-md text-neutral-light mb-6">
                {bookingDetails.details}
              </p>
            </>
          )}
          <Link
            href="/"
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ConfirmationPageContent />
    </Suspense>
  );
}
