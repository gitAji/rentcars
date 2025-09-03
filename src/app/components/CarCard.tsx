import Image from 'next/image';
import Link from 'next/link';

interface CarCardProps {
  car: {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    imageUrl: string;
  };
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <Image src={car.imageUrl} alt={`${car.make} ${car.model}`} width={500} height={300} className="w-full h-48 md:h-56 object-cover mb-4 rounded" />
      <h2 className="text-lg md:text-xl font-semibold">{car.make} {car.model}</h2>
      <p className="text-gray-600">{car.year}</p>
      <p className="text-base md:text-lg font-bold">${car.price}/day</p>
      <Link href={`/cars/${car.id}`} className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">View Details</Link>
    </div>
  );
}
