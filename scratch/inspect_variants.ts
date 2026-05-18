import 'dotenv/config';
import { prisma } from '../src/lib/db';

async function main() {
  const options = await prisma.variantOption.findMany({
    select: {
      attribute: true,
      value: true,
    },
  });

  const grouped: Record<string, string[]> = {};
  options.forEach(opt => {
    if (!grouped[opt.attribute]) grouped[opt.attribute] = [];
    grouped[opt.attribute].push(opt.value);
  });

  console.log(JSON.stringify(grouped, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
