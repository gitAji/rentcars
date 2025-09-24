import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: carId } = params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start date and end date are required' }, { status: 400 });
    }

    // Check for overlapping bookings
    const { data: overlappingBookings, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('car_id', carId)
      .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

    if (error) {
      throw error;
    }

    const isAvailable = !(overlappingBookings && overlappingBookings.length > 0);

    return NextResponse.json({ available: isAvailable });

  } catch (error: any) {
    console.error('Error checking car availability:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
