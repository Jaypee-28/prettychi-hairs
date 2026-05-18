import { HeroSection } from "@/components/home/hero-section";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ServicesHighlight } from "@/components/home/services-highlight";
import { Testimonials } from "@/components/home/testimonials";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Newsletter } from "@/components/home/newsletter";

export const metadata = {
  title: "Pretty Chi Hairs | Premium Hair Extensions & Wigs",
  description:
    "Experience the pinnacle of luxury hair. Ethically sourced, designed for perfection.",
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategoryShowcase />
      <FeaturedProducts />
      <ServicesHighlight />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </main>
  );
}