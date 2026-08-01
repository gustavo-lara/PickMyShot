import { query } from '../config/db.js';

export const toggleFotoSelecao = async (fotoId) => {
  // Verificar se a foto existe no banco
  const fotoCheck = await query('SELECT id FROM fotos WHERE id = $1;', [fotoId]);
  if (fotoCheck.rows.length === 0) {
    return null;
  }

  // Verificar se já existe um registro de seleção para a foto
  const selecaoCheck = await query('SELECT id, aprovado FROM selecoes WHERE foto_id = $1;', [fotoId]);

  if (selecaoCheck.rows.length === 0) {
    // Inserir nova seleção com aprovado = true
    const insertResult = await query(
      `INSERT INTO selecoes (foto_id, aprovado)
       VALUES ($1, true)
       RETURNING id, foto_id, aprovado, created_at;`,
      [fotoId]
    );
    return insertResult.rows[0];
  } else {
    // Alternar o valor atual de aprovado
    const currentStatus = selecaoCheck.rows[0].aprovado;
    const updateResult = await query(
      `UPDATE selecoes
       SET aprovado = $2
       WHERE foto_id = $1
       RETURNING id, foto_id, aprovado, created_at;`,
      [fotoId, !currentStatus]
    );
    return updateResult.rows[0];
  }
};

export const getSelecoesByGaleriaId = async (galeriaId, fotografoId) => {
  const result = await query(
    `SELECT 
       f.id,
       f.galeria_id,
       f.url_storage,
       f.thumbnail_url,
       f.ordem,
       s.created_at AS selecionado_em
     FROM fotos f
     JOIN selecoes s ON s.foto_id = f.id
     JOIN galerias g ON g.id = f.galeria_id
     WHERE f.galeria_id = $1 AND g.fotografo_id = $2 AND s.aprovado = true
     ORDER BY f.ordem ASC;`,
    [galeriaId, fotografoId]
  );

  return result.rows;
};
