import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

async function runMigration() {
  console.log('Executando migrações do banco de dados no Supabase...');

  if (!process.env.DATABASE_URL) {
    console.error('ERRO: DATABASE_URL não foi informada no arquivo .env');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const migrationPath = path.resolve('../db/migrations/001_initial_schema.sql');
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Arquivo de migração não encontrado em: ${migrationPath}`);
    }

    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    const client = await pool.connect();
    await client.query(sql);
    
    console.log('MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('ERRO durante a execução da migração:', error);
    process.exit(1);
  }
}

runMigration();
