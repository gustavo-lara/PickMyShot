import { Router } from 'express';
import { register, login, me, updateProfile } from '../controllers/authController.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', ensureAuthenticated, me);
router.put('/me', ensureAuthenticated, updateProfile);

export default router;
