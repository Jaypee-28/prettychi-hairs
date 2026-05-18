import { productService } from "@/modules/products/product.service";
import { categoryService } from "@/modules/categories/category.service";
import { ProductWithRelations } from "@/modules/products/product.types";
import { ShopSidebar } from "@/components/shop/shop-sidebar";
import { ShopContent } from "@/components/shop/shop-content";

import { sanitizeData } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [rawProducts, categories, filterOptions] = await Promise.all([
    productService.getAllProducts({ includeRelations: true }),
    categoryService.getAllCategories(),
    productService.getFilterOptions(),
  ]);

  const products = sanitizeData(rawProducts);

  return (
    <div className="bg-[#FBFCFD] min-h-screen pt-8 sm:pt-12 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
        {/* 
          On mobile: ShopSidebar renders inline dropdown pills (MobileFilters),
          then ShopContent renders below it — no grid.
          On desktop: CSS grid kicks in — sidebar left, content right.
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Sidebar column — on mobile it just renders the inline filter pills */}
          <div className="lg:col-span-3">
            <ShopSidebar categories={categories} filterOptions={filterOptions} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <ShopContent
              initialProducts={products as ProductWithRelations[]}
              categories={categories ?? []}
              filterOptions={filterOptions ?? { attributes: {}, tags: [] }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
