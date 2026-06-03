const { Client } = require('pg');

async function testConnection() {
  const url = process.argv[2];
  console.log('Testing connection to:', url.replace(/:[^:@]+@/, ':***@'));
  const client = new Client({ connectionString: url });
  
  try {
    await client.connect();
    console.log('Successfully connected!');
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error:', err.message);
  }
}

testConnection();
