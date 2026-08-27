'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import withAdminAuth from '@/components/withAdminAuth';
import Loading from '@/components/loading';
import Image from 'next/image';
import Link from 'next/link';
import { FaEdit, FaTrash, FaExclamationTriangle, FaCarSide, FaPlus } from 'react-icons/fa';
import { getErrorMessage } from '@/lib/errorMessage';
import { useLanguage } from '@/context/LanguageContext';

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  town: string;
  image_url: string;
  image_urls: string[];
  
}

function ManageCarsPage() {
  const { t } = useLanguage();
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

      let query = supabase.from('cars').select('id, make, model, year, price, town, image_url, image_urls', { count: 'exact' });

      if (searchTerm) {
        query = query.or(`make.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);
      }
      if (filterTown) {
        query = query.eq('town', filterTown);
      }
      

      const { data, count, error } = await query.range(offset, offset + limit - 1);

      if (error) {
        throw error;
      } else {
        setCars(data || []);
        setTotalCount(count || 0);
      }
    } catch (err: unknown) {
      console.error("Fetch cars error:", err);
      setError(getErrorMessage(err));
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

        

      } catch (err: unknown) {
        console.error("Error fetching filter options:", getErrorMessage(err));
      }
    };
    fetchFilterOptions();
  }, []);

  const handleDelete = async (carToDelete: Car) => {
    if (window.confirm(t('admin_confirm_delete_car', { car: `${carToDelete.make} ${carToDelete.model}` }))) {
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
        setError(getErrorMessage(err));
      }
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('admin_nav_manage_fleet')}</h1>
        <Link
          href="/admin/cars/new"
          className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-accent-dark transition-colors"
        >
          <FaPlus size={12} /> {t('admin_nav_add_car')}
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-600">
          <FaExclamationTriangle className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder={t('admin_search_make_model_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <select
          value={filterTown}
          onChange={(e) => setFilterTown(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">{t('admin_all_towns')}</option>
          {townOptions.map(town => (
            <option key={town} value={town}>{town}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-600">{t('admin_th_image')}</th>
                <th className="p-4 text-sm font-semibold text-gray-600">{t('admin_th_make_model')}</th>
                <th className="p-4 text-sm font-semibold text-gray-600">{t('admin_th_year')}</th>
                <th className="p-4 text-sm font-semibold text-gray-600">{t('admin_th_town')}</th>
                <th className="p-4 text-sm font-semibold text-gray-600">{t('admin_th_price')}</th>
                <th className="p-4 text-sm font-semibold text-gray-600">{t('admin_th_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {cars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FaCarSide size={28} className="text-gray-300" />
                      {t('admin_no_cars_found')}
                    </div>
                  </td>
                </tr>
              ) : (
                cars.map((car, index) => (
                  <tr
                    key={car.id}
                    className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${index % 2 === 1 ? 'bg-gray-50/50' : ''}`}
                  >
                    <td className="p-4">
                      {car.image_url ? (
                        <Image src={car.image_url} alt={`${car.make} ${car.model}`} width={100} height={60} className="rounded-md object-cover" />
                      ) : (
                        <Image src="/default-car-hero.jpg" alt="No image available" width={100} height={60} className="rounded-md object-cover" />
                      )}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">{car.make} {car.model}</td>
                    <td className="p-4 text-gray-600">{car.year}</td>
                    <td className="p-4 text-gray-600">{car.town}</td>
                    <td className="p-4 font-semibold text-gray-800">kr{car.price}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <Link href={`/admin/cars/${car.id}/edit`} className="flex items-center gap-1.5 text-blue-600 hover:underline text-sm font-medium">
                          <FaEdit size={13} /> {t('admin_edit')}
                        </Link>
                        <button onClick={() => handleDelete(car)} className="flex items-center gap-1.5 text-red-500 hover:underline text-sm font-medium cursor-pointer">
                          <FaTrash size={13} /> {t('admin_delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-6 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('admin_previous')}
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === index + 1 ? 'bg-accent text-white border-accent' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('admin_next')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default withAdminAuth(ManageCarsPage);
