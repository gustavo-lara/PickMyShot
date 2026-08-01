import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';

export const findFotografoByEmail = async (email) => {
  const result = await query(
    'SELECT id, nome, email, senha_hash, created_at FROM fotografos WHERE email = $1;',
    [email]
  );
  return result.rows[0] || null;
};

export const findFotografoById = async (id) => {
  const result = await query(
    'SELECT id, nome, email, created_at FROM fotografos WHERE id = $1;',
    [id]
  );
  return result.rows[0] || null;
};

export const createFotografo = async ({ nome, email, senha }) => {
  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(senha, salt);

  const result = await query(
    `INSERT INTO fotografos (nome, email, senha_hash)
     VALUES ($1, $2, $3)
     RETURNING id, nome, email, created_at;`,
    [nome, email, senhaHash]
  );

  return result.rows[0];
};

export const verifyPassword = async (senha, senhaHash) => {
  return await bcrypt.compare(senha, senhaHash);
};
