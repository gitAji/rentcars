import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data: carCarTypes, error: carCarTypesError } = await supabase
      .from('car_car_types')
      .select('car_type_id');

    if (carCarTypesError) {
      console.error("Supabase error fetching car_car_types:", carCarTypesError);
      throw carCarTypesError;
    }

    const carTypeIds = carCarTypes.map((cct) => cct.car_type_id);
    const uniqueCarTypeIds = [...new Set(carTypeIds)];

    const { data: carTypes, error } = await supabase
      .from('car_types')
      .select('id, name')
      .in('id', uniqueCarTypeIds);

    if (error) {
      console.error("Supabase error fetching car types:", error);
      throw error;
    }

    return NextResponse.json(carTypes);
  } catch (error: any) {
    console.error('Error in GET /api/car-types:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
