# PickMyShot 📸

Plataforma de seleção e aprovação de fotos para fotógrafos e seus clientes. O fotógrafo cria uma galeria de um ensaio, faz upload das fotos, e o cliente final acessa por um link público — sem precisar criar conta — para visualizar, selecionar e aprovar as fotos que deseja.

---

## Índice

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Stack utilizada](#stack-utilizada)
- [Arquitetura](#arquitetura)
- [Modelagem do banco de dados](#modelagem-do-banco-de-dados)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Endpoints da API](#endpoints-da-api)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Licença](#licença)

---

## Sobre o projeto

Fotógrafos que entregam ensaios fotográficos geralmente precisam de um jeito prático de compartilhar dezenas (ou centenas) de fotos com o cliente e coletar a seleção final — quais fotos vão para o álbum, quais serão editadas, quais serão compradas.

O **PickMyShot** resolve esse fluxo com dois tipos de usuário:

- **Fotógrafo** (autenticado): cria galerias, faz upload das fotos de um ensaio e gera um link público único para compartilhar com o cliente.
- **Cliente final** (sem necessidade de conta): acessa a galeria pelo link, visualiza as fotos em grid, seleciona/favorita as que deseja e confirma a seleção final.

---

## Funcionalidades

### Fotógrafo
- [x] Criar conta e autenticar
- [x] Criar uma galeria (nome do ensaio, dados do cliente)
- [x] Upload de múltiplas fotos por galeria
- [x] Geração automática de link público único (slug) por galeria
- [x] Visualizar quais fotos foram selecionadas/aprovadas pelo cliente

### Cliente final
- [x] Acessar a galeria via link público, sem login
- [x] Visualizar as fotos em grid responsivo
- [x] Selecionar/favoritar múltiplas fotos
- [x] Confirmar a seleção final (submit)

---

## Stack utilizada

| Camada | Tecnologia | Motivo da escolha |
|---|---|---|
| Front-end | React (Vite) | build rápido, ecossistema maduro, ideal para SPA com múltiplas telas |
| Gerenciamento de estado | Context API / useState | suficiente para o escopo atual da seleção de fotos; ver [Roadmap](#roadmap) para evolução |
| Back-end | Node.js + Express | camada de API própria, desacoplada do provedor de dados |
| Banco de dados | PostgreSQL (hospedado no Supabase) | conexão direta via driver `pg`, sem uso do SDK/cliente do Supabase; toda query roda no back-end |
| Armazenamento de arquivos | Supabase Storage (via REST API) | bucket dedicado para as imagens, consumido diretamente por HTTP, sem SDK; o banco guarda apenas a referência (URL) |
| Autenticação | JWT próprio (bcrypt + jsonwebtoken) | implementada na API, sem depender de provedor externo |
| Validação | Zod / Joi na camada da API | toda validação de payload acontece na API, não no banco |
| Deploy (front) | Vercel | deploy contínuo integrado ao repositório |
| Deploy (back) | Render / Railway | hospedagem simples para API Node |
| Controle de versão | Git / GitHub | histórico de commits e colaboração |

---

## Arquitetura

O front-end **nunca se comunica diretamente com o Supabase**. Toda requisição passa por uma API própria em Node/Express, que atua como camada intermediária entre o cliente e a infraestrutura de dados.

O Supabase é usado **apenas como infraestrutura** (Postgres gerenciado + bucket de storage) — a API não utiliza o SDK `supabase-js`, nem Supabase Auth, nem Row Level Security. Toda autenticação, validação e regra de negócio é implementada e controlada dentro da própria API.

**Fluxo de dados:**

1. O **React** faz requisições HTTP para a **API Node/Express**.
2. A **API** valida o payload recebido (Zod/Joi) e autentica o usuário via **JWT próprio**.
3. Para persistência, a API se conecta **diretamente ao Postgres** (hospedado no Supabase) usando o driver `pg`, executando queries/SQL própria — sem passar pelo cliente do Supabase.
4. Para arquivos, a API chama a **REST API do Supabase Storage** via HTTP (usando a service role key), fazendo upload/download do bucket como faria com qualquer storage compatível com S3.
5. O **Postgres** armazena apenas metadados — nunca o binário da imagem.
6. O **Storage** guarda os arquivos de imagem e retorna uma URL (pública ou assinada), que é persistida no Postgres como referência.

```
React (Vite)  ──HTTP──▶  Node.js + Express  ──pg (SQL direto)──▶  Postgres (Supabase)
                              │
                              └──HTTP (REST)──▶  Storage bucket (Supabase)
```

**Por que uma API própria em vez de usar o SDK/Auth do Supabase:**

- Centraliza validação, autenticação e regras de negócio inteiramente no código da API, sem depender de RLS ou de comportamento de um SDK de terceiros.
- Mantém a infraestrutura substituível — trocar o Postgres do Supabase por outro provedor (RDS, Neon, etc.) ou o bucket por outro storage S3-compatible exige só mudar variáveis de ambiente e a camada de acesso, não a lógica da API.
- Facilita testes: queries e regras de negócio ficam isoladas em serviços próprios, sem acoplamento a um SDK externo.
- Facilita a introdução futura de uma camada de cache (ex: Redis) sem qualquer impacto no front-end.

---

## Modelagem do banco de dados

### Tabela `fotografos`

| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | identificador único do fotógrafo |
| nome | text | nome completo do fotógrafo |
| email | text (UNIQUE) | e-mail de acesso |
| senha_hash | text | hash da senha (bcrypt) |
| created_at | timestamp | data de cadastro |

### Tabela `galerias`

| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | identificador único da galeria |
| fotografo_id | uuid (FK) | referência ao fotógrafo dono da galeria |
| nome | text | nome do ensaio/cliente |
| link_publico | text | slug único usado no link compartilhável |
| created_at | timestamp | data de criação |

### Tabela `fotos`

| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | identificador único da foto |
| galeria_id | uuid (FK) | referência à galeria à qual a foto pertence |
| url_storage | text | URL da imagem original no Storage |
| thumbnail_url | text | URL da miniatura, usada na listagem |
| ordem | int | posição de exibição da foto na galeria |

### Tabela `selecoes`

| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | identificador único da seleção |
| foto_id | uuid (FK) | referência à foto selecionada |
| aprovado | boolean | indica se a foto foi aprovada pelo cliente |

### Relacionamentos
- Um fotógrafo possui várias galerias (1:N)
- Uma galeria possui várias fotos (1:N)
- Uma foto pode ter uma seleção associada (1:1)

```sql
create table fotografos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text unique not null,
  senha_hash text not null,
  created_at timestamp default now()
);

create table galerias (
  id uuid primary key default gen_random_uuid(),
  fotografo_id uuid not null references fotografos(id) on delete cascade,
  nome text not null,
  link_publico text unique not null,
  created_at timestamp default now()
);

create table fotos (
  id uuid primary key default gen_random_uuid(),
  galeria_id uuid not null references galerias(id) on delete cascade,
  url_storage text not null,
  thumbnail_url text,
  ordem int default 0
);

create table selecoes (
  id uuid primary key default gen_random_uuid(),
  foto_id uuid not null references fotos(id) on delete cascade,
  aprovado boolean default false
);
```

---

## Estrutura de pastas

```
pickmyshot/
├── client/                   # Front-end React (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Fotografo/
│   │   │   └── GaleriaPublica/
│   │   ├── context/
│   │   ├── services/         # chamadas à API
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
│
├── api/                      # Back-end Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── db/            # conexão e queries via driver pg
│   │   │   └── storage/       # cliente próprio para a REST API do Storage
│   │   ├── validations/       # schemas Zod
│   │   ├── middlewares/       # auth JWT, tratamento de erros
│   │   └── server.js
│   └── package.json
│
├── db/                       # Migrações e scripts SQL
│   ├── migrations/            # arquivos de criação de tabelas
│   └── seeds.sql              # dados iniciais para testes
│
└── README.md
```

---

## Endpoints da API

### Galerias

| Método | Rota | Descrição | Autenticado |
|---|---|---|---|
| POST | `/api/galerias` | cria uma nova galeria | sim |
| GET | `/api/galerias` | lista galerias do fotógrafo logado | sim |
| GET | `/api/galerias/:slug` | retorna dados públicos de uma galeria | não |

### Fotos

| Método | Rota | Descrição | Autenticado |
|---|---|---|---|
| POST | `/api/galerias/:id/fotos` | upload de foto(s) para a galeria | sim |
| GET | `/api/galerias/:slug/fotos` | lista as fotos de uma galeria pública | não |

### Seleções

| Método | Rota | Descrição | Autenticado |
|---|---|---|---|
| POST | `/api/fotos/:id/selecao` | marca/desmarca uma foto como selecionada | não |
| GET | `/api/galerias/:id/selecoes` | lista as fotos selecionadas de uma galeria | sim |

---

## Como rodar o projeto

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com)

### Passo a passo

```bash
# clonar o repositório
git clone https://github.com/seu-usuario/pickmyshot.git
cd pickmyshot

# configurar a API (backend)
cd api
npm install
cp .env.example .env   # preencher com as credenciais do Supabase / Postgres
npm run dev

# configurar o client (frontend)
cd ../client
npm install
cp .env.example .env   # preencher com a URL da API
npm run dev
```

---

## Variáveis de ambiente

**api/.env**
```
DATABASE_URL=
SUPABASE_STORAGE_URL=
SUPABASE_STORAGE_BUCKET=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
PORT=3333
```

**client/.env**
```
VITE_API_URL=http://localhost:3333
```

---

## Licença

Este projeto está sob a licença MIT.