import { z } from 'zod';

export const createGaleriaSchema = z.object({
  nome: z.string({ required_error: 'O nome do ensaio/galeria é obrigatório' })
    .min(3, 'O nome da galeria deve ter no mínimo 3 caracteres')
    .max(100, 'O nome da galeria deve ter no máximo 100 caracteres')
    .trim()
});
