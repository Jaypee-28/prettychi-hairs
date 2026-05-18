import { ContactClient } from "@/components/contact/contact-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Pretty Chi Hairs",
  description: "Get in touch with the Pretty Chi Hairs team for inquiries, bookings, or support.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <ContactClient />
    </main>
  );
}
