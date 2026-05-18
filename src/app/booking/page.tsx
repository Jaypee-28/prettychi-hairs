import { Metadata } from "next";
import { Suspense } from "react";
import { serviceService } from "@/modules/services/service.service";
import { BookingForm } from "@/components/booking/booking-form";

export const metadata: Metadata = {
  title: "Book Appointment | Pretty Chi Hairs",
  description: "Schedule your premium hair service appointment.",
};

export default async function BookingPage() {
  const services = await serviceService.getAllServices();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-12 sm:px-12">
            <div className="text-center mb-10">
              <h1 className="font-outfit text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Book an Appointment
              </h1>
              <p className="mt-4 text-gray-500 font-inter">
                Complete the form below and we'll reach out to confirm your booking.
              </p>
            </div>
            
            <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>}>
              <BookingForm services={services} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
