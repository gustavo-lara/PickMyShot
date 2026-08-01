import { getGaleriaById } from '../services/galeriaService.js';
import {
  saveUploadedFotos,
  getFotosByGaleriaId,
  getFotosByGaleriaSlug,
  deleteFotoById
} from '../services/fotoService.js';

export const uploadFotos = async (req, res) => {
  try {
    const { galeriaId } = req.params;
    const fotografoId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Verificar se a galeria existe e pertence ao fotógrafo logado
    const galeria = await getGaleriaById(galeriaId, fotografoId);
    if (!galeria) {
      return res.status(404).json({ error: 'Galeria não encontrada ou sem permissão para upload' });
    }

    const fotos = await saveUploadedFotos({ galeriaId, files: req.files });

    return res.status(201).json({
      message: `${fotos.length} foto(s) enviada(s) com sucesso`,
      fotos
    });
  } catch (error) {
    console.error('Erro no upload de fotos:', error);
    return res.status(500).json({ error: 'Erro interno ao realizar upload de fotos' });
  }
};

export const listPublicFotos = async (req, res) => {
  try {
    const { slug } = req.params;
    const fotos = await getFotosByGaleriaSlug(slug);

    return res.status(200).json({ fotos });
  } catch (error) {
    console.error('Erro ao listar fotos públicas da galeria:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar fotos' });
  }
};

export const listMyGaleriaFotos = async (req, res) => {
  try {
    const { galeriaId } = req.params;
    const fotografoId = req.user.id;

    const galeria = await getGaleriaById(galeriaId, fotografoId);
    if (!galeria) {
      return res.status(404).json({ error: 'Galeria não encontrada ou acesso negado' });
    }

    const fotos = await getFotosByGaleriaId(galeriaId);

    return res.status(200).json({ fotos });
  } catch (error) {
    console.error('Erro ao listar fotos da galeria:', error);
    return res.status(500).json({ error: 'Erro interno ao listar fotos' });
  }
};

export const removeFoto = async (req, res) => {
  try {
    const { id } = req.params;
    const fotografoId = req.user.id;

    const deleted = await deleteFotoById(id, fotografoId);
    if (!deleted) {
      return res.status(404).json({ error: 'Foto não encontrada ou sem permissão para exclusão' });
    }

    return res.status(200).json({ message: 'Foto excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir foto:', error);
    return res.status(500).json({ error: 'Erro interno ao excluir foto' });
  }
};
