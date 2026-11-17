# Arquitetura do QuizArena

## 1. Visão arquitetural

O backend do QuizArena utiliza uma arquitetura modular organizada em camadas, com separação entre entrada de requisições, regras de negócio e acesso aos dados.

A aplicação mantém os módulos de domínio dentro de um único backend, caracterizando uma organização de monólito modular.

Essa abordagem permite manter os módulos organizados e suas responsabilidades separadas sem introduzir a complexidade operacional de uma arquitetura distribuída.

## 2. Organização em camadas

A estrutura dos módulos segue principalmente três responsabilidades:

| Camada | Responsabilidade |
|---|---|
| Controller | Recebe requisições e coordena as respostas HTTP |
| Service | Executa regras de negócio e coordena operações |
| Repository | Centraliza operações de persistência e consultas |

Também existem componentes de apoio, como DTOs, contratos, schemas, estratégias e middlewares.

## 3. Estrutura do backend

```text
src/
├── app/
│   ├── app.ts
│   ├── index.ts
│   ├── routes.ts
│   └── server.ts
├── config/
├── containers/
├── db/
├── docs/
├── error/
├── middlewares/
├── modules/
│   ├── answers/
│   ├── auth/
│   ├── players/
│   ├── powers/
│   ├── question/
│   ├── room/
│   └── round/
├── observability/
├── shared/
└── types/
```

## 4. Responsabilidades dos módulos

| Módulo | Responsabilidade |
|---|---|
| `auth` | Cadastro, autenticação e recuperação de senha |
| `room` | Criação, entrada, inicialização e gerenciamento de salas |
| `players` | Operações relacionadas aos jogadores |
| `answers` | Registro e processamento de respostas |
| `round` | Controle das rodadas |
| `question` | Operações relacionadas às questões |
| `powers` | Operações internas relacionadas aos power-ups |

Os módulos `question` e `powers` são utilizados internamente por outros serviços, não possuindo rotas HTTP próprias na organização apresentada.

## 5. Composição de dependências

A composição dos componentes é realizada manualmente por meio dos arquivos da pasta `containers`.

Esses arquivos instanciam repositories, services e controllers, fornecendo as dependências necessárias por meio dos construtores.

### Exemplo: Room e Player

O container `roomPlayer.container.ts` realiza a composição dos seguintes componentes:

- `PlayerRepository`
- `RoomRepository`
- `QuestionRepository`
- `RoundRepository`
- `QuestionService`
- `PlayerService`
- `RoomService`
- `PlayerController`
- `RoomController`

Os serviços `PlayerService` e `RoomService` possuem dependência mútua. Para resolver essa relação, o projeto utiliza métodos de configuração posteriores à instanciação:

```ts
playerService.setRoomService(roomService);
roomService.setPlayerService(playerService);
```

Essa abordagem permite construir as instâncias antes de estabelecer a referência entre os serviços.

A composição é feita manualmente, sem depender de um framework específico de injeção de dependências.

## 6. Padrões de projeto

### 6.1. Repository

Os repositories centralizam as operações de acesso aos dados.

Essa separação evita que as regras de negócio dependam diretamente dos detalhes das consultas ao banco de dados.

### 6.2. Service Layer

Os services concentram as regras de negócio e coordenam operações entre repositories e outros serviços.

### 6.3. Strategy

O padrão Strategy é utilizado para separar comportamentos que podem variar conforme uma determinada condição.

Exemplos identificados:

- Estratégias de pontuação para os modos `NORMAL` e `HARDCORE`.
- Estratégias para os power-ups `FIFTY_FIFTY`, `DOUBLE_XP` e `SKIP_TURN`.

### 6.4. Factory

O projeto utiliza componentes de Factory para organizar a seleção e a criação de comportamentos específicos, como estratégias de pontuação e power-ups.

## 7. Fluxo de uma operação

Um fluxo típico de uma operação HTTP segue esta sequência:

```text
Cliente
   |
   v
Express Router
   |
   v
Middlewares
   |
   v
Controller
   |
   v
Service
   |
   v
Repository
   |
   v
PostgreSQL
```

O resultado retorna pelas camadas até o controller, que constrói a resposta HTTP.

## 8. Comunicação em tempo real

O projeto utiliza Socket.IO para comunicação entre clientes e servidor.

A conexão é inicializada no servidor HTTP, e os sockets podem ser agrupados em canais por sala:

```text
room:<roomCode>
```

O módulo de configuração de sockets registra eventos como:

- `room:join`
- `player:leave`
- `round:time_expired`
- `disconnect`

Os eventos recebidos podem acionar serviços da aplicação. Por exemplo, `player:leave` utiliza o `RoomService`, enquanto `round:time_expired` aciona o `RoundService`.

A comunicação em tempo real é integrada aos serviços por meio de um componente `SocketService`.

## 9. Aplicação e inicialização

A inicialização é dividida em responsabilidades:

- `app.ts`: configuração da aplicação Express e registro dos recursos HTTP.
- `routes.ts`: agregação dos routers dos módulos.
- `server.ts`: criação do servidor HTTP, inicialização do Socket.IO e execução do servidor.
- `index.ts`: ponto de entrada da aplicação.

Essa separação permite distinguir a configuração da aplicação do processo de inicialização do servidor.

## 10. Tratamento de erros

A aplicação utiliza a classe `AppError` para representar erros conhecidos da camada de negócio.

Os controllers identificam esses erros e utilizam `HttpResponse` para construir respostas apropriadas.

Erros inesperados são tratados separadamente, evitando que toda exceção seja interpretada como um erro de negócio.

## 11. Observabilidade

O backend possui uma estrutura de observabilidade organizada na pasta `observability`, incluindo componentes relacionados a:

- Logs.
- Medição de operações.
- Telemetria.
- Tracing.

Pino é utilizado para logs estruturados e OpenTelemetry para instrumentação.

Os resultados e as medições de desempenho são documentados em `performance.md`.

## 12. Considerações arquiteturais

A arquitetura atual prioriza:

- Separação de responsabilidades.
- Organização modular.
- Reutilização de regras de negócio.
- Testabilidade dos serviços.
- Centralização das operações de persistência.
- Composição explícita das dependências.

Possíveis evoluções incluem reduzir dependências circulares entre serviços, formalizar contratos entre módulos e ampliar a cobertura de testes.