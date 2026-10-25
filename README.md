# Quiz Arena

## Estrutura do Projeto

Projeto desenvolvido com TypeScript e Programação Orientada a Objetos (POO).

- `frontend/` — Interface da aplicação.
- `backend/` — API, regras de negócio e acesso ao banco de dados.

## Arquitetura do Backend

- `app/` — Configuração e inicialização da aplicação.
- `containers/` — Instanciação das classes e organização das dependências.
- `middlewares/` — Funções executadas durante as requisições.
- `config/` — Configurações e integrações externas.
- `modules/` — Módulos organizados em `routes`, `controller`, `service` e `repository`.
- `shared/` — Recursos compartilhados entre os módulos.
- `types/` — Tipagens globais e genéricas.
- `routes/` — Agrupamento das rotas da API sob o prefixo `/api`.

## Rotas da API

### Auth — `/api/auth`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/register` | Registrar usuário |
| POST | `/login` | Autenticar usuário |
| POST | `/forgot-password` | Solicitar recuperação de senha |
| POST | `/reset-password/:token` | Redefinir senha usando o token |
| GET | `/me` | Obter dados do usuário autenticado |

### Room — `/api/room`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/create` | Criar sala e selecionar questões |
| POST | `/join/:name` | Entrar em uma sala como jogador |
| GET | `/:name` | Buscar sala e seus jogadores |
| GET | `/:id/start` | Iniciar a sala |
| GET | `/:name/podium` | Buscar o pódio da sala |

### Player — `/api/player`

| Método | Rota | Descrição |
|---|---|---|
| PATCH | `/:playerId/:roomCode/ready` | Alterar o estado de prontidão do jogador |

### Round — `/api/round`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/:roomCode/findRound` | Buscar a rodada atual |
| POST | `/:roomCode/roundFinished` | Finalizar a rodada e atualizar o jogo |

### Answer — `/api/answer`

As rotas de respostas ainda não foram fornecidas.

