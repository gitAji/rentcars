import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data: extras, error } = await supabase.from('extras').select('*');

    if (error) {
      throw error;
    }

    return NextResponse.json(extras);
  } catch (error: unknown) {
    console.error('Error fetching extras:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Internal Server Error', details: 'An unknown error occurred.' }, { status: 500 });
  }
}
