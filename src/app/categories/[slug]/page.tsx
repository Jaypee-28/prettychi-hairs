import { productService } from "@/modules/products/product.service";
import { categoryService } from "@/modules/categories/category.service";
import { ProductWithRelations } from "@/modules/products/product.types";
import { ProductCard } from "@/components/shop/product-card";
import { notFound } from "next/navigation";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Fetch category data
  let category;
  try {
    category = await categoryService.getCategoryBySlug(slug);
  } catch (err) {
    return notFound();
  }

  // Fetch products for this category
  const products = await productService.getAllProducts({ 
    includeRelations: true, 
    categorySlug: slug 
  }) as ProductWithRelations[];

  return (
    <div className="bg-[#FBFCFD] min-h-screen pb-20">
      {/* Category Header */}
      <div className="bg-white border-b border-gray-100 mb-16 overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 relative z-10">
          <Link 
            href="/products"
            className="flex items-center gap-2 text-gray-400 hover:text-[#FF4D8D] transition-colors font-bold text-sm mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to All Collections
          </Link>

          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#FF4D8D]">
              <Sparkles size={16} strokeWidth={3} />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Category Collection</span>
            </div>
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
              {category.name}
            </h1>
            <p className="text-lg text-gray-500 font-semibold max-w-lg leading-relaxed mt-4">
              Explore our hand-picked selection of premium {category.name.toLowerCase()} products.
            </p>
          </div>
        </div>
        
        {/* Background visual */}
        {category.imageUrl && (
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 pointer-events-none">
            <img src={category.imageUrl} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent"></div>
          </div>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
             <span className="text-xl font-black text-gray-900">{products.length}</span>
             <span className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Products Found</span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Collection is coming soon</h3>
            <p className="text-gray-500 font-semibold">We are curating the finest products for this category.</p>
            <Link href="/products" className="mt-8 inline-block bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest hover:bg-gray-800 transition-all">
              BROWSE OTHERS
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
