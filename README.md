# Quiz Arena

## Estrutura do Projeto

Projeto desenvolvido com **TypeScript e Programação Orientada a Objetos (POO)**.

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

| Rota | Responsabilidade |
|---|---|
| `/api/auth` | Autenticação |
| `/api/room` | Gerenciamento das salas |
| `/api/player` | Gerenciamento dos jogadores |
| `/api/round` | Gerenciamento das rodadas |
| `/api/answer` | Respostas dos jogadores |

