import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use the service role key
);

export async function GET(_req: Request) { // eslint-disable-line @typescript-eslint/no-unused-vars
  try {
    const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) throw authError;

    const userIds = users.map(user => user.id);

    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, role, full_name')
      .in('id', userIds);
    if (profilesError) throw profilesError;

    const mergedUsers = users.map(authUser => {
      const profile = profiles.find(p => p.id === authUser.id);
      return {
        id: authUser.id,
        email: authUser.email || 'N/A',
        role: profile?.role || 'user',
        full_name: profile?.full_name || 'N/A',
      };
    });

    return NextResponse.json(mergedUsers);
  } catch (error: unknown) {
    console.error('Error listing users:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to list users', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to list users', details: 'An unknown error occurred.' }, { status: 500 });
  }
}
