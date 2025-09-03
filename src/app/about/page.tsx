"use client";

import { useState, useEffect } from "react"; // Added
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loading from "../../components/loading"; // Added

export default function AboutPage() {
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
    <div className="flex flex-col min-h-screen">
      {/* Transparent Header */}
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/about-hero.jpg')" }} // 👈 Replace with your own image
      >
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-4xl md:text-5xl text-gray-800 sm:text-white font-bold">About Us</h1>
      </section>

      {/* Main Content in white */}
      <main className="bg-white flex-grow">
        <div className="container mx-auto p-8">
          <h2 className="text-3xl font-bold mb-6 text-primary">Who We Are</h2>
          <p className="mb-4 text-neutral-dark">
            Welcome to <strong>RentCars</strong>, your premier destination for hassle-free car rentals. We are dedicated to providing you with a seamless and enjoyable experience, offering a wide selection of vehicles to suit every need and budget.
          </p>
          <p className="mb-4 text-neutral-dark">
            Our mission is to make car rental simple, transparent, and accessible. We believe in offering competitive prices, clear terms, and exceptional customer service.
          </p>
          <p className="text-neutral-dark">
            Whether you are planning a family vacation, a business trip, or just need a car for a day, RentCars has you covered. Explore our fleet and start your adventure today!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
