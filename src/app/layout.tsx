import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RentCars - Your Premier Car Rental Platform',
  description: 'Rent a car for your next adventure. Wide range of cars, best prices, and 24/7 customer support.',
  keywords: ['car rental', 'rent a car', 'Bergen', 'Oslo', 'Stavanger', 'Trondheim', 'Tromsø', 'Norway', 'cheap car rental', 'luxury car rental'],
  openGraph: {
    title: 'RentCars - Your Premier Car Rental Platform',
    description: 'Rent a car for your next adventure. Wide range of cars, best prices, and 24/7 customer support.',
    url: 'https://www.rentcars.com',
    siteName: 'RentCars',
    images: [
      {
        url: 'https://www.rentcars.com/og-image.jpg', // Replace with your actual Open Graph image
        width: 1200,
        height: 630,
        alt: 'RentCars - Car Rental',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentCars - Your Premier Car Rental Platform',
    description: 'Rent a car for your next adventure. Wide range of cars, best prices, and 24/7 customer support.',
    creator: '@rentcars', // Replace with your Twitter handle
    images: ['https://www.rentcars.com/twitter-image.jpg'], // Replace with your actual Twitter image
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-secondary text-neutral">{children}</body>
    </html>
  );
}
