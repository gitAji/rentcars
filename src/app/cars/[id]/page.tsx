












import { Suspense } from "react";
import Loading from "@/components/loading";

import CarDetailsContent from "./CarDetailsContent";

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
}

export default async function CarDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  let car: Car | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cars/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch car: ${res.status}`);
    }
    car = await res.json();
  } catch (e: unknown) {

    error = (e as Error).message || "Failed to load car details";
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-accent">Error: {error}</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-primary">Car not found.</p>
      </div>
    );
  }


  return (
    <Suspense fallback={<Loading />}>


      <CarDetailsContent car={car} id={id} />
    </Suspense>
  );
}


