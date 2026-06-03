import { PrismaClient } from './src/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const oldDbUrl = "postgresql://postgres.uvqckitunlfzxhxfrxrc:Max%2Forg%40%212680@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
const newDbUrl = "postgresql://postgres.ajgmrggqhdhhhddaejtp:Prettychi%402026@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

const oldPool = new Pool({ connectionString: oldDbUrl })
const oldAdapter = new PrismaPg(oldPool)
const oldDb = new PrismaClient({ adapter: oldAdapter })

const newPool = new Pool({ connectionString: newDbUrl })
const newAdapter = new PrismaPg(newPool)
const newDb = new PrismaClient({ adapter: newAdapter })

async function migrateTable(modelName: string) {
  console.log(`Migrating ${modelName}...`)
  // @ts-ignore
  const rows = await oldDb[modelName].findMany()
  if (rows.length === 0) {
    console.log(`  No data for ${modelName}`)
    return
  }
  
  // Try inserting all at once
  try {
    // @ts-ignore
    await newDb[modelName].createMany({
      data: rows,
      skipDuplicates: true
    })
    console.log(`  Successfully inserted ${rows.length} rows into ${modelName}`)
  } catch (e) {
    console.log(`  Failed batch insert for ${modelName}, inserting one by one...`)
    let count = 0
    for (const row of rows) {
      try {
        // @ts-ignore
        await newDb[modelName].create({ data: row })
        count++
      } catch (err: any) {
        console.error(`  Error inserting row into ${modelName}:`, err.message)
      }
    }
    console.log(`  Successfully inserted ${count}/${rows.length} rows into ${modelName}`)
  }
}

async function run() {
  const models = [
    'user',
    'admin',
    'category',
    'service',
    'setting',
    'newsletterSubscriber',
    'fAQ',
    'testimonial',
    'product',
    'productImage',
    'productVariant',
    'variantOption',
    'account',
    'session',
    'verificationToken',
    'order',
    'orderItem',
    'booking',
    'wishlist'
  ]

  for (const model of models) {
    await migrateTable(model)
  }

  console.log('Migration completed!')
  await oldDb.$disconnect()
  await newDb.$disconnect()
}

run().catch(console.error)
