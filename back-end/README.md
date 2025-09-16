# Ristorante Backend

API REST para sistema de gerenciamento de restaurantes

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **Jest** - Testes unitários
- **JWT** - Autenticação

## 📦 Instalação

```bash
npm install
# ou
yarn install
```

## ⚙️ Configuração

1. Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env
```

2. Configure as variáveis no arquivo `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ristorante_db"
PORT=3333
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:3000
```

3. Configure o banco de dados:

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio
npm run prisma:studio
```

## ▶️ Como rodar

```bash
# Desenvolvimento
npm run dev
# ou
yarn dev

# Build para produção
npm run build
# ou
yarn build

# Iniciar em produção
npm start
# ou
yarn start
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test
# ou
yarn test

# Executar testes em modo watch
npm run test:watch
# ou
yarn test:watch

# Executar testes com coverage
npm run test:coverage
# ou
yarn test:coverage
```

## 🌐 Endpoints

- **Health Check**: `GET /api/health`
- **API Info**: `GET /api/`

## 📊 Banco de Dados

O projeto utiliza PostgreSQL com Prisma ORM. As migrações estão localizadas em `prisma/migrations/`.

### Comandos úteis:

```bash
# Criar nova migração
npx prisma migrate dev --name nome_da_migracao

# Reset do banco de dados
npx prisma migrate reset

# Visualizar banco de dados
npx prisma studio
```