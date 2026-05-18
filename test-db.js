const { Client } = require('pg');
require('dotenv').config();

// Try both the pooled and direct URLs
const dbUrl = process.env.DATABASE_URL.trim();

console.log("Connecting to:", dbUrl.split('@')[1]); // Hide password

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT NOW()');
    console.log("Time:", res.rows[0].now);
  } catch (err) {
    console.error("Connection error:", err.message);
  } finally {
    await client.end();
  }
}

run();
