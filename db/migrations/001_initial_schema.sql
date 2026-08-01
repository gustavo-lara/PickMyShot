CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabela de Usuários (Fotógrafos)
CREATE TABLE IF NOT EXISTS fotografos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Galerias
CREATE TABLE IF NOT EXISTS galerias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fotografo_id UUID NOT NULL REFERENCES fotografos(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  link_publico VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Fotos
CREATE TABLE IF NOT EXISTS fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  galeria_id UUID NOT NULL REFERENCES galerias(id) ON DELETE CASCADE,
  url_storage TEXT NOT NULL,
  thumbnail_url TEXT,
  ordem INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Seleções do Cliente
CREATE TABLE IF NOT EXISTS selecoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foto_id UUID NOT NULL REFERENCES fotos(id) ON DELETE CASCADE,
  aprovado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_foto_selecao UNIQUE (foto_id)
);

-- Índices para otimização de consultas
CREATE INDEX IF NOT EXISTS idx_galerias_fotografo_id ON galerias(fotografo_id);
CREATE INDEX IF NOT EXISTS idx_galerias_link_publico ON galerias(link_publico);
CREATE INDEX IF NOT EXISTS idx_fotos_galeria_id ON fotos(galeria_id);
CREATE INDEX IF NOT EXISTS idx_selecoes_foto_id ON selecoes(foto_id);
