import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data: cars, error } = await supabase
      .from('cars')
      .select('town');

    if (error) {
      console.error("Supabase error fetching towns:", error);
      throw error;
    }

    const towns = cars.map((car) => car.town).filter(Boolean);
    const uniqueTowns = [...new Set(towns)];

    return NextResponse.json(uniqueTowns);
  } catch (error: unknown) {
    console.error('Error in GET /api/towns:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error', details: 'An unknown error occurred.' }, { status: 500 });
  }
}