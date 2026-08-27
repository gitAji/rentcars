import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getErrorMessage } from '@/lib/errorMessage';

export async function GET() {
  try {
    const { data: extras, error } = await supabase.from('extras').select('*');

    if (error) {
      throw error;
    }

    return NextResponse.json(extras);
  } catch (error: unknown) {
    console.error('Error fetching extras:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: getErrorMessage(error) }, { status: 500 });
  }
}
