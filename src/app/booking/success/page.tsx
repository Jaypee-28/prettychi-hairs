import { Metadata } from "next";
import Link from "next/link";
import { CheckCircleIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Booking Success | Pretty Chi Hairs",
  description: "Your booking request has been received.",
};

export default function BookingSuccessPage() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-6 mb-8">
          <CheckCircleIcon className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="font-outfit text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
          Booking Received!
        </h1>
        <p className="font-inter text-gray-500 text-lg mb-10">
          Thank you for choosing Pretty Chi Hairs. We have received your appointment request and will contact you shortly to confirm the details.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Return to Home
          </Link>
          <Link
            href="/services"
            className="block w-full rounded-full border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            View More Services
          </Link>
        </div>
      </div>
    </div>
  );
}
