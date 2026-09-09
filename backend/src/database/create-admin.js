import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from './pool.js';

const nome = process.argv[2]?.trim();
const email = process.argv[3]?.trim().toLowerCase();
const senha = process.argv[4];

if (!nome || !email || !senha || senha.length < 6) {
  console.log('⚠️ Uso correto:');
  console.log('node src/database/create-admin.js "<NOME>" "<EMAIL>" "<SENHA_MINIMO_6_DIGITOS>"');
  console.log('Exemplo: npm run db:create-admin -- "Administrador Geral" admin@omegagym.com senha123');
  process.exit(1);
}

const membershipCode = () => `OMEGA-ADM-${Math.floor(1000 + Math.random() * 9000)}`;

async function createAdmin() {
  try {
    const passwordHash = await bcrypt.hash(senha, 12);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, plan_name, plan_status, membership_code)
       VALUES ($1, $2, $3, 'admin', 'Administrador do Sistema', 'Ativo', $4)
       ON CONFLICT (email) DO UPDATE 
       SET role = 'admin', password_hash = $3, name = $1, plan_name = 'Administrador do Sistema'
       RETURNING id, name, email, role, membership_code`,
      [nome, email, passwordHash, membershipCode()]
    );

    const admin = result.rows[0];
    console.log(`✅ Administrador configurado com sucesso!`);
    console.log(`👤 Nome: ${admin.name}`);
    console.log(`📧 E-mail: ${admin.email}`);
    console.log(`🛡️ Cargo: ${admin.role}`);
    console.log(`🏷️ Matrícula: ${admin.membership_code}`);
  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error);
  } finally {
    await pool.end();
  }
}

createAdmin();
