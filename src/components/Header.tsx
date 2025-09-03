"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-50 p-4 flex justify-between items-center text-white">
      <div className="flex gap-4 items-center">
        <Link href="/">
          <img src="/logo.png" alt="RentCars Logo" className="h-40" />
        </Link>
      </div>
      <nav className="hidden md:flex gap-8 items-center">
        <Link href="/" className="hover:text-gray-300 font-semibold">Home</Link>
        <Link href="/cars" className="hover:text-gray-300 font-semibold">Cars</Link>
        <Link href="/about" className="hover:text-gray-300 font-semibold">About</Link>
        <Link href="/contact" className="hover:text-gray-300 font-semibold">Contact</Link>
      </nav>
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-800 text-white">
          <nav className="flex flex-col items-center gap-4 p-4">
            <Link href="/" className="hover:text-gray-300 font-semibold">Home</Link>
            <Link href="/cars" className="hover:text-gray-300 font-semibold">Cars</Link>
            <Link href="/about" className="hover:text-gray-300 font-semibold">About</Link>
            <Link href="/contact" className="hover:text-gray-300 font-semibold">Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}