import { prisma } from "../../lib/db";

export class WishlistRepository {
  async toggle(userId: string, productId: string) {
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });
      return { action: "removed" };
    } else {
      await prisma.wishlist.create({
        data: { userId, productId },
      });
      return { action: "added" };
    }
  }

  async getByUserId(userId: string) {
    return prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            images: { orderBy: { sortOrder: 'asc' } },
            variants: { include: { options: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async checkIsWishlisted(userId: string, productId: string) {
    const item = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return !!item;
  }
}

export const wishlistRepository = new WishlistRepository();
