'use client';  
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface CarCardProps {
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    image_url: string;
    seats: number;
    carType?: string[]; // Changed to array of strings
    shortDescription: string;
  };
  startDate: string;
  endDate: string;
}

export default function CarCard({ car, startDate, endDate }: CarCardProps) {
  const [imageSrc, setImageSrc] = useState(car.image_url || '/default-car-hero.jpg');

  const handleImageError = () => {
    setImageSrc('/car-icon.png'); // Fallback to a generic car icon
  };

  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 0; // Return 0 if any of the dates is invalid
      }
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const days = calculateDays();
  const estimatedTotal = days * (Number(car.price) || 0); // Ensure price is a number

  return (
    <Link href={`/cars/${car.id}?startDate=${startDate}&endDate=${endDate}`} className="block border border-gray-200 rounded-lg shadow-md bg-white text-neutral cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden">
      <Image 
        src={imageSrc} 
        alt={`${car.make || 'Car'} ${car.model || 'Model'}`} 
        width={500} 
        height={300} 
        className="w-full h-48 object-cover" 
        priority={!car.image_url} 
        unoptimized
        onError={handleImageError}
      />
      <div className="p-4">
        <h2 className="text-2xl font-bold text-primary mb-1">{car.make} {car.model}</h2>
        <p className="text-neutral-light text-sm mb-3">{car.year}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-neutral-light">
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center text-neutral-light">
            {car.carType && car.carType.length > 0 && (
              <span className="text-sm font-medium">{car.carType.join(", ")}</span>
            )}
          </div>
        </div>

        <p className="text-neutral-light text-sm mb-4">{car.shortDescription}</p>

        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-extrabold text-accent">kr{car.price}<span className="text-base font-normal text-neutral-light">/day</span></p>
          {days > 0 && (
            <div className="text-right">
              <p className="text-neutral text-sm">{days} day{days > 1 ? 's' : ''} selected.</p>
              <p className="text-xl font-semibold text-primary">Total: kr{estimatedTotal.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}