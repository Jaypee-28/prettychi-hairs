import { prisma } from "@/lib/db";
import { cache } from "react";

/**
 * Cached function to retrieve store settings.
 * Use this in Server Components to avoid redundant DB queries.
 */
export const getCachedSettings = cache(async () => {
  return prisma.setting.findFirst();
});

export async function getGlobalCurrency() {
  const settings = await getCachedSettings();
  return settings?.currency || "NGN";
}
