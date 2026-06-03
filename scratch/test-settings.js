const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient({
  datasourceUrl: "postgresql://postgres.uvqckitunlfzxhxfrxrc:Prettychi%402026@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&statement_cache_size=0"
});

async function main() {
  try {
    const settings = await prisma.setting.findFirst();
    console.log("Settings found:", settings);
    
    if (settings) {
      const updated = await prisma.setting.update({
        where: { id: settings.id },
        data: { currency: 'NGN' }
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
  } catch (error) {
    console.error("Prisma error:", error);
  } finally {
    await prisma.$disconnect();
  }
}
main();
