import crypto from 'crypto';

export const generateSlug = (text) => {
  if (!text || typeof text !== 'string') {
    text = 'galeria';
  }

  const cleanText = text
    .normalize('NFD') // Decompõe caracteres acentuados (ex: "á" -> "a" + accent)
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais mantendo espaços e hífens
    .replace(/\s+/g, '-') // Substitui espaços por hífen
    .replace(/-+/g, '-'); // Remove hífens duplicados

  // Gerar hash aleatório de 4 caracteres hexadecimais
  const randomSuffix = crypto.randomBytes(2).toString('hex');

  const baseSlug = cleanText || 'galeria';
  return `${baseSlug}-${randomSuffix}`;
};
