const postgres = require('postgres');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

// Функция для проверки версии PostgreSQL
async function getPgVersion() {
  try {
    const result = await sql`SELECT version()`;
    console.log('PostgreSQL version:', result[0].version);
  } catch (error) {
    console.error('Error fetching PostgreSQL version:', error);
  }
}

// Вызов функции для проверки версии
getPgVersion();

module.exports = sql;
