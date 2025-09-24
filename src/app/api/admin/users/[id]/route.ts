import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use the service role key
);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id: userId } = params;
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id: userId } = (params as any);

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
