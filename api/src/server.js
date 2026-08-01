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

app.use(cors());
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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`PickMyShot API rodando na porta ${PORT}`);
  });
}

export default app;
