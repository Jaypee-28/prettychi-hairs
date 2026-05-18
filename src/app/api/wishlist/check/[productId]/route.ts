import { NextResponse } from "next/server";
import { auth } from "@/auth.node";
import { wishlistService } from "@/modules/wishlist/wishlist.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ isWishlisted: false });
  }

  const { productId } = await params;

  try {
    const isWishlisted = await wishlistService.isWishlisted(session.user.id, productId);
    return NextResponse.json({ isWishlisted });
  } catch (error: any) {
    return NextResponse.json({ isWishlisted: false });
  }
}
