"use client";

import { useState, useEffect } from "react"; // Added
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loading from "../../components/loading"; // Added
import { useLanguage } from "../../context/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
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
              <section
        className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/about-hero.jpg')" }} // 👈 Replace with your own image
      >
        <Header />
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-4xl md:text-5xl text-gray-800 sm:text-white font-bold">{t('about_hero_title')}</h1>
      </section>

      {/* Main Content in white */}
                  <main className="bg-secondary flex-grow">
        <div className="container mx-auto p-8">
          <h2 className="text-3xl font-bold mb-6 text-primary">{t('about_who_we_are')}</h2>
          <p className="mb-4 text-neutral-dark">
            {t('about_p1')}
          </p>
          <p className="mb-4 text-neutral-dark">
            {t('about_p2')}
          </p>
          <p className="text-neutral-dark">
            {t('about_p3')}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
