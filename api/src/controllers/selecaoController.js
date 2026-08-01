import { toggleFotoSelecao, getSelecoesByGaleriaId } from '../services/selecaoService.js';
import { getGaleriaById } from '../services/galeriaService.js';

export const toggleSelecao = async (req, res) => {
  try {
    const { fotoId } = req.params;

    const selecao = await toggleFotoSelecao(fotoId);
    if (!selecao) {
      return res.status(404).json({ error: 'Foto não encontrada' });
    }

    return res.status(200).json({
      message: selecao.aprovado ? 'Foto selecionada com sucesso' : 'Seleção da foto removida',
      selecao
    });
  } catch (error) {
    console.error('Erro ao alterar seleção da foto:', error);
    return res.status(500).json({ error: 'Erro interno ao processar seleção' });
  }
};

export const listGaleriaSelecoes = async (req, res) => {
  try {
    const { galeriaId } = req.params;
    const fotografoId = req.user.id;

    // Verificar se a galeria existe e pertence ao fotógrafo logado
    const galeria = await getGaleriaById(galeriaId, fotografoId);
    if (!galeria) {
      return res.status(404).json({ error: 'Galeria não encontrada ou acesso negado' });
    }

    const fotosSelecionadas = await getSelecoesByGaleriaId(galeriaId, fotografoId);

    return res.status(200).json({
      total: fotosSelecionadas.length,
      galeria_nome: galeria.nome,
      selecoes: fotosSelecionadas
    });
  } catch (error) {
    console.error('Erro ao buscar seleções da galeria:', error);
    return res.status(500).json({ error: 'Erro interno ao listar seleções' });
  }
};
