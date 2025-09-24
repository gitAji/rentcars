'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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
          <Link href="/" className="hover:text-gray-300 font-semibold cursor-pointer">Home</Link>
          <Link href="/about" className="hover:text-gray-300 font-semibold cursor-pointer">About</Link>
          <Link href="/cars" className="hover:text-gray-300 font-semibold cursor-pointer">Cars</Link>
          <Link href="/contact" className="hover:text-gray-300 font-semibold cursor-pointer">Contact</Link>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center hover:text-gray-300 font-semibold cursor-pointer">
                <FaUserCircle size={24} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-black">
                  <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100">Dashboard</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hover:text-gray-300 font-semibold cursor-pointer">Login</Link>
          )}
        </nav>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="cursor-pointer"
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
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <nav className="flex flex-col items-center gap-8" role="navigation">
              <Link href="/" className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer" onClick={() => setIsOpen(false)}>Home</Link>
              <Link href="/about" className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer" onClick={() => setIsOpen(false)}>About</Link>
              <Link href="/cars" className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer" onClick={() => setIsOpen(false)}>Cars</Link>
              <Link href="/contact" className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer" onClick={() => setIsOpen(false)}>Contact</Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer flex items-center" onClick={() => setIsOpen(false)}>
                    <FaUserCircle className="mr-2" />
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer">Logout</button>
                </>
              ) : (
                <Link href="/login" className="text-2xl text-white hover:text-gray-300 font-semibold cursor-pointer" onClick={() => setIsOpen(false)}>Login</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
