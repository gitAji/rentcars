'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import withAuth from '@/components/withAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loading from '@/components/loading';
import { useLanguage } from '@/context/LanguageContext';
import { FaCalendarAlt, FaExclamationTriangle, FaClipboardList } from 'react-icons/fa';

interface Booking {
  id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  // We can join with the cars table to get car details if needed
}

function DashboardPage() {
  const { t } = useLanguage();
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
          {t('dashboard_hero_title')}
        </h1>
      </section>
      <main className="flex-grow container mx-auto p-4 sm:p-8">
        <h2 className="text-3xl font-bold mb-6 text-primary">{t('dashboard_my_bookings')}</h2>

        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-600">
            <FaExclamationTriangle className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 text-gray-400 mb-4">
              <FaClipboardList size={24} />
            </div>
            <p className="text-neutral-dark">{t('dashboard_no_bookings')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div
                key={booking.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-sm text-gray-500">{t('dashboard_booking_id')}</p>
                  <p className="text-lg font-bold text-gray-800">#{booking.id}</p>
                  <p className="flex items-center gap-2 text-sm text-neutral-dark mt-1">
                    <FaCalendarAlt className="text-accent shrink-0" />
                    {booking.start_date} — {booking.end_date}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm text-gray-500">{t('dashboard_total_price')}</p>
                  <p className="text-xl font-bold text-primary">kr{booking.total_price}</p>
                </div>
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
