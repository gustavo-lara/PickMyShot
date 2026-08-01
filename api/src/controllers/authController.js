import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../validations/authValidation.js';
import {
  findFotografoByEmail,
  findFotografoById,
  createFotografo,
  verifyPassword
} from '../services/fotografoService.js';

export const register = async (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message);
      return res.status(400).json({ error: 'Dados inválidos', details: errors });
    }

    const { nome, email, senha } = validation.data;

    const existingUser = await findFotografoByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado' });
    }

    const newFotografo = await createFotografo({ nome, email, senha });

    const token = jwt.sign(
      { id: newFotografo.id, email: newFotografo.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Fotógrafo cadastrado com sucesso',
      user: {
        id: newFotografo.id,
        nome: newFotografo.nome,
        email: newFotografo.email,
        created_at: newFotografo.created_at
      },
      token
    });
  } catch (error) {
    console.error('Erro no registro do fotógrafo:', error);
    return res.status(500).json({ error: 'Erro interno ao cadastrar fotógrafo' });
  }
};

export const login = async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message);
      return res.status(400).json({ error: 'Dados inválidos', details: errors });
    }

    const { email, senha } = validation.data;

    const fotografo = await findFotografoByEmail(email);
    if (!fotografo) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }

    const isPasswordValid = await verifyPassword(senha, fotografo.senha_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }

    const token = jwt.sign(
      { id: fotografo.id, email: fotografo.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      user: {
        id: fotografo.id,
        nome: fotografo.nome,
        email: fotografo.email,
        created_at: fotografo.created_at
      },
      token
    });
  } catch (error) {
    console.error('Erro no login do fotógrafo:', error);
    return res.status(500).json({ error: 'Erro interno ao realizar login' });
  }
};

export const me = async (req, res) => {
  try {
    const fotografo = await findFotografoById(req.user.id);
    if (!fotografo) {
      return res.status(404).json({ error: 'Fotógrafo não encontrado' });
    }

    return res.status(200).json({ user: fotografo });
  } catch (error) {
    console.error('Erro ao buscar dados do fotógrafo logado:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
