import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const town = searchParams.get('town');
    const passengers = searchParams.get('passengers');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const carTypes = searchParams.get('carType')?.split(',');

    let query = supabase.from('cars').select('*');

    if (town) {
      query = query.eq('town', town);
    }

    if (passengers) {
      query = query.gte('seats', parseInt(passengers));
    }

    if (startDate && endDate) {
      const { data: bookedCars, error: bookedCarsError } = await supabase
        .from('bookings')
        .select('car_id')
        .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

      if (bookedCarsError) {
        throw bookedCarsError;
      }

      // Cars an admin has manually blocked out (maintenance, an off-platform
      // rental, etc.) for the requested dates should be excluded too.
      const { data: blockedCars, error: blockedCarsError } = await supabase
        .from('car_unavailability')
        .select('car_id')
        .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

      if (blockedCarsError) {
        // The car_unavailability table may not exist yet on older deployments --
        // don't fail the whole search over it, just skip the extra filter.
        console.error('Error checking car_unavailability (table missing?):', blockedCarsError);
      }

      const unavailableCarIds = Array.from(new Set([
        ...bookedCars.map(booking => booking.car_id),
        ...(blockedCars || []).map(block => block.car_id),
      ]));

      if (unavailableCarIds.length > 0) {
        query = query.not('id', 'in', unavailableCarIds);
      }
    }

    if (carTypes && carTypes.length > 0 && carTypes.some(ct => ct !== '')) {
      const { data: carIdsData, error: carIdsError } = await supabase
        .from('car_types')
        .select('car_car_types!inner(car_id)')
        .in('name', carTypes);

      if (carIdsError) {
        throw carIdsError;
      }
      
      const carIds = carIdsData.flatMap(ct => ct.car_car_types).map(cct => cct.car_id);
      
      if (carIds.length === 0) {
        return NextResponse.json([]);
      }

      query = query.in('id', carIds);
    }

    const { data: cars, error } = await query;

    if (error) {
      throw error;
    }

    const carsWithTypes = await Promise.all(
      cars.map(async (car) => {
        const { data: carTypeData, error: carTypeError } = await supabase
          .from('car_car_types')
          .select('car_types(name)')
          .eq('car_id', car.id);

        if (carTypeError) {
          throw carTypeError;
        }

        const carTypeNames = carTypeData ? (carTypeData as any).map((ct: any) => ct.car_types.name) : []; // eslint-disable-line @typescript-eslint/no-explicit-any

        return {
          ...car,
          carType: carTypeNames,
        };
      })
    );

    return NextResponse.json(carsWithTypes);
  } catch (error: unknown) {
    console.error('Error in GET /api/cars:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error', details: 'An unknown error occurred.' }, { status: 500 });
  }
}