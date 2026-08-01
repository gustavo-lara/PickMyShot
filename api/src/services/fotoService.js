import crypto from 'crypto';
import path from 'path';
import { query } from '../config/db.js';
import { supabaseStorage } from './storage/supabaseStorage.js';

export const saveUploadedFotos = async ({ galeriaId, files }) => {
  const savedFotos = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueHash = crypto.randomBytes(4).toString('hex');
    const storageFilename = `${galeriaId}/${Date.now()}-${uniqueHash}${ext}`;

    // Upload via REST API para o Supabase Storage
    const publicUrl = await supabaseStorage.uploadFile({
      filename: storageFilename,
      buffer: file.buffer,
      mimeType: file.mimetype
    });

    // Inserção do metadado no banco PostgreSQL
    const result = await query(
      `INSERT INTO fotos (galeria_id, url_storage, thumbnail_url, ordem)
       VALUES ($1, $2, $3, $4)
       RETURNING id, galeria_id, url_storage, thumbnail_url, ordem, created_at;`,
      [galeriaId, publicUrl, publicUrl, i]
    );

    savedFotos.push(result.rows[0]);
  }

  return savedFotos;
};

export const getFotosByGaleriaId = async (galeriaId) => {
  const result = await query(
    `SELECT 
       f.id,
       f.galeria_id,
       f.url_storage,
       f.thumbnail_url,
       f.ordem,
       f.created_at,
       COALESCE(s.aprovado, false) AS selecionada
     FROM fotos f
     LEFT JOIN selecoes s ON s.foto_id = f.id
     WHERE f.galeria_id = $1
     ORDER BY f.ordem ASC, f.created_at ASC;`,
    [galeriaId]
  );

  return result.rows;
};

export const getFotosByGaleriaSlug = async (slug) => {
  const result = await query(
    `SELECT 
       f.id,
       f.galeria_id,
       f.url_storage,
       f.thumbnail_url,
       f.ordem,
       f.created_at,
       COALESCE(s.aprovado, false) AS selecionada
     FROM fotos f
     JOIN galerias g ON g.id = f.galeria_id
     LEFT JOIN selecoes s ON s.foto_id = f.id
     WHERE g.link_publico = $1
     ORDER BY f.ordem ASC, f.created_at ASC;`,
    [slug]
  );

  return result.rows;
};

export const deleteFotoById = async (fotoId, fotografoId) => {
  // Verificar se a foto existe e se pertence a uma galeria do fotógrafo logado
  const findResult = await query(
    `SELECT f.id, f.url_storage, f.galeria_id
     FROM fotos f
     JOIN galerias g ON g.id = f.galeria_id
     WHERE f.id = $1 AND g.fotografo_id = $2;`,
    [fotoId, fotografoId]
  );

  const foto = findResult.rows[0];
  if (!foto) {
    return null;
  }

  // Remover o registro do banco de dados PostgreSQL
  await query('DELETE FROM fotos WHERE id = $1;', [fotoId]);

  // Tentar extrair o nome do arquivo do storage e deletar do bucket
  try {
    const urlParts = foto.url_storage.split('/storage/v1/object/public/galerias/');
    if (urlParts.length === 2) {
      const storageFilename = urlParts[1];
      await supabaseStorage.deleteFile(storageFilename);
    }
  } catch (err) {
    console.warn(`Aviso: Foto ${fotoId} foi removida do banco, mas falhou ao deletar do storage:`, err.message);
  }

  return foto;
};
