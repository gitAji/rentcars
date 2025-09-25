"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

// Define interfaces for type safety
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
  seats: number;
  carType: string[];
  shortDescription: string;
}

interface Extra {
  name: string;
  price: number;
}

interface CarDetailsContentProps {
  car: Car;
  id: string;
}

export default function CarDetailsContent({ car, id }: CarDetailsContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [extrasOptions, setExtrasOptions] = useState<Extra[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const carImages = useMemo(() => {
    return car.imageUrls && car.imageUrls.length > 0
      ? car.imageUrls
      : car.imageUrl
      ? [car.imageUrl]
      : [];
  }, [car]);

  const goToNextImage = useCallback(() => {
    if (carImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
  }, [carImages.length]);

  const goToPrevImage = useCallback(() => {
    if (carImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + carImages.length) % carImages.length);
  }, [carImages.length]);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const res = await fetch("/api/extras");
        if (!res.ok) {
          throw new Error("Failed to fetch extras. Please make sure you have created the 'extras' table in your Supabase project.");
        }
        const data = await res.json();
        setExtrasOptions(data);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchExtras();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
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

  

  if (!car) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-neutral-light">Car not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section
        className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${car.imageUrl || "/default-car-hero.jpg"})` }}
      >
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-3xl sm:text-4xl md:text-5xl text-white font-bold">
          {car.make} {car.model}
        </h1>
      </section>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4 font-bold">
          <p className="text-sm text-gray-500">
            <Link href="/" className="hover:underline">Home</Link> | 
            <Link href="/cars" className="hover:underline">Cars</Link> | 
            <span>{car.make} {car.model}</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Left Column: Image Gallery, Description, Features, Terms */}
          <div className="md:col-span-2">
            <div className="relative w-full h-96 rounded-lg shadow-lg overflow-hidden mb-4">
                {carImages.length > 0 ? (
                  <Image
                    src={carImages[currentImageIndex]}
                    alt={`Image ${currentImageIndex + 1} of ${car.make} ${car.model}`}
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-500 ease-in-out"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
                {carImages.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevImage}
                      className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-transform transform hover:scale-110"
                      aria-label="Previous image"
                    >
                      &#8249;
                    </button>
                    <button
                      onClick={goToNextImage}
                      className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-transform transform hover:scale-110"
                      aria-label="Next image"
                    >
                      &#8250;
                    </button>
                  </>
                )}
              </div>
              {carImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {carImages.map((src, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-24 h-16 rounded-md overflow-hidden border-2 ${
                        currentImageIndex === index ? "border-accent" : "border-transparent"
                      } transition-all duration-300`}
                    >
                      <Image
                        src={src}
                        alt={`Thumbnail ${index + 1}`}
                        width={96}
                        height={64}
                        objectFit="cover"
                      />
                    </button>
                  ))}
                </div>
              )}

            <h2 className="text-2xl font-bold mb-2 text-primary mt-8">Description</h2>
            <p className="text-neutral text-base mb-4">
              {car.description ||
                `Discover the features and comfort of the ${car.make} ${car.model}. This car is an excellent choice for your travel needs, offering a blend of performance and style.`}
            </p>
            <h2 className="text-2xl font-bold mb-2 text-primary">Included Features</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-neutral text-base mb-4">
              {car.features && car.features.length > 0 ? (
                car.features.map((feature) => <div key={feature} className="flex items-center"><span className="mr-2 text-accent">•</span>{feature}</div>)
              ) : (
                <>
                  <div className="flex items-center"><span className="mr-2 text-accent">•</span>Air Conditioning</div>
                  <div className="flex items-center"><span className="mr-2 text-accent">•</span>Automatic Transmission</div>
                  <div className="flex items-center"><span className="mr-2 text-accent">•</span>Spacious Interior</div>
                </>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2 text-primary">Terms and Conditions</h2>
            <p className="text-neutral text-base mb-4">              {car.terms || `Minimum rental age is 21. Valid driver's license required. Fuel policy: full to full,The vehicle must be returned in the same clean condition as delivered. A cleaning fee may apply if the vehicle requires excessive cleaning upon return.`}
            </p>
          </div>

          {/* Right Column: Booking Details */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-3xl font-extrabold text-primary mb-2">
                {car.make} {car.model}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{car.shortDescription}</p>
              <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="text-lg font-semibold">{car.year}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Seats</p>
                  <p className="text-lg font-semibold">{car.seats}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="text-lg font-semibold">{car.carType.join(", ")}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-accent mt-4">
                kr{car.price.toFixed(2)}
                <span className="text-sm font-normal text-gray-500"> / day</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="startDate" className="block font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => {
                      const newQuery = new URLSearchParams(searchParams.toString());
                      newQuery.set("startDate", e.target.value);
                      router.push(`/cars/${id}?${newQuery.toString()}`);
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => {
                      const newQuery = new URLSearchParams(searchParams.toString());
                      newQuery.set("endDate", e.target.value);
                      router.push(`/cars/${id}?${newQuery.toString()}`);
                    }}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
                    aria-required="true"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 mt-4">{error}</p>}

              {extrasOptions.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">Optional Extras</h3>
                  <div className="space-y-3">
                    {extrasOptions.map((extra) => (
                      <div key={extra.name} className="flex items-center justify-between">
                        <label htmlFor={extra.name} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={extra.name}
                            value={extra.name}
                            checked={selectedExtras.includes(extra.name)}
                            onChange={(e) => {
                              const val = e.target.value;
                              const checked = e.target.checked;
                              setSelectedExtras((prev) =>
                                checked ? [...prev, val] : prev.filter((x) => x !== val)
                              );
                            }}
                            className="h-5 w-5 text-accent rounded border-gray-300 focus:ring-accent"
                          />
                          <span className="text-gray-700">{extra.name}</span>
                        </label>
                        <span className="font-semibold">kr{extra.price}/day</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-3xl font-bold text-primary text-right">
                  Total: kr{totalPrice.toFixed(2)}
                </p>
                <button
                  onClick={() => {
                    if (!startDate || !endDate || totalPrice === 0) {
                      alert("Please select valid dates");
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
                  }}
                  className="mt-4 w-full bg-red-600 text-white p-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={totalPrice === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
