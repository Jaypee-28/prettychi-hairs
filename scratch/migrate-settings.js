require("dotenv").config();
const { PrismaClient } = require("../src/generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Locating settings...");
  let settings = await prisma.setting.findFirst();
  if (settings) {
    console.log("Updating settings row to new brand details...");
    settings = await prisma.setting.update({
      where: { id: settings.id },
      data: {
        storeName: "Pretty Chi Hairs",
        supportEmail: "hello@prettychihairs.com",
        ukDeliveryFee: 2000.0,
        intlDeliveryFee: 4000.0,
        currency: "NGN",
      }
    });
  } else {
    console.log("No settings found. Creating with defaults...");
    settings = await prisma.setting.create({
      data: {
        storeName: "Pretty Chi Hairs",
        supportEmail: "hello@prettychihairs.com",
        ukDeliveryFee: 2000.0,
        intlDeliveryFee: 4000.0,
        currency: "NGN",
      }
    });
  }
  console.log("Migration completed! Current settings in DB:", settings);
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
