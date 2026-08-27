"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchForm from "../components/SearchForm";
import Loading from "../components/loading"; // Added import
import { useLanguage } from "../context/LanguageContext";

import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0); // Moved here

  const testimonials = [
    {
      quote: "We rented the car for four days and had a very smooth and pleasent experience. The car was in perfect condition and the owner was very kind, responsive and not least flexible when we needed to change the return time of the car. Can highly recommend! ",
      author: "Laura B",
    },
    {
      quote: "Everything went well ! The car was conform to the description.Thank you very much for your flexibility :)",
      author: "Gwendoline R",
    },
    {
      quote: "Very nice rental experience, the car worked perfectly fine, and the owner was always available when needed.",
      author: "Rachele S",
    },
  ];

  useEffect(() => { // Added useEffect for loading simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate 1 second loading time
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex(
        (prevIndex) => (prevIndex + 1) % testimonials.length
      );
    }, 5000); // Change testimonial every 5 seconds
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (isLoading) { // Conditional rendering for loading
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  type SearchFilters = {
    town?: string;
    passengers?: string;
    carType?: string;
    startDate?: string;
    endDate?: string;
  };

  const handleSearch = (filters: SearchFilters) => {
    const query = new URLSearchParams({
      ...(filters.town && { town: filters.town }),
      ...(filters.passengers && { passengers: filters.passengers }),
      ...(filters.carType && { carType: filters.carType }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
    }).toString();
    router.push(`/cars?${query}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-neutral">
      <Header />
      <main className="flex-grow min-h-screen">
        {/* Hero Section */}
        <section
          className="relative min-h-[calc(100vh-100px)] bg-cover bg-center flex flex-col items-center justify-center text-neutral pt-40 sm:pt-48 md:pt-56 pb-16 overflow-hidden"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        >
          {/* Scrim so the white heading stays readable over a bright photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

          <div className="relative z-10 text-center p-4 max-w-5xl mx-auto flex flex-col items-center justify-center flex-grow text-white">
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold tracking-wide uppercase">
              {t('hero_badge')}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg text-white">{t('hero_title')}</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow-md">
              {t('hero_subtitle')}
            </p>
            <div className="relative z-10 w-full flex justify-center">
              <SearchForm onSearch={handleSearch} />
            </div>
          </div>
        </section>

        <section className="py-24 bg-secondary text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">{t('why_choose_title')}</h2>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 shadow-lg rounded-lg bg-gray-50 transform transition-transform duration-300 hover:scale-105">
              <div className="text-6xl mb-4 text-accent">🚗</div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">{t('why_choose_wide_title')}</h3>
              <p className="text-neutral-light text-lg">
                {t('why_choose_wide_desc')}
              </p>
            </div>
            <div className="p-8 shadow-lg rounded-lg bg-gray-50 transform transition-transform duration-300 hover:scale-105">
              <div className="text-6xl mb-4 text-accent">💰</div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">{t('why_choose_price_title')}</h3>
              <p className="text-neutral-light text-lg">
                {t('why_choose_price_desc')}
              </p>
            </div>
            <div className="p-8 shadow-lg rounded-lg bg-gray-50 transform transition-transform duration-300 hover:scale-105">
              <div className="text-6xl mb-4 text-accent">⚡</div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">{t('why_choose_support_title')}</h3>
              <p className="text-neutral-light text-lg">
                {t('why_choose_support_desc')}
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-secondary text-neutral">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl">
            <div className="md:w-1/2 w-full p-6">
              <h2 className="text-4xl font-bold mb-6 text-gray-800">{t('explore_title')}</h2>
              <p className="text-lg text-neutral-dark mb-8">
                {t('explore_desc')}
              </p>
              <button
                onClick={() => router.push("/cars")}
                className="btn-primary"
              >
                {t('book_now')}
              </button>
            </div>
            <div className="md:w-1/2 w-full">
              <Image
                src="/intro.png"
                alt="A car"
                width={500}
                height={300}
                className="rounded-lg shadow-lg w-full h-auto object-cover transform transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </section>

        <section className="py-24 bg-secondary text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">{t('testimonials_title')}</h2>
          <div className="container mx-auto max-w-4xl relative">
            {testimonials.map((testimonial, index) => (
              <blockquote
                key={index}
                className={`bg-gray-50 p-8 rounded-lg shadow-lg text-gray-600 italic transition-opacity duration-500 ${index === currentTestimonialIndex ? 'opacity-100 block' : 'opacity-0 hidden'}`}
              >
                “{testimonial.quote}”
                <footer className="mt-4 text-right font-semibold text-gray-800">— {testimonial.author}</footer>
              </blockquote>
            ))}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonialIndex(index)}
                  className={`h-3 w-3 rounded-full cursor-pointer ${index === currentTestimonialIndex ? 'bg-[#ff5757]' : 'bg-gray-300'} focus:outline-none`}
                ></button>
              ))}
            </div>
          </div>
        </section>

        
      </main>
      <Footer />
    </div>
  );
}
