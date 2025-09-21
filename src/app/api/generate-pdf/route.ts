import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts, PageSizes, PDFFont } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { bookingDetails } = await req.json();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(PageSizes.A4);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const textColor = rgb(0.2, 0.2, 0.2); // Dark gray color
    const primaryColor = rgb(0.85, 0.33, 0.30); // Primary red color

    // Load the logo image
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    const logoBytes = await fs.readFile(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);

    const { width: pageWidth, height: pageHeight } = page.getSize();

    // Draw Logo
    const logoActualWidth = logoImage.width;
    const logoActualHeight = logoImage.height;
    const logoDisplayWidth = 150; // Increased width
    const logoDisplayHeight = (logoActualHeight / logoActualWidth) * logoDisplayWidth; // Maintain aspect ratio

    page.drawImage(logoImage, {
      x: 50,
      y: pageHeight - 50 - logoDisplayHeight, // Top left corner, adjusted for new height
      width: logoDisplayWidth,
      height: logoDisplayHeight,
    });

    // Header Text
    page.drawText('Booking Confirmation', {
      x: pageWidth - 50 - helveticaBoldFont.widthOfTextAtSize('Booking Confirmation', 28), // Align right
      y: pageHeight - 50 - (logoDisplayHeight / 2) + 10, // Vertically align with logo, adjusted for new height
      font: helveticaBoldFont,
      size: 28,
      color: primaryColor,
    });

    // Booking ID / Reference
    page.drawText(`Reference: ${bookingDetails.id}`, {
      x: pageWidth - 50 - helveticaFont.widthOfTextAtSize(`Reference: ${bookingDetails.id}`, 12),
      y: pageHeight - 50 - logoDisplayHeight - 10,
      font: helveticaFont,
      size: 12,
      color: textColor,
    });

    let yOffset = pageHeight - 150; // Starting Y for main content

    // Section: Customer Details
    page.drawText('Customer Details', {
      x: 50,
      y: yOffset,
      font: helveticaBoldFont,
      size: 18,
      color: primaryColor,
    });
    yOffset -= 25;
    page.drawLine({
      start: { x: 50, y: yOffset },
      end: { x: pageWidth - 50, y: yOffset },
      color: primaryColor,
      thickness: 1,
    });
    yOffset -= 20;

    const addDetail = (label: string, value: string, labelFont: PDFFont, labelSize: number, valueFont: PDFFont, valueSize: number) => {
      page.drawText(`${label}:`, {
        x: 50,
        y: yOffset,
        font: labelFont,
        size: labelSize,
        color: textColor,
      });
      page.drawText(value, {
        x: 150, // Align value
        y: yOffset,
        font: valueFont,
        size: valueSize,
        color: textColor,
      });
      yOffset -= 15;
    };

    addDetail('Name', bookingDetails.customerName, helveticaBoldFont, 12, helveticaFont, 12);
    addDetail('Email', bookingDetails.customerEmail, helveticaBoldFont, 12, helveticaFont, 12);
    // Add phone and driverLicense if available in bookingDetails
    // addDetail('Phone', bookingDetails.customerPhone, helveticaBoldFont, 12, helveticaFont, 12);
    // addDetail('Driver License', bookingDetails.driverLicense, helveticaBoldFont, 12, helveticaFont, 12);

    yOffset -= 30; // Space between sections

    // Section: Car Details
    page.drawText('Car Details', {
      x: 50,
      y: yOffset,
      font: helveticaBoldFont,
      size: 18,
      color: primaryColor,
    });
    yOffset -= 25;
    page.drawLine({
      start: { x: 50, y: yOffset },
      end: { x: pageWidth - 50, y: yOffset },
      color: primaryColor,
      thickness: 1,
    });
    yOffset -= 20;

    addDetail('Car Model', `${bookingDetails.carMake} ${bookingDetails.carModel}`, helveticaBoldFont, 12, helveticaFont, 12);
    addDetail('Rental Dates', `${bookingDetails.startDate} to ${bookingDetails.endDate}`, helveticaBoldFont, 12, helveticaFont, 12);
    addDetail('Number of Days', `${(new Date(bookingDetails.endDate).getTime() - new Date(bookingDetails.startDate).getTime()) / (1000 * 60 * 60 * 24)}`, helveticaBoldFont, 12, helveticaFont, 12); // Calculate days
    addDetail('Extras', bookingDetails.extras.length > 0 ? bookingDetails.extras.join(', ') : 'None', helveticaBoldFont, 12, helveticaFont, 12);

    yOffset -= 30; // Space between sections

    // Section: Pricing
    page.drawText('Pricing', {
      x: 50,
      y: yOffset,
      font: helveticaBoldFont,
      size: 18,
      color: primaryColor,
    });
    yOffset -= 25;
    page.drawLine({
      start: { x: 50, y: yOffset },
      end: { x: pageWidth - 50, y: yOffset },
      color: primaryColor,
      thickness: 1,
    });
    yOffset -= 20;

    addDetail('Total Price', `kr${bookingDetails.totalPrice.toFixed(2)}`, helveticaBoldFont, 12, helveticaFont, 12);
    addDetail('Booking Date', bookingDetails.bookingDate, helveticaBoldFont, 12, helveticaFont, 12);

    yOffset -= 40; // Space before messages

    // Messages
    page.drawText(bookingDetails.message, {
      x: 50,
      y: yOffset,
      font: helveticaFont,
      size: 12,
      color: textColor,
      maxWidth: pageWidth - 100,
      lineHeight: 15,
    });
    yOffset -= 20;
    page.drawText(bookingDetails.details, {
      x: 50,
      y: yOffset,
      font: helveticaFont,
      size: 12,
      color: textColor,
      maxWidth: pageWidth - 100,
      lineHeight: 15,
    });

    // Footer
    page.drawText('RentCars.no - Your trusted car rental partner.', {
      x: pageWidth / 2 - helveticaFont.widthOfTextAtSize('RentCars.no - Your trusted car rental partner.', 10) / 2,
      y: 50,
      font: helveticaFont,
      size: 10,
      color: rgb(0.5, 0.5, 0.5),
    });
    page.drawText('Contact us: info@rentcars.no', {
      x: pageWidth / 2 - helveticaFont.widthOfTextAtSize('Contact us: info@rentcars.no', 10) / 2,
      y: 35,
      font: helveticaFont,
      size: 10,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="booking-${bookingDetails.id}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    if (error instanceof Error && error.stack) {
      console.error('Error stack:', error.stack);
    }
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to generate PDF', details: message }, { status: 500 });
  }
}