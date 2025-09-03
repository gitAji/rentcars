"use client";

import { useState, useEffect } from "react"; // Added
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loading from "../../components/loading"; // Added

export default function ContactPage() {
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
        style={{ backgroundImage: "url('/contact-hero.jpg')" }} // 👈 Replace with your own image
      >
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-4xl md:text-5xl text-white font-bold">Contact Us</h1>
      </section>

      {/* Main Content */}
      <main className="bg-white flex-grow">
        <div className="container mx-auto p-8">
          <h2 className="text-3xl font-bold mb-6 text-primary">Get in Touch</h2>
          <p className="mb-6 text-neutral-dark">
            Have questions or need assistance? We’re here to help!
          </p>

          <div className="space-y-6">
            {/* Email */}
            <div>
              <h3 className="text-xl font-semibold text-primary">Email:</h3>
              <p className="text-neutral-dark">info@rentcars.com</p>
            </div>


          
          </div>

          <p className="mt-8 text-neutral">We look forward to hearing from you!</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
