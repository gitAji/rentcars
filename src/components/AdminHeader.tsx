import Link from 'next/link';

export default function AdminHeader() {
  return (
    <header className="p-4 flex justify-between items-center bg-neutral text-white">
      <div className="flex gap-4 items-center">
        <Link href="/admin" className="hover:text-primary">Admin Dashboard</Link>
      </div>
      <nav className="flex gap-4 items-center">
        <Link href="/admin/cars/new" className="hover:text-primary">Add Car</Link>
        <Link href="/admin/bookings" className="hover:text-primary">View Bookings</Link>
        <Link href="/" className="hover:text-primary">Home</Link>
      </nav>
    </header>
  );
}