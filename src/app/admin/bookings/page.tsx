"use client";

import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Loading from "../../../components/loading"; // Added import

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

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]); // Typed useState
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
      <div className="container mx-auto p-4 bg-secondary text-neutral">
        <h1 className="text-3xl font-bold mb-4 text-primary">Manage Bookings</h1>
        {bookings.length === 0 ? (
          <p className="text-neutral-light">No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking: Booking) => (
              <div key={booking.id} className="border p-4 rounded-lg shadow-md bg-white">
                <h2 className="text-xl font-semibold text-primary">Booking ID: {booking.id}</h2>
                <p>Car: {booking.carMake} {booking.carModel}</p>
                <p>Customer: {booking.customerName} ({booking.customerEmail})</p>
                <p>Dates: {booking.startDate} to {booking.endDate}</p>
                <p>Total Price: kr{booking.totalPrice.toFixed(2)}</p>
                <p>Booking Date: {new Date(booking.bookingDate).toLocaleString()}</p>
                <p>Extras: {booking.extras.length > 0 ? booking.extras.join(", ") : "None"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}