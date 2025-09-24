import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data: extras, error } = await supabase.from('extras').select('*');

    if (error) {
      throw error;
    }

    return NextResponse.json(extras);
  } catch (error: any) {
    console.error('Error fetching extras:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
