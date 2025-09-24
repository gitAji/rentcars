'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import withAdminAuth from '@/components/withAdminAuth';
import Loading from '@/components/loading';

interface Booking {
  id: number;
  car_id: number;
  user_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  extras: string[];
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  driver_license: string;
  instructions: string;
}

function EditBookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const bookingId = params.id;

  const [carId, setCarId] = useState<number | ''>('');
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState<number | ''>('');
  const [extras, setExtras] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [instructions, setInstructions] = useState('');

  const [loadingData, setLoadingData] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      const { data: booking, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (error) {
        setError(error.message);
      } else if (booking) {
        setCarId(booking.car_id);
        setUserId(booking.user_id);
        setStartDate(booking.start_date);
        setEndDate(booking.end_date);
        setTotalPrice(booking.total_price);
        setExtras(booking.extras || []);
        setCustomerName(booking.customer_name);
        setCustomerEmail(booking.customer_email);
        setCustomerPhone(booking.customer_phone || '');
        setDriverLicense(booking.driver_license || '');
        setInstructions(booking.instructions || '');
      }
      setLoadingData(false);
    };

    fetchBooking();
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.from('bookings').update({
        car_id: carId,
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        extras,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        driver_license: driverLicense,
        instructions,
      }).eq('id', bookingId);

      if (updateError) throw updateError;

      alert('Booking updated successfully!');
      router.push('/admin/bookings'); // Redirect to manage bookings page

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingData) {
    return <Loading />;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Booking</h1>
      {error && <p className="text-red-500 py-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="bookingId" className="block text-sm font-medium text-gray-700">Booking ID</label>
            <input type="text" id="bookingId" value={bookingId} disabled className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-100" />
          </div>
          <div>
            <label htmlFor="carId" className="block text-sm font-medium text-gray-700">Car ID</label>
            <input type="number" id="carId" value={carId} onChange={(e) => setCarId(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID</label>
            <input type="text" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700">Total Price</label>
            <input type="number" id="totalPrice" value={totalPrice} onChange={(e) => setTotalPrice(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input type="text" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">Customer Email</label>
            <input type="email" id="customerEmail" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">Customer Phone</label>
            <input type="tel" id="customerPhone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="driverLicense" className="block text-sm font-medium text-gray-700">Driver License</label>
            <input type="text" id="driverLicense" value={driverLicense} onChange={(e) => setDriverLicense(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
            <textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
          </div>
          {/* Extras - will need a more complex component */}
          <div>
            <label htmlFor="extras" className="block text-sm font-medium text-gray-700">Extras (comma-separated)</label>
            <input type="text" id="extras" value={extras.join(', ')} onChange={(e) => setExtras(e.target.value.split(',').map(s => s.trim()))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loadingSubmit}
          className="w-full px-4 py-3 font-bold text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50 cursor-pointer"
        >
          {loadingSubmit ? 'Updating Booking...' : 'Save Changes'}
        </button>
      </form>
    </>
  );
}

export default withAdminAuth(EditBookingPage);
