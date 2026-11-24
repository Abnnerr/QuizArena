# Backend

Backend da aplicação QuizArena, uma plataforma de quizzes multiplayer inspirada no Kahoot, desenvolvida com Node.js, TypeScript e Express.

## Tecnologias

- Node.js e TypeScript
- Express 5
- PostgreSQL
- Prisma ORM
- Socket.IO
- Zod
- JWT e Bcrypt
- Resend
- Swagger
- Pino e OpenTelemetry
- Vitest e Supertest

## Arquitetura

O projeto utiliza uma arquitetura em camadas, com responsabilidades separadas:

- **Controller:** recebe as requisições e retorna as respostas HTTP.
- **Service:** concentra as regras de negócio.
- **Repository:** responsável pelo acesso e comunicação com o banco de dados.
- **Container:** instancia as classes e realiza a injeção de dependências.

## Estrutura de pastas

```text
backend/
├── prisma/          # Schema e migrations do banco
└── src/
    ├── app/         # Inicialização da aplicação e rotas
    ├── config/      # Configurações de serviços
    ├── containers/  # Injeção de dependências
    ├── db/          # Conexão com o banco
    ├── docs/        # Documentação Swagger
    ├── middlewares/ # Middlewares da aplicação
    ├── modules/     # Módulos e regras da aplicação
    ├── observability/ # Logs, métricas e tracing
    ├── shared/      # Serviços e utilitários compartilhados
    ├── tests/       # Testes unitários e de integração
    └── types/       # Tipagens compartilhadas
```

## Funcionalidades

- Autenticação e gerenciamento de usuários.
- Criação e gerenciamento de salas.
- Entrada e gerenciamento de jogadores.
- Gerenciamento de perguntas, categorias e bibliotecas.
- Controle de rodadas e respostas.
- Sistema de pontuação com estratégias por modo de jogo.
- Power-ups: Fifty Fifty, Double XP e Skip Turn.
- Comunicação em tempo real com Socket.IO.
- Controle de permissões por papéis (RBAC).

## Rotas principais

Todas as rotas da API utilizam o prefixo `/api`.

| Módulo | Prefixo |
|---|---|
| Autenticação | `/api/auth` |
| Salas | `/api/room` |
| Jogadores | `/api/player` |
| Rodadas | `/api/round` |
| Respostas | `/api/answer` |
| Perguntas | `/api/question` |
| Bibliotecas | `/api/library` |
| Categorias | `/api/category` |

## Banco de dados

O projeto utiliza PostgreSQL com Prisma ORM.

O schema contém os modelos de usuários, jogadores, salas, perguntas, alternativas, rodadas, respostas, bibliotecas, categorias, permissões e power-ups.

## Executando o projeto

### Instalação

```bash
cd backend
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na pasta `backend` e configure as variáveis necessárias, incluindo:

```env
PORT=
DATABASE_URL=
NODE_MODE=
URL_FRONT_DEV=
URL_FRONT_PROD=
```

Configure também as credenciais utilizadas pelos serviços externos, como Resend, conforme necessário.

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Produção

```bash
npm start
```

## Testes

O projeto utiliza Vitest e Supertest.

```bash
# Executar testes
npm test

# Executar todos os testes
npm run test:run

# Testes de integração
npm run test:int

# Testes unitários
npm run test:unit
```

## Documentação da API

Com o servidor em execução, a documentação Swagger estará disponível em:

```text
http://localhost:PORT/api-docs
```


## Frontend

### Tecnologias

- **React 19** — construção da interface.
- **TypeScript** — tipagem estática.
- **Vite** — ambiente de desenvolvimento e build.
- **Tailwind CSS 4** — estilização.
- **React Router** — gerenciamento de rotas.
- **Axios** — comunicação com a API.
- **Socket.IO Client** — comunicação em tempo real.
- **Framer Motion** — animações.
- **Cypress** — testes E2E.

### Arquitetura

O frontend é organizado por funcionalidades, separando páginas, componentes, hooks, contextos e serviços.

- **Pages:** páginas e funcionalidades da aplicação, como autenticação, dashboard, bibliotecas e salas.
- **Components:** componentes reutilizáveis e específicos de cada funcionalidade.
- **Hooks:** encapsulam estados e lógicas reutilizáveis.
- **Contexts:** gerenciamento de estados globais, como autenticação, jogadores, salas, tema e notificações.
- **Layouts:** estruturas compartilhadas entre páginas.
- **Services:** comunicação com a API e gerenciamento da conexão Socket.IO.
- **Shared:** componentes, constantes, temas e tipos compartilhados.

### Funcionalidades

- Autenticação e gerenciamento de conta.
- Dashboard e gerenciamento de bibliotecas de perguntas.
- Criação e gerenciamento de salas.
- Lobby e partidas em tempo real.
- Ranking e pódio dos jogadores.
- Temas e notificações.

### Execução

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Executar build localmente
npm run preview

# Verificar código
npm run lint

# Abrir Cypress
npm run cy:open

# Executar testes E2E
npm run test:e2e
```