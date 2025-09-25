"use client";

import { Suspense, useEffect, useState, useCallback, JSX } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loading from "@/components/loading";
import CarCard from "@/app/components/CarCard";
import { FaCar, FaCarSide, FaCarAlt, FaBolt, FaCity, FaTimesCircle, FaFilter } from 'react-icons/fa';

// Define interfaces for type safety
interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image_url: string;
  imageUrls: string[];
  description?: string;
  features?: string[];
  terms?: string;
  seats: number;
  carType: string[];
  shortDescription: string;
  town: string;
}

interface CarType {
  id: number;
  name: string;
}

function CarsPageContent() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const [town, setTown] = useState(searchParams.get("town") || "");
  const [activeCarTypes, setActiveCarTypes] = useState<string[]>(searchParams.get("carType")?.split(",") || []);
  const [availableCarTypes, setAvailableCarTypes] = useState<CarType[]>([]);
  const [availableTowns, setAvailableTowns] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false); // State to toggle filter visibility

  const carTypeIcons: { [key: string]: JSX.Element } = {
    Sedan: <FaCar />,
    SUV: <FaCarSide />,
    Hatchback: <FaCarAlt />,
    Electric: <FaBolt />,
  };

  useEffect(() => {
    const fetchCarTypes = async () => {
      try {
        const res = await fetch("/api/car-types");
        if (!res.ok) {
          throw new Error(`Failed to fetch car types: ${res.status}`);
        }
        const data: CarType[] = await res.json();
        setAvailableCarTypes(data);
      } catch (e: unknown) {
        console.error("Error fetching car types:", e);
      }
    };

    const fetchTowns = async () => {
      try {
        const res = await fetch("/api/towns");
        if (!res.ok) {
          throw new Error(`Failed to fetch towns: ${res.status}`);
        }
        const data: string[] = await res.json();
        setAvailableTowns(data);
      } catch (e: unknown) {
        console.error("Error fetching towns:", e);
      }
    };

    fetchCarTypes();
    fetchTowns();
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams(searchParams).toString();
        const res = await fetch(`/api/cars?${query}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch cars: ${res.status}`);
        }
        const data: Car[] = await res.json();
        setCars(data);
      } catch (e: unknown) {
        setError((e as Error).message || "Failed to load cars");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [searchParams]);

  const handleApplyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (town) {
      params.set("town", town);
    }
    if (activeCarTypes.length > 0) {
      params.set("carType", activeCarTypes.join(","));
    }
    if (startDate) {
      params.set("startDate", startDate);
    }
    if (endDate) {
      params.set("endDate", endDate);
    }
    router.push(`/cars?${params.toString()}`);
  }, [town, activeCarTypes, startDate, endDate, router]);

  const handleClearAllFilters = () => {
    setTown("");
    setActiveCarTypes([]);
    router.push(`/cars`);
  };

  const handleCarTypeClick = (carType: string) => {
    setActiveCarTypes((prev) =>
      prev.includes(carType)
        ? prev.filter((t) => t !== carType)
        : [...prev, carType]
    );
  };

  const handleTownClick = (selectedTown: string) => {
    setTown(selectedTown === town ? "" : selectedTown);
  };

  useEffect(() => {
    handleApplyFilters(); // Apply filters whenever activeCarTypes or town changes
  }, [handleApplyFilters]);

  const hasActiveFilters = town || activeCarTypes.length > 0;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section
        className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('/cars-hero.jpg')` }}
      >
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-3xl sm:text-4xl md:text-5xl text-white font-bold">
          Our Cars
        </h1>
      </section>
      <main className="container mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">Filters</h2>
            <div className="flex flex-wrap gap-2">
              {town && (
                <span className="flex items-center px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                  <FaCity className="mr-1" /> {town}
                  <button onClick={() => setTown("")} className="ml-1 text-red-500 hover:text-red-700"><FaTimesCircle size={10} /></button>
                </span>
              )}
              {activeCarTypes.map((type) => (
                <span key={type} className="flex items-center px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                  {carTypeIcons[type] || <FaCar className="mr-1" />} {type}
                  <button onClick={() => handleCarTypeClick(type)} className="ml-1 text-red-500 hover:text-red-700"><FaTimesCircle size={10} /></button>
                </span>
              ))}
              {hasActiveFilters && (
                <button
                  onClick={handleClearAllFilters}
                  className="flex items-center px-2 py-0.5 bg-red-600 text-white rounded-full text-xs hover:bg-red-700 transition-colors duration-200"
                >
                  <FaTimesCircle className="mr-1" />Clear All
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition-colors duration-200 text-sm"
            >
              <FaFilter className="mr-1.5" />
              {showFilters ? "Hide Options" : "Show Options"}
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Town</label>
                <div className="flex flex-wrap gap-1">
                  {availableTowns.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTownClick(t)}
                      className={`flex items-center px-2 py-1 border rounded-md text-xs transition-all duration-200 
                        ${town === t
                          ? "bg-red-500 text-white border-red-500 shadow-md hover:bg-red-700"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}
                      `}
                    >
                      <FaCity className="inline-block mr-1" />{t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Car Type</label>
                <div className="flex flex-wrap gap-1">
                  {availableCarTypes.map((carType) => (
                    <button
                      key={carType.id}
                      onClick={() => handleCarTypeClick(carType.name)}
                      className={`flex flex-col items-center justify-center p-1 border rounded-md text-xs transition-all duration-200 
                        ${activeCarTypes.includes(carType.name)
                          ? "bg-red-500 text-white border-red-500 shadow-md hover:bg-red-700"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}
                      `}
                    >
                      <span className="text-base">{carTypeIcons[carType.name] || <FaCar />}</span>
                      <span>{carType.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} startDate={startDate} endDate={endDate} />
          ))}
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