import 'dotenv/config';
import { prisma } from '../src/lib/db';
import { normalizeAttributeValue } from '../src/lib/filter-utils';

async function main() {
  const options = await prisma.variantOption.findMany();
  console.log(`Found ${options.length} variant options. Normalizing...`);

  let count = 0;
  for (const opt of options) {
    const normalized = normalizeAttributeValue(opt.attribute, opt.value);
    if (normalized !== opt.value) {
      await prisma.variantOption.update({
        where: { id: opt.id },
        data: { value: normalized },
      });
      count++;
    }
  }

  console.log(`Finished! Normalized ${count} values.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
