'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import withAdminAuth from '@/components/withAdminAuth';
import Loading from '@/components/loading';
import Link from 'next/link';
import { FaEdit, FaTrash, FaExclamationTriangle, FaClipboardList } from 'react-icons/fa';

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

      {error && (
        <div className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-600">
          <FaExclamationTriangle className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by Customer Name or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <select
          value={filterCarId}
          onChange={(e) => setFilterCarId(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Start Date Filter"
        />
        <input
          type="date"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="End Date Filter"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Dates</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Total Price</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FaClipboardList size={28} className="text-gray-300" />
                      No bookings found.
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${index % 2 === 1 ? 'bg-gray-50/50' : ''}`}
                  >
                    <td className="p-4 text-gray-600">#{booking.id}</td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-800">{booking.customer_name}</span>
                      <br />
                      <span className="text-sm text-gray-500">{booking.customer_email}</span>
                    </td>
                    <td className="p-4 text-gray-600">{booking.start_date} to {booking.end_date}</td>
                    <td className="p-4 font-semibold text-gray-800">kr{booking.total_price}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <Link href={`/admin/bookings/${booking.id}/edit`} className="flex items-center gap-1.5 text-blue-600 hover:underline text-sm font-medium">
                          <FaEdit size={13} /> Edit
                        </Link>
                        <button onClick={() => handleDelete(booking.id)} className="flex items-center gap-1.5 text-red-500 hover:underline text-sm font-medium cursor-pointer">
                          <FaTrash size={13} /> Delete
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
              Previous
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
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default withAdminAuth(BookingsPage);
