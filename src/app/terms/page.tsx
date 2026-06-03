import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Pretty Chi Hairs",
  description: "Terms and conditions of service for Pretty Chi Hairs.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="bg-gray-50/50 pt-32 pb-20 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-500 font-medium">
            Last updated: October 2023
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-16 md:py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 text-gray-600 font-medium leading-relaxed">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">1. Introduction</h2>
            <p>
              Welcome to Pretty Chi Hairs. These Terms of Service govern your use of our website and the purchase of products and services from us. By accessing our site or purchasing something from us, you agree to be bound by these terms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">2. Website Usage</h2>
            <p>
              You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.
            </p>
            <p>
              You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">3. Orders & Payments</h2>
            <p>
              We reserve the right to refuse any order you place with us. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the email and/or billing address/phone number provided at the time the order was made.
            </p>
            <p>
              Prices for our products are subject to change without notice. All payments are securely processed via Paystack.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">4. Services & Bookings</h2>
            <p>
              Appointments for beauty and styling services can be booked via our online portal. A non-refundable deposit may be required to secure your appointment. Cancellations made less than 24 hours in advance will result in a forfeiture of your deposit.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">5. Returns</h2>
            <p>
              We accept returns within 14 days of receipt, provided the hair remains unaltered, unwashed, and the original hygiene seal is completely intact. For health and sanitary reasons, we strictly enforce this policy.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">6. Liability</h2>
            <p>
              In no case shall Pretty Chi Hairs, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, arising from your use of any of the service or any products procured using the service.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">7. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">8. Contact Information</h2>
            <p>
              Questions about the Terms of Service should be sent to us at:
            </p>
            <p className="font-bold text-gray-900">
              Email: hello@prettychihairs.com<br />
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
