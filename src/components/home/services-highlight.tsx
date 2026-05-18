import { prisma } from "@/lib/db";
import { ServiceGrid } from "./service-grid";

export async function ServicesHighlight() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    take: 6,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
    }
  });

  return <ServiceGrid services={services} />;
}
