"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CarCard from "../components/CarCard";
import Loading from "../../components/loading"; // 👈 Import custom loading animation

interface Car {
  id: string;
  // Add other properties as needed
}

export default function CarsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterTown, setFilterTown] = useState(searchParams.get("town") || "");
  const [filterCarType, setFilterCarType] = useState(searchParams.get("carType") || "");

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

    // Preserve other params (like startDate, endDate)
    searchParams.forEach((value, key) => {
      if (key !== "town" && key !== "carType") {
        newSearchParams.set(key, value);
      }
    });

    router.push(`/cars?${newSearchParams.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Transparent Header */}
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/cars-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-4xl md:text-5xl text-white font-bold">Find Your Perfect Ride</h1>
      </section>

      {/* Main Content */}
      <main className="bg-white flex-grow">
        <div className="container mx-auto p-8 flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="w-full md:w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-primary">Filter Cars</h2>

            {/* Town Filter */}
            <div className="mb-4">
              <label htmlFor="filterTown" className="block text-neutral-dark mb-2">
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
              <label htmlFor="filterType" className="block text-neutral-dark mb-2">
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

          {/* Car Grid */}
          <section className="flex-1">
            <h2 className="text-3xl font-bold mb-8 text-primary">Available Cars</h2>

            {/* Loading State */}
            {loading ? (
              <Loading />
            ) : error ? (
              <div className="text-center p-4 text-red-500">Error: {error}</div>
            ) : cars.length === 0 ? (
              <p className="text-neutral-light text-lg">No cars found matching your criteria.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cars.map((car: Car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    startDate={searchParams.get("startDate") || ""}
                    endDate={searchParams.get("endDate") || ""}
                  />
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
