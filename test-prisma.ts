import { prisma } from "./src/lib/db";

async function test() {
  try {
    console.log("Testing Prisma Connection...");
    console.log("Models:", Object.keys(prisma).filter(k => !k.startsWith("$")));
    const products = await (prisma as any).product.findMany();
    console.log("Products found:", products.length);
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();
