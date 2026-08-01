import { Router } from 'express';
import {
  create,
  listMyGalerias,
  getPublicBySlug,
  remove
} from '../controllers/galeriaController.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = Router();

// Rota pública para clientes finais acessarem via link público (slug)
router.get('/public/:slug', getPublicBySlug);

// Rotas protegidas (exigem fotógrafo autenticado)
router.post('/', ensureAuthenticated, create);
router.get('/', ensureAuthenticated, listMyGalerias);
router.delete('/:id', ensureAuthenticated, remove);

export default router;
