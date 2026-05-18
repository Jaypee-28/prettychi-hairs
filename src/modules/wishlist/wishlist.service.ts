import { wishlistRepository } from "./wishlist.repository";

export class WishlistService {
  async toggleWishlist(userId: string, productId: string) {
    return wishlistRepository.toggle(userId, productId);
  }

  async getUserWishlist(userId: string) {
    const items = await wishlistRepository.getByUserId(userId);
    return items.map(item => item.product);
  }

  async isWishlisted(userId: string, productId: string) {
    return wishlistRepository.checkIsWishlisted(userId, productId);
  }
}

export const wishlistService = new WishlistService();
