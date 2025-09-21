"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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

interface CheckoutPageContentProps {
  car: Car;
  startDate: string;
  endDate: string;
  extras: string[];
  totalPrice: number;
  clientSecret: string;
}

function CheckoutPageContent({ car, startDate, endDate, extras, totalPrice, clientSecret }: CheckoutPageContentProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleStripePayment();
  };

  const handleStripePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    // 1. Call elements.submit() to validate and collect payment details
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Payment details are incomplete or invalid.');
      setLoading(false);
      return;
    }

    if (totalPrice === 0 || !name || !email) {
      setError("Please fill in all required contact details and select valid dates.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookingId = `RC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation?bookingId=${bookingId}&carId=${car.id}&carMake=${car.make}&carModel=${car.model}&startDate=${startDate}&endDate=${endDate}&extras=${extras.join(',')}&totalPrice=${totalPrice}&customerName=${name}&customerEmail=${email}`,
          receipt_email: email,
        },
      });

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment confirmation failed.');
      }

      if (paymentIntent.status === 'succeeded') {
        router.push(`/confirmation?bookingId=${bookingId}&carId=${car.id}&carMake=${car.make}&carModel=${car.model}&startDate=${startDate}&endDate=${endDate}&extras=${extras.join(',')}&totalPrice=${totalPrice}&customerName=${name}&customerEmail=${email}`);
      } else {
        setError(`Payment status: ${paymentIntent.status}`);
      }

    } catch (e: unknown) {
      console.error('Stripe payment error:', e);
      setError(e instanceof Error ? e.message : 'An unexpected error occurred during payment.');
    } finally {
      setLoading(false);
    }
  };

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
          {error && (
            <div className="text-center p-4 text-red-500 mb-4">Error: {error}</div>
          )}
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
                  <div className="mb-4">
                    <PaymentElement />
                  </div>


                  <div className="flex flex-col gap-4">
                    <button
                      type="button"
                      onClick={handleStripePayment}
                      disabled={!stripe || !elements || totalPrice === 0 || !name || !email || loading}
                      className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Pay
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
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const extras = searchParams.getAll("extras");
  const totalPrice = parseFloat(searchParams.get("totalPrice") || "0");

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingClientSecret, setLoadingClientSecret] = useState(true);
  const [clientSecretError, setClientSecretError] = useState<string | null>(null);

  const [car, setCar] = useState<Car | null>(null);
  const [loadingCar, setLoadingCar] = useState(true);
  const [carError, setCarError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      if (!carId) {
        setCarError("Car ID is missing.");
        setLoadingCar(false);
        return;
      }
      try {
        const res = await fetch(`/api/cars/${carId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setCar(data);
      } catch (e: unknown) {
        setCarError((e as Error).message || "Failed to load car details.");
      } finally {
        setLoadingCar(false);
      }
    };
    fetchCar();
  }, [carId]);

  useEffect(() => {
    const fetchClientSecret = async () => {
      if (!carId || !startDate || !endDate || totalPrice === 0) {
        setClientSecretError("Missing car details or dates for payment.");
        setLoadingClientSecret(false);
        return;
      }

      try {
        const response = await fetch('/api/stripe/checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            carId,
            startDate,
            endDate,
            extras,
            totalPrice,
            // customerName and customerEmail are not available here yet, will be passed from form
            // bookingId will be generated on client side in CheckoutPageContent
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create Payment Intent');
        }

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (e: unknown) {
        console.error('Error fetching client secret:', e);
        setClientSecretError(e instanceof Error ? e.message : 'Failed to load payment options.');
      } finally {
        setLoadingClientSecret(false);
      }
    };

    if (!loadingCar && !carError && car) { // Only fetch client secret if car details are loaded
      fetchClientSecret();
    }
  }, [carId, startDate, endDate, extras, totalPrice, loadingCar, carError, car]);

  if (loadingCar || loadingClientSecret) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (carError || clientSecretError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Error: {carError || clientSecretError}
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-primary">Car not found.</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-accent">Payment options not available.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutPageContent 
          car={car}
          startDate={startDate}
          endDate={endDate}
          extras={extras}
          totalPrice={totalPrice}
          clientSecret={clientSecret}
        />
      </Elements>
    </Suspense>
  );
}