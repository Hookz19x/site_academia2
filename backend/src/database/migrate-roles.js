import 'dotenv/config';
import { pool } from './pool.js';

async function migrateRoles() {
  try {
    console.log('🔄 Verificando e aplicando migração de perfis (roles)...');

    // 1. Adiciona coluna role se não existir
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'role'
        ) THEN
          ALTER TABLE users 
          ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'aluno' 
          CHECK (role IN ('aluno', 'personal', 'admin'));
          RAISE NOTICE 'Coluna role adicionada com sucesso.';
        END IF;
      END $$;
    `);

    // 2. Adiciona coluna cref se não existir
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'cref'
        ) THEN
          ALTER TABLE users 
          ADD COLUMN cref VARCHAR(30);
          RAISE NOTICE 'Coluna cref adicionada com sucesso.';
        END IF;
      END $$;
    `);

    console.log('✅ Migração de perfis concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao aplicar migração:', error);
  } finally {
    await pool.end();
  }
}

migrateRoles();
