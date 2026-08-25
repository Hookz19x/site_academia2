import 'dotenv/config';
import { pool } from './pool.js';

async function resetDatabase() {
  try {
    await pool.query('TRUNCATE TABLE users CASCADE;');
    console.log('✅ Todos os cadastros de usuários e treinos foram apagados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao apagar o banco de dados:', error);
  } finally {
    await pool.end();
  }
}

resetDatabase();
