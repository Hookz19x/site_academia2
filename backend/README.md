# API ÔMEGA GYM

Para instalar o sistema completo em outro computador, consulte o [README principal](../README.md).

API Node.js com Express e PostgreSQL para cadastro, login, perfil e fichas de treino.

## Execução

1. Crie um banco PostgreSQL chamado `omega_gym`.
2. Copie `.env.example` para `.env` e ajuste a conexão e a chave JWT.
3. Instale as dependências com `npm install`.
4. Execute `npm run db:init` para criar as tabelas.
5. Inicie a API com `npm run dev`.

O frontend deve ter `NEXT_PUBLIC_API_URL=http://localhost:3333` em seu `.env.local`.

## Rotas

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me`
- `GET`, `POST /api/workouts`
- `PUT`, `DELETE /api/workouts/:id`
