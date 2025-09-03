"use client";

import { useState, useEffect } from "react"; // Added
import Link from "next/link";
import Header from "../../components/Header";
import Loading from "../../components/loading"; // Added

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true); // Added

  useEffect(() => { // Added
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate 1 second loading time
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) { // Added
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 bg-secondary text-neutral">
        <h1 className="text-3xl font-bold mb-4 text-primary">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/cars/new" className="block p-6 bg-primary text-white rounded-lg shadow-md hover:bg-blue-700 text-center text-xl font-semibold">
            Add New Car
          </Link>
          <Link href="/admin/bookings" className="block p-6 bg-accent text-white rounded-lg shadow-md hover:bg-red-700 text-center text-xl font-semibold">
            View Bookings
          </Link>
        </div>
      </div>
    </>
  );
}