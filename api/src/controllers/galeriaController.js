import { createGaleriaSchema } from '../validations/galeriaValidation.js';
import {
  createGaleria,
  getGaleriasByFotografo,
  getGaleriaBySlug,
  deleteGaleria
} from '../services/galeriaService.js';

export const create = async (req, res) => {
  try {
    const validation = createGaleriaSchema.safeParse(req.body);
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message);
      return res.status(400).json({ error: 'Dados inválidos', details: errors });
    }

    const { nome } = validation.data;
    const fotografoId = req.user.id;

    const galeria = await createGaleria({ fotografoId, nome });

    return res.status(201).json({
      message: 'Galeria criada com sucesso',
      galeria
    });
  } catch (error) {
    console.error('Erro ao criar galeria:', error);
    return res.status(500).json({ error: 'Erro interno ao criar galeria' });
  }
};

export const listMyGalerias = async (req, res) => {
  try {
    const fotografoId = req.user.id;
    const galerias = await getGaleriasByFotografo(fotografoId);

    return res.status(200).json({ galerias });
  } catch (error) {
    console.error('Erro ao listar galerias do fotógrafo:', error);
    return res.status(500).json({ error: 'Erro interno ao listar galerias' });
  }
};

export const getPublicBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const galeria = await getGaleriaBySlug(slug);

    if (!galeria) {
      return res.status(404).json({ error: 'Galeria não encontrada' });
    }

    return res.status(200).json({ galeria });
  } catch (error) {
    console.error('Erro ao buscar galeria pública:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar galeria' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const fotografoId = req.user.id;

    const deleted = await deleteGaleria(id, fotografoId);
    if (!deleted) {
      return res.status(404).json({ error: 'Galeria não encontrada ou sem permissão para exclusão' });
    }

    return res.status(200).json({ message: 'Galeria excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir galeria:', error);
    return res.status(500).json({ error: 'Erro interno ao excluir galeria' });
  }
};
