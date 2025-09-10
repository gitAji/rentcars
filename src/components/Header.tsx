"use client";

import Link from 'next/link';
import { useState } from 'react';

import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0  w-full z-50 p-4">
      <div className="container mx-auto flex justify-between items-center text-white">
        <Link href="/">
          <div className="relative h-16 w-40 sm:h-20 sm:w-50 md:h-24 md:w-60"> {/* Adjust width based on aspect ratio */}
            <Image src="/logo.png" alt="RentCars Logo" layout="fill" objectFit="contain" />
          </div>
        </Link>
        <nav className="hidden md:flex gap-8 items-center" role="navigation">
          <Link href="/" className="hover:text-gray-300 font-semibold">Home</Link>
          <Link href="/cars" className="hover:text-gray-300 font-semibold">Cars</Link>
          <Link href="/about" className="hover:text-gray-300 font-semibold">About</Link>
          <Link href="/contact" className="hover:text-gray-300 font-semibold">Contact</Link>
        </nav>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
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
              className="absolute top-4 right-4 text-white"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <nav className="flex flex-col items-center gap-8" role="navigation">
              <Link href="/" className="text-2xl text-white hover:text-gray-300 font-semibold" onClick={() => setIsOpen(false)}>Home</Link>
              <Link href="/cars" className="text-2xl text-white hover:text-gray-300 font-semibold" onClick={() => setIsOpen(false)}>Cars</Link>
              <Link href="/about" className="text-2xl text-white hover:text-gray-300 font-semibold" onClick={() => setIsOpen(false)}>About</Link>
              <Link href="/contact" className="text-2xl text-white hover:text-gray-300 font-semibold" onClick={() => setIsOpen(false)}>Contact</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}