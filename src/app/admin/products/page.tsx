import { productService } from "@/modules/products/product.service";
import { ProductWithRelations } from "@/modules/products/product.types";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { Search, Filter } from "lucide-react";
import { ProductActions } from "@/components/admin/product-actions";

import { sanitizeData, formatPrice } from "@/lib/utils";
import { getGlobalCurrency } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string }>;
}) {
  const { search, sort } = await searchParams;
  const rawProducts = await productService.getAllProducts({ 
    includeRelations: true,
    search,
    sort
  });
  const products = sanitizeData(rawProducts) as ProductWithRelations[];
  const currency = await getGlobalCurrency();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500 font-semibold mt-1">Manage your inventory, pricing and variations.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-[#FF4D8D] text-white px-6 py-3.5 rounded-2xl hover:bg-[#E6457E] transition shadow-lg shadow-pink-100 font-bold flex items-center justify-center gap-2"
        >
          <Plus size={20} strokeWidth={3} />
          Add Product
        </Link>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center bg-white px-4 py-2 rounded-xl border border-gray-200 w-80 shadow-sm">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Filter products..." className="bg-transparent border-none focus:ring-0 text-sm font-medium ml-2 w-full" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-500 font-bold text-sm hover:text-gray-900 transition shadow-sm">
            <Filter size={16} />
            Sort by: Newest
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-10 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-10 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                <th className="px-10 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Variants</th>
                <th className="px-10 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition group">
                  <td className="px-10 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                        {product.thumbnailUrl ? (
                          <img src={product.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <Package className="text-gray-300" size={24} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg leading-tight">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {product.isFeatured && <span className="text-[10px] font-black text-white bg-amber-400 px-2 py-0.5 rounded-full uppercase">Featured</span>}
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.tags.join(", ") || "No tags"}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap">
                    <span className="px-4 py-1.5 rounded-xl bg-gray-100 text-gray-600 font-bold text-xs uppercase tracking-wider border border-gray-200">
                      {product.category?.name || "General"}
                    </span>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap">
                    <p className="text-xl font-black text-gray-900 leading-tight">{formatPrice(product.basePrice, currency)}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Base Price</p>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-gray-900">{(product.variants || []).length}</span>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Options</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap text-right">
                    <ProductActions productId={product.id} />
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 border border-dashed border-gray-200">
                        <Package size={32} />
                      </div>
                      <p className="font-bold text-gray-500">No products found yet.</p>
                      <Link href="/admin/products/new" className="text-[#FF4D8D] font-black text-sm hover:underline underline-offset-4">Add your first product</Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <p className="font-bold text-gray-500">No products found.</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                  {product.thumbnailUrl ? (
                    <img src={product.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <Package className="text-gray-300" size={24} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-gray-900 text-lg truncate leading-tight">{product.name}</p>
                    <ProductActions productId={product.id} />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.category?.name || "General"}</span>
                    {product.isFeatured && <span className="text-[8px] font-black text-white bg-amber-400 px-1.5 py-0.5 rounded-full uppercase">Featured</span>}
                  </div>
                  <p className="text-xl font-black text-[#FF4D8D] mt-2">{formatPrice(product.basePrice, currency)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-gray-900">{(product.variants || []).length}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Variants</span>
                </div>
                <Link 
                  href={`/admin/products/${product.id}/edit`}
                  className="text-[10px] font-black text-[#FF4D8D] uppercase tracking-widest hover:underline"
                >
                  Edit Details →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
