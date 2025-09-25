import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const town = searchParams.get('town');
    const carTypes = searchParams.get('carType')?.split(',');

    let query = supabase.from('cars').select('*');

    if (town) {
      query = query.eq('town', town);
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

        interface CarTypeData {
          car_types: { name: string }[];
        }
        const carTypeNames = carTypeData ? carTypeData.flatMap((ct: CarTypeData) => ct.car_types.map(type => type.name)) : [];

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