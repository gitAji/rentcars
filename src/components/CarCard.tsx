import Link from 'next/link';

interface CarCardProps {
  car: {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    imageUrl: string;
    seats: number;
    carType: string;
    shortDescription: string;
  };
  startDate: string;
  endDate: string;
}

export default function CarCard({ car, startDate, endDate }: CarCardProps) {
  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const days = calculateDays();
  const estimatedTotal = days * car.price;

  return (
    <Link href={`/cars/${car.id}?startDate=${startDate}&endDate=${endDate}`} className="block border border-gray-200 rounded-lg shadow-md bg-white text-neutral cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden">
      <img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-2xl font-bold text-primary mb-1">{car.make} {car.model}</h2>
        <p className="text-neutral-light text-sm mb-3">{car.year}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-neutral-light">
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" fillRule="evenodd"></path></svg>
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center text-neutral-light">
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v6h8V6z" clipRule="evenodd" fillRule="evenodd"></path></svg>
            <span>{car.carType}</span>
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