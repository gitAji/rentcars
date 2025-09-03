"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Loading from "@/components/loading"; // Added import

export default function AddNewCarPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => { // Added useEffect for loading simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate 1 second loading time
    return () => clearTimeout(timer);
  }, []);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCar = {
      make,
      model,
      year: parseInt(year),
      price: parseFloat(price),
      imageUrl,
    };

    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCar),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      alert("Car added successfully!");
      router.push("/admin");
    } catch (error: unknown) {
      alert(`Failed to add car: ${(error as Error).message}`);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 bg-secondary text-neutral">
        <h1 className="text-3xl font-bold mb-4 text-primary">Add New Car</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="make" className="block text-lg font-medium text-neutral">Make:</label>
            <input
              type="text"
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="model" className="block text-lg font-medium text-neutral">Model:</label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="year" className="block text-lg font-medium text-neutral">Year:</label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-lg font-medium text-neutral">Price per day:</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-lg font-medium text-neutral">Image URL:</label>
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Add Car
          </button>
        </form>
      </div>
    </>
  );
}