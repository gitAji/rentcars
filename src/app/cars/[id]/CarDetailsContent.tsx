"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";

// Define interfaces for type safety
interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  imageUrls: string[];
  description?: string;
  features?: string[];
  terms?: string;
  seats: number;
  carType: string[];
  shortDescription: string;
  extra_km_charge?: number | null;
  fuel_missing_charge?: number | null;
  scratch_charge?: number | null;
  damage_policy?: string | null;
  accident_procedure?: string | null;
  glass_cover_policy?: string | null;
}

interface Extra {
  name: string;
  price: number;
}

interface CarDetailsContentProps {
  car: Car;
  id: string;
}

export default function CarDetailsContent({ car, id }: CarDetailsContentProps) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [extrasOptions, setExtrasOptions] = useState<Extra[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [blockedRanges, setBlockedRanges] = useState<{ start_date: string; end_date: string }[]>([]);

  const carImages = useMemo(() => {
    return car.imageUrls && car.imageUrls.length > 0
      ? car.imageUrls
      : car.imageUrl
      ? [car.imageUrl]
      : [];
  }, [car]);

  const goToNextImage = useCallback(() => {
    if (carImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
  }, [carImages.length]);

  const goToPrevImage = useCallback(() => {
    if (carImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + carImages.length) % carImages.length);
  }, [carImages.length]);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const res = await fetch("/api/extras");
        if (!res.ok) {
          throw new Error("Failed to fetch extras. Please make sure you have created the 'extras' table in your Supabase project.");
        }
        const data = await res.json();
        setExtrasOptions(data);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchExtras();
  }, []);

  useEffect(() => {
    const fetchBlockedRanges = async () => {
      // car_unavailability may not exist on older deployments -- fail quietly
      // rather than blocking the whole page if the table isn't there.
      const { data, error: fetchError } = await supabase
        .from('car_unavailability')
        .select('start_date, end_date')
        .eq('car_id', id);
      if (fetchError) {
        console.error('Error fetching blocked dates:', fetchError);
        return;
      }
      setBlockedRanges(data || []);
    };

    fetchBlockedRanges();
  }, [id]);

  const datesUnavailable = useMemo(() => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
    return blockedRanges.some((range) => {
      const blockStart = new Date(range.start_date);
      const blockEnd = new Date(range.end_date);
      return start <= blockEnd && end >= blockStart;
    });
  }, [startDate, endDate, blockedRanges]);

  useEffect(() => {
    if (startDate && endDate && !datesUnavailable) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
        setTotalPrice(0);
        return;
      }
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let price = car.price * diffDays;
      selectedExtras.forEach((extraName) => {
        const extra = extrasOptions.find((e) => e.name === extraName);
        if (extra) {
          price += extra.price * diffDays;
        }
      });
      setTotalPrice(price);
    } else {
      setTotalPrice(0);
    }
  }, [car, startDate, endDate, selectedExtras, extrasOptions, datesUnavailable]);

  

  if (!car) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-neutral-light">{t('cardetails_not_found')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section
        className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${car.imageUrl || "/default-car-hero.jpg"})` }}
      >
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-3xl sm:text-4xl md:text-5xl text-white font-bold">
          {car.make} {car.model}
        </h1>
      </section>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4 font-bold">
          <p className="text-sm text-gray-500">
            <Link href="/" className="hover:underline">{t('nav_home')}</Link> |{' '}
            <Link href="/cars" className="hover:underline">{t('nav_cars')}</Link> |{' '}
            <span>{car.make} {car.model}</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Left Column: Image Gallery, Description, Features, Terms */}
          <div className="md:col-span-2">
            <div className="relative w-full h-96 rounded-lg shadow-lg overflow-hidden mb-4">
                {carImages.length > 0 ? (
                  <Image
                    src={carImages[currentImageIndex]}
                    alt={`Image ${currentImageIndex + 1} of ${car.make} ${car.model}`}
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-500 ease-in-out"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">{t('cardetails_no_image')}</span>
                  </div>
                )}
                {carImages.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevImage}
                      className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-transform transform hover:scale-110"
                      aria-label={t('cardetails_prev_image')}
                    >
                      &#8249;
                    </button>
                    <button
                      onClick={goToNextImage}
                      className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-transform transform hover:scale-110"
                      aria-label={t('cardetails_next_image')}
                    >
                      &#8250;
                    </button>
                  </>
                )}
              </div>
              {carImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {carImages.map((src, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-24 h-16 rounded-md overflow-hidden border-2 ${
                        currentImageIndex === index ? "border-accent" : "border-transparent"
                      } transition-all duration-300`}
                    >
                      <Image
                        src={src}
                        alt={`Thumbnail ${index + 1}`}
                        width={96}
                        height={64}
                        objectFit="cover"
                      />
                    </button>
                  ))}
                </div>
              )}

            <h2 className="text-2xl font-bold mb-2 text-primary mt-8">{t('cardetails_description')}</h2>
            <p className="text-neutral text-base mb-4">
              {car.description ||
                `Discover the features and comfort of the ${car.make} ${car.model}. This car is an excellent choice for your travel needs, offering a blend of performance and style.`}
            </p>
            <h2 className="text-2xl font-bold mb-2 text-primary">{t('cardetails_included_features')}</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-neutral text-base mb-4">
              {car.features && car.features.length > 0 ? (
                car.features.map((feature) => <div key={feature} className="flex items-center"><span className="mr-2 text-accent">•</span>{feature}</div>)
              ) : (
                <>
                  <div className="flex items-center"><span className="mr-2 text-accent">•</span>Air Conditioning</div>
                  <div className="flex items-center"><span className="mr-2 text-accent">•</span>Automatic Transmission</div>
                  <div className="flex items-center"><span className="mr-2 text-accent">•</span>Spacious Interior</div>
                </>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2 text-primary">{t('cardetails_terms')}</h2>
            <p className="text-neutral text-base mb-4">              {car.terms || `Minimum rental age is 21. Valid driver's license required. Fuel policy: full to full,The vehicle must be returned in the same clean condition as delivered. A cleaning fee may apply if the vehicle requires excessive cleaning upon return.`}
            </p>

            {(car.extra_km_charge != null ||
              car.fuel_missing_charge != null ||
              car.scratch_charge != null ||
              car.damage_policy ||
              car.accident_procedure ||
              car.glass_cover_policy) && (
              <>
                <h2 className="text-2xl font-bold mb-2 text-primary">{t('cardetails_policies_title')}</h2>
                {(car.extra_km_charge != null || car.fuel_missing_charge != null || car.scratch_charge != null) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    {car.extra_km_charge != null && (
                      <div className="bg-secondary rounded-lg p-4">
                        <p className="text-sm text-gray-500">{t('cardetails_extra_km_charge')}</p>
                        <p className="text-lg font-semibold text-neutral">kr{car.extra_km_charge}/km</p>
                      </div>
                    )}
                    {car.fuel_missing_charge != null && (
                      <div className="bg-secondary rounded-lg p-4">
                        <p className="text-sm text-gray-500">{t('cardetails_fuel_missing_charge')}</p>
                        <p className="text-lg font-semibold text-neutral">kr{car.fuel_missing_charge}</p>
                      </div>
                    )}
                    {car.scratch_charge != null && (
                      <div className="bg-secondary rounded-lg p-4">
                        <p className="text-sm text-gray-500">{t('cardetails_scratch_charge')}</p>
                        <p className="text-lg font-semibold text-neutral">kr{car.scratch_charge}</p>
                      </div>
                    )}
                  </div>
                )}
                {(car.damage_policy || car.accident_procedure || car.glass_cover_policy) && (
                  <div className="space-y-3 mb-4">
                    {car.damage_policy && (
                      <div>
                        <p className="font-semibold text-neutral">{t('cardetails_damage_policy')}</p>
                        <p className="text-neutral text-base">{car.damage_policy}</p>
                      </div>
                    )}
                    {car.accident_procedure && (
                      <div>
                        <p className="font-semibold text-neutral">{t('cardetails_accident_procedure')}</p>
                        <p className="text-neutral text-base">{car.accident_procedure}</p>
                      </div>
                    )}
                    {car.glass_cover_policy && (
                      <div>
                        <p className="font-semibold text-neutral">{t('cardetails_glass_cover')}</p>
                        <p className="text-neutral text-base">{car.glass_cover_policy}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column: Booking Details */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-secondary p-6 rounded-lg shadow-md">
              <h1 className="text-3xl font-extrabold text-primary mb-2">
                {car.make} {car.model}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{car.shortDescription}</p>
              <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">{t('cardetails_year')}</p>
                  <p className="text-lg font-semibold">{car.year}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">{t('cardetails_seats')}</p>
                  <p className="text-lg font-semibold">{car.seats}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">{t('cardetails_type')}</p>
                  <p className="text-lg font-semibold">{car.carType.join(", ")}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-accent mt-4">
                kr{car.price.toFixed(2)}
                <span className="text-sm font-normal text-gray-500"> {t('cardetails_per_day')}</span>
              </p>
            </div>

            <div className="bg-secondary p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">{t('cardetails_booking_details')}</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="startDate" className="block font-medium text-gray-700 mb-1">
                    {t('search_start_date')}
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => {
                      const newQuery = new URLSearchParams(searchParams.toString());
                      newQuery.set("startDate", e.target.value);
                      router.push(`/cars/${id}?${newQuery.toString()}`);
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block font-medium text-gray-700 mb-1">
                    {t('search_end_date')}
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => {
                      const newQuery = new URLSearchParams(searchParams.toString());
                      newQuery.set("endDate", e.target.value);
                      router.push(`/cars/${id}?${newQuery.toString()}`);
                    }}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
                    aria-required="true"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 mt-4">{error}</p>}
              {datesUnavailable && (
                <p className="text-red-500 mt-4">{t('cardetails_dates_unavailable')}</p>
              )}

              {extrasOptions.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">{t('cardetails_optional_extras')}</h3>
                  <div className="space-y-3">
                    {extrasOptions.map((extra) => (
                      <div key={extra.name} className="flex items-center justify-between">
                        <label htmlFor={extra.name} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={extra.name}
                            value={extra.name}
                            checked={selectedExtras.includes(extra.name)}
                            onChange={(e) => {
                              const val = e.target.value;
                              const checked = e.target.checked;
                              setSelectedExtras((prev) =>
                                checked ? [...prev, val] : prev.filter((x) => x !== val)
                              );
                            }}
                            className="h-5 w-5 text-accent rounded border-gray-300 focus:ring-accent"
                          />
                          <span className="text-gray-700">{extra.name}</span>
                        </label>
                        <span className="font-semibold">kr{extra.price}/day</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-3xl font-bold text-primary text-right">
                  {t('cardetails_total')} kr{totalPrice.toFixed(2)}
                </p>
                <button
                  onClick={() => {
                    if (!startDate || !endDate || totalPrice === 0) {
                      alert(t('cardetails_select_valid_dates_alert'));
                      return;
                    }
                    const query = new URLSearchParams({
                      carId: car.id,
                      startDate,
                      endDate,
                      extras: selectedExtras.join(","),
                      totalPrice: totalPrice.toFixed(2),
                    }).toString();
                    router.push(`/checkout?${query}`);
                  }}
                  className="btn-primary mt-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={totalPrice === 0}
                >
                  {t('cardetails_proceed_checkout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
