'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import withAdminAuth from '@/components/withAdminAuth';
import Loading from '@/components/loading';
import { FaCar, FaBook } from 'react-icons/fa';

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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      {error && <p className="text-red-500 py-4">{error}</p>}
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FaCar size={40} className="text-blue-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Total Cars</p>
            <p className="text-3xl font-bold">{carCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FaBook size={40} className="text-green-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-3xl font-bold">{bookingCount}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Bookings</h2>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map(booking => (
              <tr key={booking.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{booking.id}</td>
                <td className="p-4">{booking.customer_name}</td>
                <td className="p-4">{new Date(booking.created_at).toLocaleDateString()}</td>
                <td className="p-4">kr{booking.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default withAdminAuth(AdminPage);