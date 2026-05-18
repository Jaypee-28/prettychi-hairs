import { auth } from "@/auth.node";
import { wishlistService } from "@/modules/wishlist/wishlist.service";
import { WishlistContent } from "@/components/shop/wishlist-content";
import { redirect } from "next/navigation";
import { sanitizeData } from "@/lib/utils";
import { ProductWithRelations } from "@/modules/products/product.types";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/wishlist");
  }

  const rawProducts = await wishlistService.getUserWishlist(session.user.id);
  const products = sanitizeData(rawProducts) as ProductWithRelations[];

  return (
    <div className="bg-[#FBFCFD] min-h-screen py-12 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <WishlistContent initialProducts={products} />
      </div>
    </div>
  );
}
