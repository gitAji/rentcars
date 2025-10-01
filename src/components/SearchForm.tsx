"use client";

import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabaseClient';

interface SearchFormProps {
  onSearch: (filters: {
    town?: string;
    passengers?: number;
    carType?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [town, setTown] = useState("");
  const [adults, setAdults] = useState("");
  const [children, setChildren] = useState("");
  
  const [carType, setCarType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [townOptions, setTownOptions] = useState<string[]>([]);
  const [carTypeOptions, setCarTypeOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const { data: townsData, error: townsError } = await supabase
          .from('cars')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .select('town', { distinct: true } as any);
        if (townsError) throw townsError;
        setTownOptions(Array.from(new Set(townsData.map(item => item.town?.trim().toLowerCase()).filter(Boolean))));

        const { data: carTypesData, error: carTypesError } = await supabase
          .from('car_types')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .select('name', { distinct: true } as any);
        if (carTypesError) throw carTypesError;
        setCarTypeOptions(carTypesData.map(item => item.name).filter(Boolean));

      } catch (err: unknown) {
        console.error("Error fetching filter options:", err);
        if (err instanceof Error) {
          setError("Failed to load filter options." + err.message);
        } else {
          setError("Failed to load filter options. An unknown error occurred.");
        }
      }
    };
    fetchFilterOptions();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!town || !startDate || !endDate) {
      setError("Please select a town, start date, and end date.");
      return;
    }
    setError(null);
    const totalPassengers = (adults ? parseInt(adults) : 0) + (children ? parseInt(children) : 0);

    onSearch({
      ...(town && { town }),
      ...(totalPassengers > 0 && { passengers: totalPassengers.toString() }),
      ...(carType && { carType }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white backdrop-blur-sm p-10 rounded-2xl shadow-xl w-full max-w-4xl border border-gray-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="town" className="sr-only">Town</label>
          <select
            id="town"
            value={town}
            onChange={(e) => setTown(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900 w-full"
          >
            <option value="">Select Town</option>
            {townOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="adults" className="sr-only">Adults</label>
          <input
            id="adults"
            type="number"
            min="1"
            placeholder="Adults"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900 w-full"
          />
        </div>

        <div>
          <label htmlFor="children" className="sr-only">Children</label>
          <input
            id="children"
            type="number"
            min="0"
            placeholder="Children"
            value={children}
            onChange={(e) => setChildren(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900 w-full"
          />
        </div>

        <div>
          <label htmlFor="carType" className="sr-only">Car Type</label>
          <select
            id="carType"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900 w-full"
          >
            <option value="">Car Type</option>
            {carTypeOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="sr-only">Start Date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900 w-full"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="sr-only">End Date</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900 w-full"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <button
        type="submit"
        className="btn-primary w-full"
      >
        Search Cars
      </button>
    </form>
  );
}