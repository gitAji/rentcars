"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Loading from "@/components/loading"; // Added import

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  imageUrls: string[];
  description?: string;
  features?: string[];
  terms?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [car, setCar] = useState<Car | null>(null); // Typed car state
  // ... other states ...

  if (!car) { // Modified loading check
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 bg-primary text-neutral-dark mb-2">
        <h1 className="text-2xl font-bold mb-2 text-primary">Checkout</h1>
        <div className="bg-white p-4 rounded-lg shadow-md mb-2">
          <h2 className="text-xl font-semibold mb-2 text-primary">Your Booking Summary</h2>
          <p className="text-base">Car: {car.make} {car.model}</p>
          <p className="text-base">Dates: {startDate} to {endDate}</p>
          <p className="text-base">Extras: {extras.length > 0 ? extras.join(", ") : "None"}</p>
          <p className="text-xl font-bold mt-2 text-primary">Total Price: kr{totalPrice.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-2">
          <h2 className="text-xl font-semibold mb-2 text-primary">Your Contact Details</h2>
          <div className="mb-2">
            <label htmlFor="name" className="block text-base font-medium text-neutral-dark">Full Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="block text-base font-medium text-neutral-dark">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="phone" className="block text-base font-medium text-neutral-dark">Phone:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="driverLicense" className="block text-base font-medium text-neutral-dark">Driver License Number (Optional):</label>
            <input
              type="text"
              id="driverLicense"
              value={driverLicense}
              onChange={(e) => setDriverLicense(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="instructions" className="block text-base font-medium text-neutral-dark">Pickup/Return Instructions (Optional):</label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#ff5757] text-white p-2 rounded-md hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-base"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </>
  );
}
