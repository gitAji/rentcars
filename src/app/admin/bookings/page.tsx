'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import withAdminAuth from '@/components/withAdminAuth';
import Loading from '@/components/loading';
import Link from 'next/link';

interface Booking {
  id: number;
  car_id: number;
  user_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  customer_name: string;
  customer_email: string;
}

interface CarOption {
  id: number;
  make: string;
  model: string;
}

function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCarId, setFilterCarId] = useState<string | ''>('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [carOptions, setCarOptions] = useState<CarOption[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can adjust this value
  const [totalCount, setTotalCount] = useState(0);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const limit = itemsPerPage;

      let query = supabase.from('bookings').select('*', { count: 'exact' });

      if (searchTerm) {
        query = query.or(`customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%`);
      }
      if (filterCarId) {
        query = query.eq('car_id', filterCarId);
      }
      if (filterStartDate) {
        query = query.gte('start_date', filterStartDate);
      }
      if (filterEndDate) {
        query = query.lte('end_date', filterEndDate);
      }

      const { data, count, error } = await query.range(offset, offset + limit - 1);

      if (error) {
        throw error;
      } else {
        setBookings(data || []);
        setTotalCount(count || 0);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, filterCarId, filterStartDate, filterEndDate]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    const fetchCarOptions = async () => {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('id, make, model')
          .order('make', { ascending: true });
        if (error) throw error;
        setCarOptions(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching car options:", err.message);
        } else {
          console.error("Error fetching car options: An unknown error occurred.");
        }
      }
    };
    fetchCarOptions();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        setError(error.message);
      } else {
        // Re-fetch bookings to update pagination correctly
        fetchBookings();
      }
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Bookings</h1>
      {error && <p className="text-red-500 py-4">{error}</p>}

      <div className="mb-6 p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by Customer Name or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md flex-grow"
        />
        <select
          value={filterCarId}
          onChange={(e) => setFilterCarId(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Cars</option>
          {carOptions.map(car => (
            <option key={car.id} value={car.id}>{car.make} {car.model}</option>
          ))}
        </select>
        <input
          type="date"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
          className="p-2 border rounded-md"
          placeholder="Start Date Filter"
        />
        <input
          type="date"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
          className="p-2 border rounded-md"
          placeholder="End Date Filter"
        />
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Total Price</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No bookings found.</td>
              </tr>
            ) : (
              bookings.map(booking => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{booking.id}</td>
                  <td className="p-4">{booking.customer_name}<br/><span className="text-sm text-gray-500">{booking.customer_email}</span></td>
                  <td className="p-4">{booking.start_date} to {booking.end_date}</td>
                  <td className="p-4">kr{booking.total_price}</td>
                  <td className="p-4">
                    <Link href={`/admin/bookings/${booking.id}/edit`} className="text-blue-500 hover:underline mr-4">Edit</Link>
                    <button onClick={() => handleDelete(booking.id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
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

export default withAdminAuth(BookingsPage);
