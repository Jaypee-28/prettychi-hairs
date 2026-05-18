import { AboutClient } from "@/components/about/about-client";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Pretty Chi Hairs",
  description: "Learn more about Pretty Chi Hairs, your destination for premium hair products and professional beauty services.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutClient />
      
      {/* Reused Sections */}
      <Testimonials />
      <Newsletter />
    </main>
  );
}
