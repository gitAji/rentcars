import Link from 'next/link';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-50 p-4 flex justify-between items-center text-white">
      <div className="flex gap-4 items-center">
        <Link href="/">
          <img src="/logo.png" alt="RentCars Logo" className="h-40" />
        </Link>
      </div>
      <nav className="flex gap-8 items-center">
        <Link href="/" className="hover:text-gray-300 font-semibold">Home</Link>
        <Link href="/cars" className="hover:text-gray-300 font-semibold">Cars</Link>
        <Link href="/about" className="hover:text-gray-300 font-semibold">About</Link>
        <Link href="/contact" className="hover:text-gray-300 font-semibold">Contact</Link>
      </nav>
    </header>
  );
}
