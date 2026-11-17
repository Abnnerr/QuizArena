# QuizArena

QuizArena é uma plataforma de quiz multiplayer inspirada em jogos como Kahoot, na qual os participantes podem entrar em salas, responder perguntas em tempo real e competir por pontuação e classificação.

O projeto foi desenvolvido com TypeScript e utiliza uma arquitetura modular no backend, comunicação em tempo real com Socket.IO e persistência de dados com PostgreSQL.

## Tecnologias

### Backend
- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Socket.IO
- Zod
- JWT
- Pino
- OpenTelemetry

### Frontend
- React
- TypeScript
- Tailwind CSS

### Infraestrutura e ferramentas
- Git e GitHub
- Supabase
- Vitest
- Honeycomb
- Docker Compose
- GitHub Actions

> A disponibilidade e o estágio de configuração de cada ferramenta devem ser conferidos nos respectivos arquivos de configuração do projeto.

## Funcionalidades

- Cadastro e autenticação de usuários.
- Recuperação e redefinição de senha.
- Criação e gerenciamento de salas.
- Entrada de jogadores em salas.
- Inicialização de partidas.
- Perguntas com alternativas.
- Registro e cálculo de pontuação.
- Classificação dos jogadores.
- Power-ups durante as partidas.
- Comunicação em tempo real.
- Diferentes modos de jogo.

## Estrutura do projeto

```text
QuizArena/
├── frontend/
├── backend/
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── testing.md
│   ├── decisions.md
│   └── performance.md
├── docker-compose.yml
└── README.md
```

## Instalação

Clone o repositório:

```bash
git clone <REPOSITORY_URL>
cd QuizArena
```

Instale as dependências do backend:

```bash
cd backend
npm install
```

Instale as dependências do frontend:

```bash
cd ../frontend
npm install
```

Configure as variáveis de ambiente necessárias em cada aplicação, utilizando os arquivos de exemplo disponibilizados no repositório, quando existentes.

Não versione arquivos `.env` com credenciais reais.

## Execução

### Backend

Na pasta `backend`:

```bash
npm run dev
```

Para compilar:

```bash
npm run build
```

Para executar a versão compilada:

```bash
npm start
```

### Frontend

Na pasta `frontend`, utilize o script de desenvolvimento definido no `package.json`:

```bash
npm run dev
```

## Testes

Os testes automatizados do backend utilizam Vitest.

Para executar os testes:

```bash
npm test
```

Para executar uma vez, sem modo de observação:

```bash
npm run test:run
```

A estratégia de testes e o estado de implementação estão documentados em [docs/testing.md](docs/testing.md).

## Documentação técnica

| Documento | Conteúdo |
|---|---|
| [architecture.md](docs/architecture.md) | Organização interna e arquitetura |
| [api.md](docs/api.md) | Contratos e endpoints HTTP |
| [testing.md](docs/testing.md) | Estratégia e execução dos testes |
| [decisions.md](docs/decisions.md) | Justificativas das decisões técnicas |
| [performance.md](docs/performance.md) | Observabilidade e otimizações |

## Observabilidade

O backend utiliza Pino para geração de logs estruturados e possui instrumentação com OpenTelemetry.

O projeto também utiliza Honeycomb para análise de dados de observabilidade.

Os detalhes da instrumentação, métricas e melhorias de desempenho estão descritos em [docs/performance.md](docs/performance.md).

## Infraestrutura

O repositório possui uma configuração de Docker Compose destinada à execução dos serviços em ambiente local.

A configuração deve ser mantida alinhada às dependências reais do projeto e às variáveis de ambiente necessárias.

## Contribuição

Alterações devem preservar a separação de responsabilidades e os padrões utilizados na arquitetura do projeto.

Novas funcionalidades devem incluir testes compatíveis com sua complexidade e atualizar a documentação quando houver mudanças nos contratos ou comportamentos existentes.

## Licença

A licença do projeto deve ser definida e registrada neste repositório.