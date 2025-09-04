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
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false); // New state for sidebar

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

  const handleFilterChange = () => {
    const newSearchParams = new URLSearchParams();
    if (filterTown) newSearchParams.set("town", filterTown);
    if (filterCarType) newSearchParams.set("carType", filterCarType);

    searchParams.forEach((value, key) => {
      if (key !== "town" && key !== "carType") {
        newSearchParams.set(key, value);
      }
    });

    router.push(`/cars?${newSearchParams.toString()}`);
    setIsFilterSidebarOpen(false); // Close sidebar after applying filters
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section
        className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/cars-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-4xl md:text-5xl text-gray-800 sm:text-white font-bold">
          Find Your Perfect Ride
        </h1>
      </section>

      <main className="bg-white flex-grow">
        <div className="container mx-auto p-8 flex flex-col md:flex-row gap-8">
          {/* Filter Toggle Button (Mobile Only) */}
          <button
            onClick={() => setIsFilterSidebarOpen(true)}
            className="md:hidden w-full bg-primary text-white p-3 rounded-md mb-4"
          >
            Filter Cars
          </button>

          {/* Filter Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 w-64 bg-gray-100 p-4 transform ${
              isFilterSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:relative md:translate-x-0 md:w-1/4 transition-transform duration-300 ease-in-out z-40`}
          >
            <div className="flex justify-between items-center mb-4 md:hidden">
              <h2 className="text-2xl font-bold text-primary">Filter Cars</h2>
              <button onClick={() => setIsFilterSidebarOpen(false)} className="text-neutral-dark">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Town Filter */}
            <div className="mb-4">
              <label
                htmlFor="filterTown"
                className="block text-neutral-dark mb-2"
              >
                Town:
              </label>
              <select
                id="filterTown"
                value={filterTown}
                onChange={(e) => setFilterTown(e.target.value)}
                className="w-full p-2 border rounded-md text-neutral"
              >
                <option value="">All</option>
                <option value="Oslo">Oslo</option>
                <option value="Bergen">Bergen</option>
                <option value="Stavanger">Stavanger</option>
              </select>
            </div>

            {/* Car Type Filter */}
            <div className="mb-4">
              <label
                htmlFor="filterType"
                className="block text-neutral-dark mb-2"
              >
                Car Type:
              </label>
              <input
                type="text"
                id="filterType"
                value={filterCarType}
                onChange={(e) => setFilterCarType(e.target.value)}
                className="w-full p-2 border rounded-md text-neutral"
                placeholder="e.g., Sedan, SUV"
              />
            </div>

            <button
              onClick={handleFilterChange}
              className="w-full bg-[#ff5757] text-white p-2 rounded-md hover:bg-[#e64d4d]"
            >
              Apply Filters
            </button>
          </aside>

          {/* Overlay */}
          {isFilterSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setIsFilterSidebarOpen(false)}
            ></div>
          )}

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
                  <CarCard key={car.id} car={car} />
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
