import { query } from '../config/db.js';
import { generateSlug } from '../utils/slugUtils.js';

export const createGaleria = async ({ fotografoId, nome }) => {
  const linkPublico = generateSlug(nome);

  const result = await query(
    `INSERT INTO galerias (fotografo_id, nome, link_publico)
     VALUES ($1, $2, $3)
     RETURNING id, fotografo_id, nome, link_publico, created_at;`,
    [fotografoId, nome, linkPublico]
  );

  return result.rows[0];
};

export const getGaleriasByFotografo = async (fotografoId) => {
  const result = await query(
    `SELECT 
       g.id,
       g.nome,
       g.link_publico,
       g.created_at,
       COUNT(DISTINCT f.id)::int AS total_fotos,
       COUNT(DISTINCT s.id)::int AS total_selecionadas
     FROM galerias g
     LEFT JOIN fotos f ON f.galeria_id = g.id
     LEFT JOIN selecoes s ON s.foto_id = f.id AND s.aprovado = true
     WHERE g.fotografo_id = $1
     GROUP BY g.id
     ORDER BY g.created_at DESC;`,
    [fotografoId]
  );

  return result.rows;
};

export const getGaleriaBySlug = async (slug) => {
  const result = await query(
    `SELECT id, nome, link_publico, created_at
     FROM galerias
     WHERE link_publico = $1;`,
    [slug]
  );

  return result.rows[0] || null;
};

export const getGaleriaById = async (id, fotografoId) => {
  const result = await query(
    `SELECT id, fotografo_id, nome, link_publico, created_at
     FROM galerias
     WHERE id = $1 AND fotografo_id = $2;`,
    [id, fotografoId]
  );

  return result.rows[0] || null;
};

export const deleteGaleria = async (id, fotografoId) => {
  const result = await query(
    `DELETE FROM galerias
     WHERE id = $1 AND fotografo_id = $2
     RETURNING id;`,
    [id, fotografoId]
  );

  return result.rows[0] || null;
};
