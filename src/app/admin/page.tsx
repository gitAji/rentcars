'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import withAdminAuth from '@/components/withAdminAuth';
import Loading from '@/components/loading';
import Link from 'next/link';
import { FaCar, FaBook, FaExclamationTriangle, FaPlus, FaList } from 'react-icons/fa';

interface Booking {
  id: number;
  customer_name: string;
  total_price: number;
  created_at: string;
}

function AdminPage() {
  const [carCount, setCarCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { count: cars } = await supabase
          .from('cars')
          .select('id', { count: 'exact', head: true });

        const { count: bookings } = await supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true });

        const { data: recent, error: recentError } = await supabase
          .from('bookings')
          .select('id, customer_name, total_price, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentError) throw recentError;

        setCarCount(cars || 0);
        setBookingCount(bookings || 0);
        setRecentBookings(recent || []);

      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your fleet and bookings.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-600">
          <FaExclamationTriangle className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href="/admin/cars/new"
          className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-accent-dark transition-colors"
        >
          <FaPlus size={12} /> Add New Car
        </Link>
        <Link
          href="/admin/cars"
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          <FaCar size={14} /> Manage Fleet
        </Link>
        <Link
          href="/admin/bookings"
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          <FaList size={14} /> View All Bookings
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-500 shrink-0">
            <FaCar size={26} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Cars</p>
            <p className="text-3xl font-bold text-gray-800">{carCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-50 text-green-500 shrink-0">
            <FaBook size={26} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-800">{bookingCount}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Bookings</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {recentBookings.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${index % 2 === 1 ? 'bg-gray-50/50' : ''}`}
                  >
                    <td className="p-4 text-gray-500">#{booking.id}</td>
                    <td className="p-4 font-medium text-gray-800">{booking.customer_name}</td>
                    <td className="p-4 text-gray-500">{new Date(booking.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-semibold text-gray-800">kr{booking.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default withAdminAuth(AdminPage);
