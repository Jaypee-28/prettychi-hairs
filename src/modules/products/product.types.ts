import { Prisma } from "@/generated/prisma";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
    variants: {
      include: {
        options: true;
      };
    };
  };
}>;
