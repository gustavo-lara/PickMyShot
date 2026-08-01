import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import galeriaRoutes from './routes/galeriaRoutes.js';
import fotoRoutes from './routes/fotoRoutes.js';
import selecaoRoutes from './routes/selecaoRoutes.js';

import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [];

const allowedOrigins = [
  ...envOrigins,
  'http://localhost:5173',
].filter(Boolean).map(url => url.replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.includes(cleanOrigin) || 
                      /^https:\/\/pick-?my-?shot.*\.vercel\.app$/.test(cleanOrigin);
    if (isAllowed) {
      return callback(null, true);
    }
    return callback(new Error('Acesso bloqueado por CORS'));
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/galerias', galeriaRoutes);
app.use('/api', fotoRoutes);
app.use('/api', selecaoRoutes);

app.get('/', (req, res) => {
  return res.json({ message: 'PickMyShot API - Server Running' });
});

app.get('/health', (req, res) => {
  return res.json({ status: 'ok', service: 'PickMyShot API', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  if (err.message === 'Acesso bloqueado por CORS') {
    return res.status(403).json({ error: 'Origem não permitida' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Erro interno do servidor' });
});


if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`PickMyShot API rodando na porta ${PORT}`);
  });
}

export default app;
