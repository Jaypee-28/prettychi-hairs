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
    console.log("Settings found:", res.rows[0]);
    
    if (res.rows.length > 0) {
      await pool.query('UPDATE "settings" SET currency = $1 WHERE id = $2', ['NGN', res.rows[0].id]);
      console.log("Updated settings to NGN");
    } else {
      console.log("No settings found. Please start app to create default settings.");
    }
  } catch (error) {
    console.error("PG error:", error);
  } finally {
    await pool.end();
  }
}
main();
