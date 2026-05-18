import { productService } from "@/modules/products/product.service";
import { ProductWithRelations } from "@/modules/products/product.types";
import { ProductDetails } from "@/components/shop/product-details";
import { ProductCard } from "@/components/shop/product-card";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { sanitizeData } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let rawProduct;
  try {
    rawProduct = await productService.getProductBySlug(slug);
  } catch (err) {
    return notFound();
  }

  const product = sanitizeData(rawProduct);

  // Fetch related products (same category)
  let rawRelated = await productService.getAllProducts({
    includeRelations: true,
    categorySlug: product.category?.slug,
  }) as ProductWithRelations[];

  let otherProducts = sanitizeData(rawRelated).filter(p => p.id !== product.id).slice(0, 4);

  // Fallback to featured products if no similar category products found
  if (otherProducts.length === 0) {
    const rawFeatured = await productService.getAllProducts({
      includeRelations: true,
      isFeatured: true,
    }) as ProductWithRelations[];
    otherProducts = sanitizeData(rawFeatured).filter(p => p.id !== product.id).slice(0, 4);
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation Breadcrumb */}
      <div className="bg-gray-50/50 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6">
          <nav className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <Link href="/products" className="hover:text-gray-900 transition-colors">Shop</Link>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            {product.category && (
              <>
                <Link href={`/categories/${product.category.slug}`} className="hover:text-gray-900 transition-colors">{product.category.name}</Link>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              </>
            )}
            <span className="text-[#FF4D8D] truncate max-w-[150px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        <ProductDetails product={product as ProductWithRelations} />
        
        {/* Recommended Section */}
        {otherProducts.length > 0 && (
          <section className="mt-24 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#FF4D8D]">
                    <Sparkles size={14} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Complete The Look</span>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                    YOU MAY ALSO <span className="text-[#FF4D8D]">ADORE</span>
                  </h2>
               </div>
               <Link 
                 href="/products" 
                 className="group flex items-center gap-3 text-sm font-black text-gray-900 uppercase tracking-widest hover:text-[#FF4D8D] transition-colors"
               >
                 View All Collection
                 <div className="p-3 bg-gray-50 rounded-full group-hover:bg-pink-50 transition-colors">
                    <ArrowLeft className="rotate-180" size={16} strokeWidth={3} />
                 </div>
               </Link>
            </div>

            <div className="flex overflow-x-auto pb-6 -mx-6 px-6 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:gap-10 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0 scrollbar-hide">
              {otherProducts.map((p) => (
                <div key={p.id} className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-start pr-6 lg:pr-0">
                  <ProductCard product={p as ProductWithRelations} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
