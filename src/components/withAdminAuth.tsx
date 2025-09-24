'use client';

import { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Loading from '@/components/loading';

export default function withAdminAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const WithAdminAuth = (props: P) => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAdmin = async () => {
        console.log("Checking admin status...");
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          console.log("No session found, redirecting to login.");
          router.replace('/login');
          return;
        }

        console.log("Session found for user:", session.user.id);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        console.log("Profile data:", profile);
        console.log("Error fetching profile:", error);

        if (error || !profile || profile.role !== 'admin') {
          console.log("User is not an admin, redirecting.");
          router.replace('/'); // Redirect non-admins to home page
        } else {
          console.log("User is an admin.");
          setIsAdmin(true);
          setLoading(false);
        }
      };

      checkAdmin();
    }, [router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <Loading />
        </div>
      );
    }

    if (isAdmin) {
      return <WrappedComponent {...props} />;
    }

    return null; // Or a fallback component
  };

  return WithAdminAuth;
}
