'use client';

import { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Loading from '@/components/loading';

export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const WithAuth = (props: P) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.replace('/login');
        } else {
          setIsAuthenticated(true);
          setLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <Loading />
        </div>
      );
    }

    if (isAuthenticated) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  return WithAuth;
}
