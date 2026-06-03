const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres.ajgmrggqhdhhhddaejtp:Prettychi%402026@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const res = await pool.query('SELECT * FROM "settings" LIMIT 1');
    if (res.rows.length > 0) {
      await pool.query(
        'UPDATE "settings" SET "storeName" = $1, "supportEmail" = $2, "ukDeliveryFee" = $3, "intlDeliveryFee" = $4 WHERE id = $5',
        ['Pretty Chi Hairs', 'hello@prettychihairs.com', 2000.00, 4000.00, res.rows[0].id]
      );
      console.log("Updated store metadata and delivery fees in DB");
    }
  } catch (error) {
    console.error("PG error:", error);
  } finally {
    await pool.end();
  }
}
main();
