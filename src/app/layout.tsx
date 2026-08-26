import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google'; // Import Montserrat font
import { LanguageProvider } from '@/context/LanguageContext';
import MobileTabBar from '@/components/MobileTabBar';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat', // Define a CSS variable for the font
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // lets content extend under the iOS notch/home indicator
  themeColor: '#ff5757',
};

export const metadata: Metadata = {
  title: 'RentCars - Your Premier Car Rental Platform',
  description: 'Rent a car for your next adventure. Wide range of cars, best prices, and 24/7 customer support.',
  keywords: ['car rental', 'rent a car', 'Bergen', 'Oslo', 'Stavanger', 'Trondheim', 'Tromsø', 'Norway', 'cheap car rental', 'luxury car rental'],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RentCars',
  },
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
    <html lang="no">
      <body className={`bg-secondary text-neutral ${montserrat.variable}`}>
        <LanguageProvider>
          {children}
          <MobileTabBar />
        </LanguageProvider>
      </body>
    </html>
  );
}