"use client";

import { useEffect, useState, use, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Loading from "@/components/loading";

import Image from 'next/image';
import Link from 'next/link';

// Define interfaces for type safety
interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  imageUrls: string[]; // Added
  description?: string;
  features?: string[];
  terms?: string;
  seats: number;
  carType: string;
  shortDescription: string;
}

interface Extra {
  name: string;
  price: number;
}

export default function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) { // params is a Promise
  const router = useRouter();
  const { id } = use(params);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [extrasOptions, setExtrasOptions] = useState<Extra[]>([]);

  const carImages = useMemo(() => {
    if (!car) return []; // Return empty array if car is null
    return car.imageUrls || []; // Use car.imageUrls, or empty array if not present
  }, [car]); // Depend on car object

  const goToNextImage = useCallback(() => {
    if (carImages.length === 0) return; // Prevent error if no images
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % carImages.length
    );
  }, [carImages.length, setCurrentImageIndex]);

  const goToPrevImage = useCallback(() => {
    if (carImages.length === 0) return; // Prevent error if no images
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + carImages.length) % carImages.length
    );
  }, [carImages.length, setCurrentImageIndex]);

  

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const res = await fetch("/api/extras");
        if (!res.ok) {
          throw new Error(`Failed to fetch extras: ${res.status}`);
        }
        const data: Extra[] = await res.json();
        setExtrasOptions(data);
      } catch (e: unknown) {
        setError((e as Error).message || "Failed to load extras");
      }
    };

    fetchExtras();
  }, []);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/cars/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch car: ${res.status}`);
        }
        const data: Car = await res.json();
        setCar(data);
      } catch (e: unknown) {
        setError((e as Error).message || "Failed to load car details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCar();
    }
  }, [id]);

  useEffect(() => {
    if (car && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        setError("End date must be after start date");
        setTotalPrice(0);
        return;
      }
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let price = car.price * diffDays;

      selectedExtras.forEach((extraName) => {
        const extra = extrasOptions.find((e) => e.name === extraName);
        if (extra) {
          price += extra.price * diffDays;
        }
      });
      setTotalPrice(price);
    } else {
      setTotalPrice(0);
    }
  }, [car, startDate, endDate, selectedExtras, extrasOptions]);

  const handleExtraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedExtras((prev) =>
      checked ? [...prev, value] : prev.filter((extra) => extra !== value)
    );
  };

  const handleCheckout = () => {
    if (!car || !startDate || !endDate || totalPrice === 0) {
      alert("Please select a valid start and end date to proceed.");
      return;
    }

    const query = new URLSearchParams({
      carId: car.id,
      startDate,
      endDate,
      extras: selectedExtras.join(","),
      totalPrice: totalPrice.toFixed(2),
    }).toString();

    router.push(`/checkout?${query}`);
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
        <p className="text-2xl text-accent">Error: {error}</p>
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

  

  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${car.imageUrl || "/default-car-hero.jpg"})` }}
      >
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-3xl sm:text-4xl md:text-5xl text-white font-bold">
          {car.make} {car.model}
        </h1>
      </section>

      {/* Main Content */}
      <div className="container mx-auto p-6 bg-primary text-neutral-dark rounded-lg shadow-lg flex-grow mb-2">
        <div className="mb-4 font-bold">
          <p className="text-sm text-gray-500">
            <Link href="/" className="hover:underline">Home</Link> | 
            <Link href="/cars" className="hover:underline">Cars</Link> | 
            <span>{car.make} {car.model}</span>
          </p>
        </div>
        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg shadow-md overflow-hidden">
            <Image
              src={carImages[currentImageIndex]}
              alt={`Image of ${car.make} ${car.model} - ${currentImageIndex + 1}`}
              width={500}
              height={300}
              className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
            />
            {/* Navigation Buttons */}
            <button
              onClick={goToPrevImage}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-colors"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              onClick={goToNextImage}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-colors"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {carImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-2 w-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-gray-400'} focus:outline-none`}
                  aria-label={`View image ${idx + 1}`}
                ></button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2 text-primary">Description</h2>
            <p className="text-neutral text-base mb-4">
              {car.description ||
                `Discover the features and comfort of the ${car.make} ${car.model}. This car is an excellent choice for your travel needs, offering a blend of performance and style.`}
            </p>

            <h2 className="text-2xl font-bold mb-2 text-primary">Included Features</h2>
            <ul className="list-disc list-inside text-neutral text-base mb-4">
              {car.features && car.features.length > 0 ? (
                car.features.map((feature) => <li key={feature}>{feature}</li>)
              ) : (
                <>
                  <li>Air Conditioning</li>
                  <li>Automatic Transmission</li>
                  <li>Spacious Interior</li>
                </>
              )}
            </ul>

            <h2 className="text-2xl font-bold mb-2 text-primary">Terms and Conditions</h2>            <p className="text-neutral text-base mb-4">              {car.terms || `Minimum rental age is 21. Valid driver's license required. Fuel policy: full to full,The vehicle must be returned in the same clean condition as delivered. A cleaning fee may apply if the vehicle requires excessive cleaning upon return.`}            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-6 items-end">
          <div>
            <p className="text-base font-bold">Year: {car.year}</p>
            <p className="text-base font-bold text-accent">
              Price per day: kr{car.price.toFixed(2)}
            </p>
          </div>
          <div>
            <label
              htmlFor="startDate"
              className="block text-base font-medium text-neutral-dark mb-2"
            >
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]} // Prevent past dates
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              aria-required="true"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-base font-medium text-neutral-dark mb-2"
            >
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split("T")[0]} // Prevent end date before start date
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              aria-required="true"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-primary">Optional Extras</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {extrasOptions.map((extra) => (
            <div key={extra.name} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id={extra.name}
                value={extra.name}
                checked={selectedExtras.includes(extra.name)}
                onChange={handleExtraChange}
                className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label
                htmlFor={extra.name}
                className="ml-4 text-base text-neutral-dark"
              >
                {extra.name} (kr{extra.price.toFixed(2)}/day)
              </label>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
          <h2 className="text-3xl font-bold mb-4 text-primary text-center">
            Total Price: kr{totalPrice.toFixed(2)}
          </h2>

          <button
            onClick={handleCheckout}
            disabled={!car || !startDate || !endDate || totalPrice === 0}
            className="mt-4 w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Proceed to checkout"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}