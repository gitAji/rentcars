"use client";

import { Suspense } from 'react';
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CarCard from "../components/CarCard";
import Loading from "../../components/loading";

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  imageUrls: string[];
  town: string;
  passengers: number;
  carType: string;
  description?: string;
  features?: string[];
  terms?: string;
  seats: number;
  shortDescription: string;
}

function CarsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterTown, setFilterTown] = useState(searchParams.get("town") || "");
  const [filterCarType, setFilterCarType] = useState(
    searchParams.get("carType") || ""
  );
  const [showFilters, setShowFilters] = useState(false);

  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = searchParams.toString();
        const res = await fetch(`/api/cars?${query}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setCars(data);
      } catch (e: unknown) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [searchParams]);

  const handleFilterChange = (param: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newSearchParams.set(param, value);
    } else {
      newSearchParams.delete(param);
    }
    router.push(`/cars?${newSearchParams.toString()}`);
  };

  const towns = ["Oslo", "Bergen", "Stavanger"];
  const carTypes = ["Sedan", "SUV", "Hatchback", "Electric"];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section
        className="relative h-48 md:h-64 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/cars-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-4xl md:text-5xl text-white font-bold">
          Find Your Perfect Ride
        </h1>
      </section>

      <main className="bg-white flex-grow">
        <div className="container mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8 max-w-7xl">
          {/* Filter Toggle Button (Mobile Only) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden w-full bg-primary text-white p-3 rounded-md mb-4"
          >
            {showFilters ? "Hide" : "Show"} Filters
          </button>

          {/* Filter Section */}
          <div
            className={`${showFilters ? "block" : "hidden"} md:block bg-gray-100 p-4 rounded-lg md:w-1/4`}
          >
            <h2 className="text-2xl font-bold text-primary mb-4">Filter Cars</h2>

            {/* Town Filter */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-neutral-dark">Town</h3>
              <div className="flex flex-wrap gap-2">
                {towns.map((town) => (
                  <button
                    key={town}
                    onClick={() => {
                      const newTown = filterTown === town ? "" : town;
                      setFilterTown(newTown);
                      handleFilterChange("town", newTown);
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      filterTown === town
                        ? "bg-red-500 text-white"
                        : "bg-white text-neutral-dark border border-gray-300"
                    }`}
                  >
                    {town}
                  </button>
                ))}
              </div>
            </div>

            {/* Car Type Filter */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-neutral-dark">Car Type</h3>
              <div className="flex flex-wrap gap-2">
                {carTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      const newCarType = filterCarType === type ? "" : type;
                      setFilterCarType(newCarType);
                      handleFilterChange("carType", newCarType);
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      filterCarType === type
                        ? "bg-red-500 text-white"
                        : "bg-white text-neutral-dark border border-gray-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Car Grid */}
          <section className="flex-1">
            <h2 className="text-3xl font-bold mb-8 text-primary">
              Available Cars
            </h2>

            {/* Loading State */}
            {loading ? (
              <Loading />
            ) : error ? (
              <div className="text-center p-4 text-red-500">Error: {error}</div>
            ) : cars.length === 0 ? (
              <p className="text-neutral-light text-lg">
                No cars found matching your criteria.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cars.map((car: Car) => (
                  <CarCard key={car.id} car={car} startDate={startDate} endDate={endDate} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CarsPageContent />
    </Suspense>
  );
}
