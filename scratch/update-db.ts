import { prisma } from "../src/lib/db";

async function main() {
  const settings = await prisma.setting.findFirst();
  console.log("Settings found:", settings);
  
  if (settings) {
    const updated = await prisma.setting.update({
      where: { id: settings.id },
      data: { currency: "NGN" }
    });
    console.log("Updated settings:", updated);
  } else {
    console.log("No settings found. Creating...");
    const created = await prisma.setting.create({
      data: {
        storeName: "Pretty Chi Hairs",
        supportEmail: "hello@prettychihairs.com",
        ukDeliveryFee: 2000.0,
        intlDeliveryFee: 4000.0,
        currency: "NGN",
      }
    });
    console.log("Created settings:", created);
  }
}

main().catch(console.error).finally(() => process.exit(0));
