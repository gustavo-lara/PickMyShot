import { Router } from 'express';
import {
  uploadFotos,
  listPublicFotos,
  listMyGaleriaFotos,
  removeFoto
} from '../controllers/fotoController.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = Router();

// Rota pública para o cliente final listar as fotos de uma galeria pública
router.get('/public/:slug/fotos', listPublicFotos);

// Rotas protegidas (autenticadas para fotógrafos)
router.post('/galerias/:galeriaId/fotos', ensureAuthenticated, upload.array('fotos', 30), uploadFotos);
router.get('/galerias/:galeriaId/fotos', ensureAuthenticated, listMyGaleriaFotos);
router.delete('/fotos/:id', ensureAuthenticated, removeFoto);

export default router;
