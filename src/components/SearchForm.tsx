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
        {/* Town */}
        <select
          value={town}
          onChange={(e) => setTown(e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900"
        >
          <option value="">Select Town</option>
          <option value="Oslo">Oslo</option>
          <option value="Bergen">Bergen</option>
          <option value="Stavanger">Stavanger</option>
          <option value="Trondheim">Trondheim</option>
          <option value="Tromsø">Tromsø</option>
        </select>

        {/* Adults */}
        <input
          type="number"
          min="1"
          placeholder="Adults"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900"
        />

        {/* Children */}
        <input
          type="number"
          min="0"
          placeholder="Children"
          value={children}
          onChange={(e) => setChildren(e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900"
        />

        {/* Car Type */}
        <select
          value={carType}
          onChange={(e) => setCarType(e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900"
        >
          <option value="">Car Type</option>
          <option value="compact">Compact</option>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="van">Van</option>
        </select>

        {/* Start Date */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900"
        />

        {/* End Date */}
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900"
        />
      </div>

      {/* Submit Button (kept as-is from your code) */}
      <button
        type="submit"
        className="w-full bg-[#ff5757] text-white p-3 rounded-md hover:bg-[#e64d4d] focus:outline-none focus:ring-2 focus:ring-[#ff5757] focus:ring-offset-2"
      >
        Search Cars
      </button>
    </form>
  );
}
