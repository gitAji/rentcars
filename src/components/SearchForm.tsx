"use client";

import { useState } from "react";

interface SearchFormProps {
  onSearch: (filters: {
    town?: string;
    adults?: number;
    children?: number;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      ...(town && { town }),
      ...(adults && { adults: parseInt(adults) }),
      ...(children && { children: parseInt(children) }),
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
            <option value="Oslo">Oslo</option>
            <option value="Bergen">Bergen</option>
            <option value="Stavanger">Stavanger</option>
            <option value="Trondheim">Trondheim</option>
            <option value="Tromsø">Tromsø</option>
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
            <option value="compact">Compact</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="van">Van</option>
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

      <button
        type="submit"
        className="w-full bg-[#ff5757] text-white p-3 rounded-md hover:bg-[#e64d4d] focus:outline-none focus:ring-2 focus:ring-[#ff5757] focus:ring-offset-2"
      >
        Search Cars
      </button>
    </form>
  );
}