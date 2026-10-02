import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'incidencias_db',
  password: 'santi-0100',
  port: 5432
});
