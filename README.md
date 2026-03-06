# Angular Kanban

Projeto de teste tecnico com Kanban completo (frontend + backend), usando Angular no cliente, NestJS para API/WebSocket e PostgreSQL hospedado no Supabase.

## Objetivo

Aplicacao para gerenciamento de colunas e tarefas, com suporte a:

- Criacao, edicao e remocao de colunas
- Criacao, edicao e remocao de tarefas
- Movimentacao de tarefas entre colunas
- Atualizacao em tempo real via WebSocket

## Stack Tecnologica

- Angular 21 (SSR habilitado)
- NestJS 11 (API REST + WebSocket)
- PostgreSQL (`pg`)
- Supabase (host do banco PostgreSQL)
- Socket.IO
- TypeScript

## Estrutura do Projeto

Principais pastas:

- `src/app/` - Frontend Angular (componentes e servicos)
- `src/api/` - Backend NestJS (controllers, services e gateway websocket)
- `src/db/` - Repositorios e conexao com banco
- `sql/schema.sql` - Script SQL para criacao do schema e tabelas

## Como Rodar Localmente

### 1. Pre-requisitos

- Node.js 20+
- npm 10+
- Banco PostgreSQL (local ou Supabase)

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
POSTGRES_URL=postgresql://usuario:senha@host:5432/postgres
POSTGRES_SSL=true
PORT=8000
```

Observacoes:

- `POSTGRES_URL` deve apontar para o banco PostgreSQL.
- Em Supabase, normalmente `POSTGRES_SSL=true`.
- Em banco local sem SSL, use `POSTGRES_SSL=false`.

### 4. Criar estrutura do banco

Execute o script:

```bash
sql/schema.sql
```

### 5. Inicializacao local (front e servidor)

Em dois terminais diferentes:

Terminal 1 (Frontend Angular):

```bash
ng serve --port 4200
```

Terminal 2 (Servidor):

```bash
npm run start
```

Aplicacao em `http://localhost:4200` e servidor em `http://localhost:8000`.

### 6. Build e execucao (SSR)

```bash
npm run build
npm start
```

## Scripts Disponiveis

- `npm run dev` - ambiente de desenvolvimento com proxy para API
- `npm run build` - build da aplicacao
- `npm start` - sobe servidor SSR/Express em producao
- `npm run watch` - build em modo watch
- `npm test` - testes unitarios

## API (Resumo)

### Colunas

- `GET /api/colunas`
- `POST /api/colunas`
- `PUT /api/colunas/:id`
- `DELETE /api/colunas/:id`

### Tarefas

- `GET /api/colunas/:id/tarefas`
- `POST /api/tarefas`
- `PUT /api/tarefas/:id`
- `DELETE /api/tarefas/:id`
- `PATCH /api/tarefas/:id/mover`

## WebSocket (Tempo Real)

Eventos principais emitidos:

- `tarefa-atualizada`
- `coluna-atualizada`

## Supabase (Banco de Dados)

Este projeto usa o **Supabase como provedor de PostgreSQL**.

Como configurar:

1. Crie um projeto no Supabase.
2. Copie a string de conexao PostgreSQL do painel do Supabase.
3. Configure no `.env` a variavel `POSTGRES_URL`.
4. Execute `sql/schema.sql` no SQL Editor do Supabase para criar schema, tabelas, indices e funcao de movimentacao.

## Testes

Para executar testes unitarios:

```bash
npm test
```

## 👨‍💻 Autor

- LinkedIn: https://www.linkedin.com/in/vinicius-guedes-9b1508208/
- GitHub: https://github.com/ViniciiuuSS
- Email: vinicraft556@gmail.com
- Telefone: 17991026265
