import { FaqsClient } from "@/components/faqs/faqs-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | Pretty Chi Hairs",
  description: "Frequently asked questions about Pretty Chi Hairs orders, products, deliveries, and services.",
};

export default function FaqsPage() {
  return (
    <main>
      <FaqsClient />
    </main>
  );
}
