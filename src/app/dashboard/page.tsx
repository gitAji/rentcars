'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import withAuth from '@/components/withAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loading from '@/components/loading';

interface Booking {
  id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  // We can join with the cars table to get car details if needed
}

function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) {
          setError(error.message);
        } else {
          setBookings(data);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="relative h-48 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/02.png')" }}
      >
        <Header />
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-4xl text-white font-bold">
          My Dashboard
        </h1>
      </section>
      <main className="flex-grow container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6 text-primary">My Bookings</h2>
        {error && <p className="text-red-500">{error}</p>}
        {bookings.length === 0 ? (
          <p>You have no bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold">Booking ID: {booking.id}</h2>
                <p>Dates: {booking.start_date} to {booking.end_date}</p>
                <p>Total Price: kr{booking.total_price}</p>
                {/* Add more booking details here */}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default withAuth(DashboardPage);
