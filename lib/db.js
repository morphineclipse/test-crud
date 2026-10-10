import { Pool } from "pg";

const globalForPg = globalThis;

if (!globalForPg.__crudPool) {
  globalForPg.__crudPool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

export const pool = globalForPg.__crudPool;

export async function query(text, params) {
  return pool.query(text, params);
}
