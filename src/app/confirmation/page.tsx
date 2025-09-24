"use client";

import { Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import Loading from "@/components/loading";
import Footer from "@/components/Footer";

function ConfirmationPageContent() {
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
          Booking Confirmed!
        </h1>
      </section>
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-2">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
          
          {bookingDetails && (
            <div className="space-y-3 text-lg text-neutral-dark mb-2"> {/* Added space-y and text-neutral-dark */}
              <p>
                <span className="font-semibold text-primary">Booking ID:</span>{" "}
                <span className="font-medium">{bookingDetails.id}</span>
              </p>
              <p>
                <span className="font-semibold text-primary">Car:</span>{" "}
                <span className="font-medium">{bookingDetails.carMake} {bookingDetails.carModel}</span>
              </p>
              <p>
                <span className="font-semibold text-primary">Customer:</span>{" "}
                <span className="font-medium">{bookingDetails.customerName} ({bookingDetails.customerEmail})</span>
              </p>
              <p>
                <span className="font-semibold text-primary">Dates:</span>{" "}
                <span className="font-medium">{bookingDetails.startDate} to {bookingDetails.endDate}</span>
              </p>
              <p>
                <span className="font-semibold text-primary">Extras:</span>{" "}
                <span className="font-medium">{bookingDetails.extras.length > 0 ? bookingDetails.extras.join(", ") : "None"}</span>
              </p>
              <p className="text-2xl font-bold text-primary pt-4"> {/* Larger and bolder for total price */}
                Total Price: kr{bookingDetails.totalPrice.toFixed(2)}
              </p>
              <p className="text-base text-neutral-light pt-2"> {/* Smaller for messages */}
                {bookingDetails.message}
              </p>
              <p className="text-sm text-neutral-light"> {/* Even smaller for details */}
                {bookingDetails.details}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 w-full"> {/* Adjusted for responsiveness and spacing */}
            <Link
              href="/"
              className="w-full sm:w-auto bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 text-lg font-semibold" // Increased padding, font size, hover, transition
            >
              Go to Home
            </Link>
            <button
              onClick={handleDownloadPdf}
              className="w-full sm:w-auto bg-green-600 text-white px-5 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-colors duration-200 text-lg font-semibold cursor-pointer" // Increased padding, font size, hover, transition
            >
              Download Booking PDF
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
