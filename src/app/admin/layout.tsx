import Link from 'next/link';
import { FaTachometerAlt, FaCar, FaBook, FaHome } from 'react-icons/fa';
import AdminDashboardHeader from '@/components/AdminDashboardHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-8 border-b border-gray-700 pb-4">Admin Panel</h1>
        <nav className="flex flex-col flex-grow">
          <ul>
            <li className="mb-4">
              <Link href="/admin" className="flex items-center p-2 rounded hover:bg-gray-700 transition-colors">
                <FaTachometerAlt className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/cars" className="flex items-center p-2 rounded hover:bg-gray-700 transition-colors">
                <FaCar className="mr-3" />
                Manage Fleet
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/cars/new" className="flex items-center p-2 rounded hover:bg-gray-700 transition-colors">
                <FaCar className="mr-3" />
                Add Car
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/bookings" className="flex items-center p-2 rounded hover:bg-gray-700 transition-colors">
                <FaBook className="mr-3" />
                View Bookings
              </Link>
            </li>
          </ul>
          <div className="mt-auto">
            <Link href="/" className="flex items-center p-2 rounded hover:bg-gray-700 transition-colors">
              <FaHome className="mr-3" />
              Back to Site
            </Link>
          </div>
        </nav>
      </aside>
      <div className="flex-grow flex flex-col">
        <AdminDashboardHeader />
        <main className="flex-grow p-8">
          {children}
        </main>
        <footer className="text-center text-sm text-gray-500 p-4 border-t border-gray-200">
          <p>&copy; {new Date().getFullYear()} RentCars. All rights reserved. v1.0.0</p>
        </footer>
      </div>
    </div>
  );
}