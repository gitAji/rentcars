'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaTachometerAlt, FaCar, FaBook, FaHome, FaBars, FaTimes } from 'react-icons/fa';
import AdminDashboardHeader from '@/components/AdminDashboardHeader';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
  { href: '/admin/cars', label: 'Manage Fleet', icon: FaCar },
  { href: '/admin/cars/new', label: 'Add Car', icon: FaCar },
  { href: '/admin/bookings', label: 'View Bookings', icon: FaBook },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Backdrop for the mobile drawer */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
            className="md:hidden text-gray-300 hover:text-white cursor-pointer"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <nav className="flex flex-col flex-grow">
          <ul>
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href} className="mb-2">
                <Link
                  href={href}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Icon className="mr-3 shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-4 border-t border-gray-700">
            <Link href="/" className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <FaHome className="mr-3 shrink-0" />
              Back to Site
            </Link>
          </div>
        </nav>
      </aside>

      <div className="flex-grow flex flex-col min-w-0">
        <div className="md:hidden flex items-center gap-3 bg-white shadow-sm px-4 py-3 border-b border-gray-200">
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
            className="text-gray-600 hover:text-primary cursor-pointer"
          >
            <FaBars size={20} />
          </button>
          <span className="font-semibold text-gray-800">Admin Panel</span>
        </div>
        <AdminDashboardHeader />
        <main className="flex-grow p-4 sm:p-8">
          {children}
        </main>
        <footer className="text-center text-sm text-gray-500 p-4 border-t border-gray-200">
          <p>&copy; {new Date().getFullYear()} RentCars. All rights reserved. v1.0.0</p>
        </footer>
      </div>
    </div>
  );
}
