import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const schemaPath = fileURLToPath(new URL('./schema.sql', import.meta.url));

try {
  await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await pool.query(await readFile(schemaPath, 'utf8'));
  console.log('Banco de dados inicializado com sucesso.');
} finally {
  await pool.end();
}
