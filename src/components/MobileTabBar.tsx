'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaHome, FaCarSide, FaEnvelope, FaUserCircle, FaCog } from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { useLanguage } from '@/context/LanguageContext';

export default function MobileTabBar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async (userId: string) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      setIsAdmin(profile?.role === 'admin');
    };

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdmin(session.user.id);
      } else {
        setIsAdmin(false);
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdmin(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // The admin panel has its own layout/navigation — never show the customer tab bar there.
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const tabs = [
    { href: '/', label: t('nav_home'), icon: FaHome, isActive: pathname === '/' },
    { href: '/cars', label: t('nav_cars'), icon: FaCarSide, isActive: pathname === '/cars' || pathname?.startsWith('/cars/') },
    { href: '/contact', label: t('nav_contact'), icon: FaEnvelope, isActive: pathname === '/contact' },
    isAdmin
      ? { href: '/admin', label: t('nav_admin_panel'), icon: FaCog, isActive: pathname === '/admin' }
      : user
      ? { href: '/dashboard', label: t('nav_dashboard'), icon: FaUserCircle, isActive: pathname === '/dashboard' }
      : { href: '/login', label: t('nav_login'), icon: FaUserCircle, isActive: pathname === '/login' || pathname === '/signup' },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
      role="navigation"
      aria-label="Primary"
    >
      <div className="grid grid-cols-4">
        {tabs.map(({ href, label, icon: Icon, isActive }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[3.25rem] text-xs font-medium transition-colors active:bg-gray-50 ${
              isActive ? 'text-accent' : 'text-gray-500'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
