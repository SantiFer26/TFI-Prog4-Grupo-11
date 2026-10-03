import pkg from 'pg';
const { Pool } = pkg;

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'incidencias_db',
  password: '4meric0',
  port: 5432
});
export default db;