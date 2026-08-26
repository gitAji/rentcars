"use client";

import { Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import Loading from "@/components/loading";
import Footer from "@/components/Footer";
import { useLanguage } from '@/context/LanguageContext';
import { FaCheck, FaFileDownload } from 'react-icons/fa';

function ConfirmationPageContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  // Extract booking details directly from searchParams
  const bookingId = searchParams.get("bookingId");
  const carMake = searchParams.get("carMake");
  const carModel = searchParams.get("carModel");
  const customerName = searchParams.get("customerName");
  const customerEmail = searchParams.get("customerEmail");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const extras = searchParams.get("extras")?.split(",") || [];
  const totalPrice = parseFloat(searchParams.get("totalPrice") || "0");

  // Construct bookingDetails object
  const bookingDetails = {
    id: bookingId || "N/A",
    carMake: carMake || "N/A",
    carModel: carModel || "N/A",
    customerName: customerName || "N/A",
    customerEmail: customerEmail || "N/A",
    startDate: startDate || "N/A",
    endDate: endDate || "N/A",
    totalPrice: totalPrice,
    bookingDate: new Date().toLocaleDateString(), // Current date as booking date
    extras: extras,
    message: "Your car rental has been successfully confirmed!",
    details: "You will receive a confirmation email shortly with all the details of your booking.",
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingDetails }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `booking-${bookingDetails.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-48 md:h-64 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/oslo.jpg')" }} // You might want a specific confirmation hero image
      >
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-4xl md:text-5xl text-white font-bold">
          {t('confirmation_hero_title')}
        </h1>
      </section>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto mb-4">
            <FaCheck size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">{t('confirmation_success_heading')}</h2>
          <p className="text-sm text-neutral-light mb-6">{t('confirmation_success_detail')}</p>

          {bookingDetails && (
            <div className="space-y-2.5 text-left bg-gray-50 rounded-xl p-4 mb-6">
              <p className="flex justify-between gap-4 text-sm">
                <span className="font-semibold text-primary shrink-0">{t('confirmation_booking_id')}</span>{" "}
                <span className="font-medium text-right">{bookingDetails.id}</span>
              </p>
              <p className="flex justify-between gap-4 text-sm">
                <span className="font-semibold text-primary shrink-0">{t('confirmation_car')}</span>{" "}
                <span className="font-medium text-right">{bookingDetails.carMake} {bookingDetails.carModel}</span>
              </p>
              <p className="flex justify-between gap-4 text-sm">
                <span className="font-semibold text-primary shrink-0">{t('confirmation_customer')}</span>{" "}
                <span className="font-medium text-right">{bookingDetails.customerName} ({bookingDetails.customerEmail})</span>
              </p>
              <p className="flex justify-between gap-4 text-sm">
                <span className="font-semibold text-primary shrink-0">{t('confirmation_dates')}</span>{" "}
                <span className="font-medium text-right">{bookingDetails.startDate} — {bookingDetails.endDate}</span>
              </p>
              <p className="flex justify-between gap-4 text-sm">
                <span className="font-semibold text-primary shrink-0">{t('confirmation_extras')}</span>{" "}
                <span className="font-medium text-right">{bookingDetails.extras.length > 0 ? bookingDetails.extras.join(", ") : t('confirmation_none')}</span>
              </p>
              <div className="pt-2.5 mt-2.5 border-t border-gray-200 flex justify-between items-baseline">
                <span className="font-semibold text-primary">{t('confirmation_total_price')}</span>
                <span className="text-2xl font-bold text-primary">kr{bookingDetails.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="btn-primary w-full"
            >
              {t('confirmation_go_home')}
            </Link>
            <button
              onClick={handleDownloadPdf}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 font-semibold cursor-pointer"
            >
              <FaFileDownload size={16} />
              {t('confirmation_download_pdf')}
            </button>
          </div>
        </div>
      </div>
       <Footer />
    </>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ConfirmationPageContent />
    </Suspense>

  );
}
