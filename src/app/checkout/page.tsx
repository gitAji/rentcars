"use client";

import { Suspense } from 'react';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Loading from "@/components/loading";
import Image from "next/image";

import Footer from "@/components/Footer";

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

function CheckoutPageContent() {
  const searchParams = useSearchParams();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [instructions, setInstructions] = useState("");

  const carId = searchParams.get("carId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const extras = searchParams.getAll("extras");

  useEffect(() => {
    if (carId) {
      const fetchCar = async () => {
        try {
          const res = await fetch(`/api/cars/${carId}`);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          setCar(data);
        } catch (e: unknown) {
          setError((e as Error).message);
        } finally {
          setLoading(false);
        }
      };
      fetchCar();
    } else {
      setLoading(false);
      setError("Car ID is missing");
    }
  }, [carId]);

  const getNumberOfDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = end.getTime() - start.getTime();
      return Math.ceil(diff / (1000 * 3600 * 24));
    }
    return 0;
  };

  const numberOfDays = getNumberOfDays();
  const totalPrice = car ? car.price * numberOfDays : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Error: {error}
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Car not found.
      </div>
    );
  }

  return (
    <>
      <Header />

      <section
        className="relative h-48 md:h-64 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/cars-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-4xl md:text-5xl text-white font-bold">
          Confirm Your Booking
        </h1>
      </section>

      <main className="bg-white flex-grow">
        <div className="container mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-primary">
                  Your Booking Summary
                </h2>
                <div className="flex items-center mb-4">
                  <Image
                    src={car.imageUrl}
                    alt={`${car.make} ${car.model}`}
                    width={150}
                    height={100}
                    className="rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{car.make} {car.model}</h3>
                    <p className="text-neutral-light">{car.year}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p><span className="font-semibold">Dates:</span> {startDate} to {endDate}</p>
                  <p><span className="font-semibold">Number of days:</span> {numberOfDays}</p>
                  <p><span className="font-semibold">Extras:</span> {extras.length > 0 ? extras.join(", ") : "None"}</p>
                  <p className="text-2xl font-bold mt-4 text-primary">
                    Total Price: kr{totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-primary">
                  Your Contact Details
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-base font-medium text-neutral-dark"
                    >
                      Full Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-base font-medium text-neutral-dark"
                    >
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-base font-medium text-neutral-dark"
                    >
                      Phone:
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="driverLicense"
                      className="block text-base font-medium text-neutral-dark"
                    >
                      Driver License Number (Optional):
                    </label>
                    <input
                      type="text"
                      id="driverLicense"
                      value={driverLicense}
                      onChange={(e) => setDriverLicense(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="instructions"
                      className="block text-base font-medium text-neutral-dark"
                    >
                      Pickup/Return Instructions (Optional):
                    </label>
                    <textarea
                      id="instructions"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Payment</h3>
                  <div className="flex flex-col gap-4">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Pay with Stripe
                    </button>
                    <button
                      type="submit"
                      className="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                    >
                      Pay with Vipps
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CheckoutPageContent />
    </Suspense>
  );
}