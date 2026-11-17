# API — QuizArena

## 1. Informações gerais

A API do QuizArena disponibiliza operações para autenticação, gerenciamento de salas, jogadores, rodadas e respostas.

**Base path documentado:** `/api`

**Formato de comunicação:** HTTP.

**Formato de dados:** JSON, conforme os DTOs e contratos utilizados pela aplicação.

A implementação também utiliza cookies para autenticação e Socket.IO para comunicação em tempo real.

## 2. Autenticação

O login configura um cookie chamado `access_token`.

| Propriedade | Configuração |
|---|---|
| Nome | `access_token` |
| `httpOnly` | `true` |
| `sameSite` | `none` |
| `secure` | `true` |
| `maxAge` | 60 minutos |
| `path` | `/` |

O endpoint `/api/auth/me` utiliza `AuthMiddleware` para obter o usuário autenticado.

## 3. Endpoints

### 3.1. Auth

Prefixo: `/api/auth`

| Método | Endpoint | Descrição | Proteção |
|---|---|---|---|
| POST | `/register` | Registrar usuário | Rate Limit e Zod |
| POST | `/login` | Autenticar usuário | Rate Limit e Zod |
| POST | `/forgot-password` | Solicitar recuperação de senha | Rate Limit e Zod |
| POST | `/reset-password/:token` | Redefinir senha | Rate Limit e Zod |
| GET | `/me` | Buscar usuário autenticado | AuthMiddleware |

#### Respostas conhecidas

| Endpoint | Sucesso | Mensagem |
|---|---:|---|
| `POST /register` | 201 | `Olhe sua caixa de Emails` |
| `POST /login` | 200 | `Usuario logado` |
| `POST /forgot-password` | 200 | `Usuario registrado` |
| `POST /reset-password/:token` | 200 | `Conta recuperada` |
| `GET /me` | 200 | `usuario encontrado` |

Os erros conhecidos utilizam o status e a mensagem de `AppError`. Os erros inesperados retornam HTTP 500.

#### DTOs utilizados

| Endpoint | DTO |
|---|---|
| `POST /register` | `RegisterDTO` |
| `POST /login` | `LoginDTO` |
| `POST /forgot-password` | `ForgotDTO` |
| `POST /reset-password/:token` | `ResetDTO` |

O controller utiliza `email` em `ForgotDTO`, `password` em `ResetDTO` e o usuário autenticado em `req.user` para `/me`.

### 3.2. Room

Prefixo: `/api/room`

| Método | Endpoint | Descrição | Proteção |
|---|---|---|---|
| POST | `/create` | Criar sala | Rate Limit, Auth, Policy `ROOM_CREATE`, Zod |
| POST | `/join/:name` | Entrar em sala | Rate Limit e Zod |
| GET | `/:name` | Buscar sala | Rate Limit |
| GET | `/:id/start` | Iniciar partida | Rate Limit, Auth, Policy `ROOM_START` |
| DELETE | `/:roomCode/:roundId/limpar` | Limpar sala/rodada | Rate Limit, Auth, Policy `ROOM_DELETE` |

Schemas identificados:
- `roomCreateSchema`
- `roomJoinSchema`

### 3.3. Player

Prefixo: `/api/player`

| Método | Endpoint | Descrição | Proteção |
|---|---|---|---|
| GET | `/:roomCode/podium` | Buscar classificação | Rate Limit |
| PATCH | `/:playerId/:roomCode/ready` | Atualizar prontidão | Rate Limit e Zod |
| POST | `/:roomCode/:playerId/:powerId/:userName/powerup` | Executar power-up | Rate Limit |

Schema identificado:
- `playerReadySchema`

Power-ups disponíveis:
- `FIFTY_FIFTY`
- `DOUBLE_XP`
- `SKIP_TURN`

### 3.4. Round

Prefixo: `/api/round`

| Método | Endpoint | Descrição | Proteção |
|---|---|---|---|
| GET | `/:roomCode/:playerId/findRound` | Buscar rodada por jogador | Rate Limit |
| GET | `/:roomCode/findRound` | Buscar rodada da sala | Rate Limit |
| POST | `/:roomCode/roundFinished` | Finalizar rodada | Rate Limit, Auth, Policy `ROUND_FINISH`, Zod |

Schema identificado:
- `finishedSchema`

### 3.5. Answer

Prefixo: `/api/answer`

| Método | Endpoint | Descrição | Proteção |
|---|---|---|---|
| POST | `/:roomCode/createAnswer` | Registrar resposta | Rate Limit e Zod |

Schema identificado:
- `createAnswerSchema`

## 4. Permissões

As seguintes permissões foram identificadas:

| Permissão | Operação |
|---|---|
| `ROOM_CREATE` | Criar sala |
| `ROOM_START` | Iniciar partida |
| `ROOM_DELETE` | Limpeza de sala |
| `ROUND_FINISH` | Finalizar rodada |

## 5. Respostas e erros

O backend utiliza `HttpResponse.success()` para respostas de sucesso e `HttpResponse.warning()` para erros ou situações não esperadas.

Os erros conhecidos são representados por `AppError`.

| Situação | Comportamento identificado |
|---|---|
| Sucesso | Status definido pelo controller |
| Erro conhecido | Status e mensagem do `AppError` |
| Erro inesperado | HTTP 500 |

O formato completo do envelope de resposta depende da implementação de `ResponseDTO` e `HttpResponse`.

## 6. Pontuação

Os valores máximos identificados na implementação são:

| Modo | Pontuação máxima |
|---|---:|
| NORMAL | 900 |
| HARDCORE | 500 |

O cálculo considera o tempo restante da rodada e utiliza estratégias específicas para cada modo.

## 7. Socket.IO

O sistema também utiliza eventos Socket.IO.

Canal de sala:

```text
room:<roomCode>
```

Eventos identificados:

| Evento | Direção | Finalidade |
|---|---|---|
| `room:join` | Cliente → Servidor | Entrar no canal da sala |
| `player:leave` | Cliente → Servidor | Solicitar saída do jogador |
| `round:time_expired` | Cliente → Servidor | Informar término do tempo |
| `room:update` | Servidor → Clientes | Notificar atualização após saída |
| `disconnect` | Cliente → Servidor | Registrar desconexão |

O evento `round:time_expired` aciona o método `roundExpired` do serviço de rodadas.

## 8. Informações pendentes para especificação completa

Os seguintes detalhes ainda precisam ser extraídos dos arquivos de implementação:

- Campos e tipos completos dos DTOs.
- Exemplos de bodies de requisição.
- Formatos completos das respostas.
- Códigos HTTP de todos os erros.
- Regras detalhadas de validação.
- Contratos dos eventos Socket.IO.

A documentação deve acompanhar as alterações realizadas nos controllers, schemas e contratos da API.