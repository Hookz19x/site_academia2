import 'dotenv/config';
import { pool } from './pool.js';

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.log('⚠️ Por favor, informe o e-mail do usuário que deseja apagar.');
  console.log('Exemplo: npm run db:delete-user -- aluno@email.com');
  process.exit(1);
}

async function deleteUser() {
  try {
    const result = await pool.query('DELETE FROM users WHERE email = $1 RETURNING id, name, email', [email]);
    if (result.rowCount === 0) {
      console.log(`❌ Nenhum usuário foi encontrado com o e-mail: ${email}`);
    } else {
      const u = result.rows[0];
      console.log(`✅ O cadastro do usuário "${u.name}" (${u.email}) foi apagado com sucesso!`);
    }
  } catch (error) {
    console.error('❌ Erro ao apagar usuário:', error);
  } finally {
    await pool.end();
  }
}

deleteUser();
