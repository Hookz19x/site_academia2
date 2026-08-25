# ÔMEGA GYM

Sistema web para alunos de academia, com frontend em Next.js e API Node.js conectada ao PostgreSQL. Ele permite criar conta, entrar, consultar o perfil e criar fichas de treino personalizadas.

## Requisitos em um novo computador

Instale antes de começar:

- [Node.js](https://nodejs.org/) 20 ou superior (a versão LTS é recomendada);
- [PostgreSQL](https://www.postgresql.org/download/) 14 ou superior;
- Git, caso o projeto seja baixado de um repositório.

Confirme a instalação no terminal:

```powershell
node --version
npm --version
psql --version
```

## 1. Obter o projeto

Com Git:

```powershell
git clone <URL_DO_REPOSITORIO> site_academia
cd site_academia
```

Ou copie a pasta do projeto para o novo computador e abra um terminal dentro dela.

## 2. Criar o banco de dados

Inicie o serviço PostgreSQL. Em seguida, crie o banco pelo terminal (substitua `postgres` se seu usuário for outro):

```powershell
psql -U postgres -c "CREATE DATABASE omega_gym;"
```

Caso o banco já exista, esse comando pode ser ignorado. Guarde a senha do usuário PostgreSQL: ela será usada na configuração da API.

## 3. Configurar e iniciar o backend

```powershell
cd backend
Copy-Item .env.example .env
```

Abra `backend/.env` e ajuste a conexão. Exemplo para PostgreSQL instalado localmente:

```env
PORT=3333
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/omega_gym
JWT_SECRET=crie-uma-chave-longa-e-unica
FRONTEND_URL=http://localhost:3000
```

Não envie o arquivo `.env` para repositórios públicos, pois ele contém senhas e a chave de autenticação.

Instale os pacotes, crie as tabelas e inicie a API:

```powershell
npm install
npm run db:init
npm run dev
```

Se tudo estiver correto, a API será exibida em `http://localhost:3333`. Mantenha este terminal aberto enquanto usar o sistema.

## 4. Configurar e iniciar o frontend

Abra um segundo terminal na pasta do projeto e execute:

```powershell
cd frontend
Copy-Item .env.local.example .env.local
npm install
npm run dev
```

O arquivo `frontend/.env.local` deve conter:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Abra [http://localhost:3000](http://localhost:3000) no navegador. Cadastre uma conta, faça login e crie seus treinos.

## Uso diário

Em cada uso posterior, não é preciso instalar dependências nem recriar as tabelas. Basta abrir dois terminais:

```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Depois, acesse `http://localhost:3000`.

## Mudança de computador e dados

O código pode ser copiado ou clonado normalmente, mas os dados dos alunos e treinos ficam no banco PostgreSQL do computador antigo. Para levá-los ao novo computador, gere um backup no computador antigo:

```powershell
pg_dump -U postgres -d omega_gym -F c -f omega_gym.backup
```

Copie o arquivo `omega_gym.backup` para o novo computador. Após criar o banco vazio no novo computador, restaure:

```powershell
pg_restore -U postgres -d omega_gym --clean --if-exists omega_gym.backup
```

Se não precisar preservar dados anteriores, execute somente `npm run db:init` no backend para criar uma base nova.

## Solução rápida de problemas

- **Erro de conexão com o banco:** confira se PostgreSQL está em execução, a senha em `DATABASE_URL`, o usuário e a porta (`5432` por padrão).
- **Frontend não acessa a API:** confirme que o backend está em execução e que `NEXT_PUBLIC_API_URL` aponta para `http://localhost:3333`; reinicie o frontend depois de alterar `.env.local`.
- **Porta em uso:** altere `PORT` no `backend/.env` e atualize `NEXT_PUBLIC_API_URL` no frontend com a mesma porta.
- **Erro ao rodar `npm install`:** confirme sua conexão com a internet e use uma versão LTS atual do Node.js.

Documentação específica da API: [backend/README.md](backend/README.md).
