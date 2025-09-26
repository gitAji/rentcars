import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request, context: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const { id } = context.params;

    const { data: car, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single(); // Use .single() to get a single record

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return new NextResponse('Car not found', { status: 404 });
      }
      throw error;
    }

    if (!car) {
      return new NextResponse('Car not found', { status: 404 });
    }

    const { data: carTypeData, error: carTypeError } = await supabase
      .from('car_car_types')
      .select('car_types(name)')
      .eq('car_id', car.id);

    if (carTypeError) {
      throw carTypeError;
    }

    const carTypeNames = carTypeData
      ? carTypeData.flatMap((ct) => {
          if (Array.isArray(ct.car_types)) {
            return ct.car_types.map((type) => type.name);
          }
          return [];
        })
      : [];

    const formattedCar = {
      ...car,
      imageUrl: car.image_url,
      imageUrls: car.image_urls,
      carType: carTypeNames,
      shortDescription: car.short_description,
    };

    return NextResponse.json(formattedCar);
  } catch (error: unknown) {
    console.error('Error in GET /api/cars/[id]:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error', details: 'An unknown error occurred.' }, { status: 500 });
  }
}
