import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = (supabaseUrl && supabaseServiceRoleKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

// @ts-expect-error: Next.js API route params type mismatch
export async function PATCH(req: Request, context) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase client not initialized due to missing environment variables.' }, { status: 500 });
  }
  try {
    const { id: userId } = context.params as { id: string };
    const { role: newRole } = await req.json();

    // Update role in profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (profileError) throw profileError;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error updating user role:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to update user role', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to update user role', details: 'An unknown error occurred.' }, { status: 500 });
  }
}

// @ts-expect-error: Next.js API route params type mismatch
export async function DELETE(req: Request, context) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase client not initialized due to missing environment variables.' }, { status: 500 });
  }
  try {
    const { id: userId } = context.params as { id: string };

    // Delete user from auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) throw authError;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting user:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to delete user', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to delete user', details: 'An unknown error occurred.' }, { status: 500 });
  }
}
