'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { FaUserCircle, FaCog } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50 p-4">
      <div className="container mx-auto flex justify-between items-center text-white">
        <Link href="/" className="z-50 cursor-pointer">
          <div className="relative h-16 w-40 sm:h-20 sm:w-48 md:h-24 md:w-64">
            <Image src="/logo.png" alt="RentCars Logo" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain" priority />
          </div>
        </Link>
        <nav className="hidden md:flex gap-8 items-center" role="navigation">
          <Link href="/" className="hover:text-gray-300 font-semibold cursor-pointer">{t('nav_home')}</Link>
          <Link href="/about" className="hover:text-gray-300 font-semibold cursor-pointer">{t('nav_about')}</Link>
          <Link href="/cars" className="hover:text-gray-300 font-semibold cursor-pointer">{t('nav_cars')}</Link>
          <Link href="/contact" className="hover:text-gray-300 font-semibold cursor-pointer">{t('nav_contact')}</Link>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center hover:text-gray-300 font-semibold cursor-pointer">
                <FaUserCircle size={24} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-black">
                  <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100">{t('nav_dashboard')}</Link>
                  {isAdmin && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                      <FaCog size={13} /> {t('nav_admin_panel')}
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">{t('nav_logout')}</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hover:text-gray-300 font-semibold cursor-pointer">{t('nav_login')}</Link>
          )}
          <LanguageSwitcher />
        </nav>
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={t('nav_open_menu')}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="cursor-pointer p-2 -m-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        {isOpen && (
          <div id="mobile-menu" className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white cursor-pointer"
              aria-label={t('nav_close_menu')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <nav className="flex flex-col items-center gap-8" role="navigation">
              <Link href="/" className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer" onClick={() => setIsOpen(false)}>{t('nav_home')}</Link>
              <Link href="/about" className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer" onClick={() => setIsOpen(false)}>{t('nav_about')}</Link>
              <Link href="/cars" className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer" onClick={() => setIsOpen(false)}>{t('nav_cars')}</Link>
              <Link href="/contact" className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer" onClick={() => setIsOpen(false)}>{t('nav_contact')}</Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer flex items-center" onClick={() => setIsOpen(false)}>
                    <FaUserCircle className="mr-2" />
                    {t('nav_dashboard')}
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer flex items-center" onClick={() => setIsOpen(false)}>
                      <FaCog className="mr-2" />
                      {t('nav_admin_panel')}
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer">{t('nav_logout')}</button>
                </>
              ) : (
                <Link href="/login" className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer" onClick={() => setIsOpen(false)}>{t('nav_login')}</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
