'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import withAdminAuth from '@/components/withAdminAuth';
import Loading from '@/components/loading';
import Image from 'next/image';
import Link from 'next/link';

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  town: string;
  image_url: string;
  image_urls: string[];
  car_type: string;
}

function ManageCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTown, setFilterTown] = useState('');
  const [filterCarType, setFilterCarType] = useState('');
  const [townOptions, setTownOptions] = useState<string[]>([]);
  const [carTypeOptions, setCarTypeOptions] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can adjust this value
  const [totalCount, setTotalCount] = useState(0);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const limit = itemsPerPage;

      let query = supabase.from('cars').select('id, make, model, year, price, town, image_url, image_urls, car_type', { count: 'exact' });

      if (searchTerm) {
        query = query.or(`make.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);
      }
      if (filterTown) {
        query = query.eq('town', filterTown);
      }
      if (filterCarType) {
        query = query.eq('car_type', filterCarType);
      }

      const { data, count, error } = await query.range(offset, offset + limit - 1);

      if (error) {
        throw error;
      } else {
        setCars(data || []);
        setTotalCount(count || 0);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        console.error("Fetch cars error:", err);
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, filterTown, filterCarType]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const { data: townsData, error: townsError } = await supabase
          .from('cars')
          .select('town');
        if (townsError) throw townsError;
        setTownOptions(Array.from(new Set(townsData.map(item => item.town).filter(Boolean))));

        const { data: carTypesData, error: carTypesError } = await supabase
          .from('cars')
          .select('car_type');
        if (carTypesError) throw carTypesError;
        setCarTypeOptions(Array.from(new Set(carTypesData.map(item => item.car_type).filter(Boolean))));

      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching filter options:", err.message);
        } else {
          console.error("Error fetching filter options: An unknown error occurred.");
        }
      }
    };
    fetchFilterOptions();
  }, []);

  const handleDelete = async (carToDelete: Car) => {
    if (window.confirm(`Are you sure you want to delete the ${carToDelete.make} ${carToDelete.model}?`)) {
      try {
        if (carToDelete.image_urls && carToDelete.image_urls.length > 0) {
          const filePaths = carToDelete.image_urls.map(url => {
            const parts = url.split('/');
            return parts.slice(parts.length - 2).join('/');
          });
          const { error: storageError } = await supabase.storage.from('car_images').remove(filePaths);
          if (storageError) {
            throw storageError;
          }
        }

        const { error: dbError } = await supabase
          .from('cars')
          .delete()
          .eq('id', carToDelete.id);

        if (dbError) {
          throw dbError;
        }

        // Re-fetch cars to update pagination correctly
        fetchCars();

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      }
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Fleet</h1>
      {error && <p className="text-red-500 py-4">{error}</p>}

      <div className="mb-6 p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by Make or Model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md flex-grow"
        />
        <select
          value={filterTown}
          onChange={(e) => setFilterTown(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Towns</option>
          {townOptions.map(town => (
            <option key={town} value={town}>{town}</option>
          ))}
        </select>
        <select
          value={filterCarType}
          onChange={(e) => setFilterCarType(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Car Types</option>
          {carTypeOptions.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">Image</th>
              <th className="p-4">Make & Model</th>
              <th className="p-4">Year</th>
              <th className="p-4">Town</th>
              <th className="p-4">Price</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">No cars found.</td>
              </tr>
            ) : (
              cars.map(car => {
                console.log(`Car ID: ${car.id}, Image URL: ${car.image_url}`);
                return (
                <tr key={car.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {car.image_url ? (
                      <Image src={car.image_url} alt={`${car.make} ${car.model}`} width={100} height={60} className="rounded-md object-cover" />
                    ) : (
                      <Image src="/default-car-hero.jpg" alt="No image available" width={100} height={60} className="rounded-md object-cover" />
                    )}
                  </td>
                  <td className="p-4 font-semibold">{car.make} {car.model}</td>
                  <td className="p-4">{car.year}</td>
                  <td className="p-4">{car.town}</td>
                  <td className="p-4">kr{car.price}</td>
                  <td className="p-4">
                    <Link href={`/admin/cars/${car.id}/edit`} className="text-blue-500 hover:underline mr-4">Edit</Link>
                    <button onClick={() => handleDelete(car)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              )})
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default withAdminAuth(ManageCarsPage);
