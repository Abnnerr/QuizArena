# Decisões Técnicas — QuizArena

## 1. Objetivo

Este documento registra as principais decisões técnicas tomadas durante o desenvolvimento do QuizArena.

Cada decisão apresenta o contexto, as alternativas consideradas, a escolha realizada e suas consequências.

O objetivo é manter o histórico das escolhas e facilitar futuras evoluções do projeto.

---

## 2. Backend com Node.js e TypeScript

**Contexto:** o projeto precisava de um backend capaz de gerenciar autenticação, partidas multiplayer, operações HTTP e comunicação em tempo real.

**Alternativas consideradas:**
- Node.js com JavaScript.
- Node.js com TypeScript.
- Outras plataformas backend.

**Decisão:** utilizar Node.js com TypeScript.

**Justificativa:**
- Tipagem estática.
- Integração com o ecossistema JavaScript.
- Suporte a aplicações assíncronas.
- Facilidade de compartilhamento de tipos e conhecimentos entre frontend e backend.

**Consequências:**
- Necessidade de configuração de compilação.
- Maior controle sobre os contratos internos.
- Detecção antecipada de diversos erros de tipo.

## 3. Express para construção da API

**Contexto:** era necessário disponibilizar endpoints HTTP para as operações do jogo.

**Alternativas consideradas:**
- Express.
- Outros frameworks Node.js.

**Decisão:** utilizar Express.

**Justificativa:**
- Simplicidade.
- Flexibilidade.
- Ecossistema consolidado.
- Facilidade de integração com middlewares.

**Consequências:**
- A organização das camadas e módulos fica sob responsabilidade do projeto.
- É necessário manter convenções internas para evitar acoplamento excessivo.

## 4. Prisma ORM e PostgreSQL

**Contexto:** o QuizArena necessita persistir usuários, salas, jogadores, questões, respostas e rodadas.

**Alternativas consideradas:**
- Consultas SQL manuais.
- Outros ORMs.
- Prisma ORM com PostgreSQL.

**Decisão:** utilizar Prisma ORM e PostgreSQL.

**Justificativa:**
- Banco relacional adequado às relações entre as entidades.
- Tipagem gerada pelo Prisma.
- Facilidade para organizar consultas e operações.
- Integração com PostgreSQL.

**Consequências:**
- Dependência do schema Prisma.
- Necessidade de manter o banco sincronizado com o modelo de dados.
- Atenção ao desempenho das consultas e transações.

## 5. Arquitetura modular em camadas

**Contexto:** o projeto possui diferentes áreas funcionais e regras de negócio que precisavam ser organizadas.

**Alternativas consideradas:**
- Organização concentrada em poucos arquivos.
- Arquitetura modular em camadas.
- Microsserviços.

**Decisão:** utilizar um backend modular com separação entre controllers, services e repositories.

**Justificativa:**
- Separação de responsabilidades.
- Reutilização de regras de negócio.
- Facilidade de manutenção.
- Menor complexidade operacional que uma arquitetura distribuída.

**Consequências:**
- Mais arquivos e componentes.
- Necessidade de organizar as dependências entre módulos.
- Maior clareza na localização das regras de negócio.

## 6. Strategy para comportamentos variáveis

**Contexto:** o sistema possui diferentes regras de pontuação e comportamentos de power-ups.

**Alternativas consideradas:**
- Condicionais concentradas em um único serviço.
- Estratégias independentes.

**Decisão:** utilizar Strategy para separar comportamentos que variam conforme o modo de jogo ou o power-up.

**Justificativa:**
- Isolamento das regras.
- Facilidade de adicionar novas estratégias.
- Redução da concentração de condicionais.

**Consequências:**
- Maior quantidade de classes.
- Necessidade de manter contratos consistentes entre as estratégias.

## 7. Socket.IO para comunicação em tempo real

**Contexto:** partidas multiplayer exigem comunicação entre os participantes e o servidor durante a execução do jogo.

**Alternativas consideradas:**
- Requisições HTTP periódicas.
- WebSocket implementado diretamente.
- Socket.IO.

**Decisão:** utilizar Socket.IO.

**Justificativa:**
- Comunicação bidirecional.
- Organização de conexões por salas.
- Integração com o servidor Node.js.
- Suporte a eventos em tempo real.

**Consequências:**
- Necessidade de gerenciar conexões e desconexões.
- Necessidade de controlar a entrada nos canais.
- Atenção à escalabilidade quando houver múltiplas instâncias do backend.

## 8. Supabase para hospedagem do PostgreSQL

**Contexto:** o projeto precisava de um banco PostgreSQL acessível pelo backend hospedado.

**Decisão:** utilizar Supabase como serviço de banco de dados.

**Justificativa:**
- PostgreSQL gerenciado.
- Acesso remoto.
- Facilidade de configuração.
- Separação entre aplicação e infraestrutura do banco.

**Consequências:**
- Dependência de um serviço externo.
- Necessidade de proteger credenciais e conexões.
- Dependência de conectividade de rede.

## 9. Vitest para testes automatizados

**Contexto:** era necessário executar testes automatizados para validar regras de negócio.

**Alternativas consideradas:**
- Testes manuais.
- Frameworks de testes JavaScript e TypeScript.

**Decisão:** utilizar Vitest.

**Justificativa:**
- Integração com TypeScript.
- Execução rápida.
- Suporte a mocks e cobertura.
- Configuração simples.

**Consequências:**
- Necessidade de estruturar suítes de testes.
- Necessidade de manter ambientes isolados para testes de integração.

## 10. Pino e OpenTelemetry para observabilidade

**Contexto:** o backend precisava oferecer meios de acompanhar eventos, erros e comportamento das operações.

**Decisão:** utilizar Pino para logs estruturados e OpenTelemetry para instrumentação.

**Justificativa:**
- Logs estruturados facilitam a análise.
- Telemetria permite acompanhar operações.
- Instrumentação favorece a identificação de problemas.

**Consequências:**
- Necessidade de configurar coleta e exportação.
- Necessidade de controlar volume e custo de telemetria.
- Necessidade de correlacionar informações para investigar falhas.

## 11. Decisões futuras

As seguintes decisões devem ser registradas quando forem implementadas:

| Tema | Decisão a documentar |
|---|---|
| Redis | Necessidade de cache, estado compartilhado ou suporte a Socket.IO distribuído |
| BullMQ | Necessidade de processamento assíncrono em filas |
| Índices PostgreSQL | Justificativa baseada em consultas e medições |
| Escalabilidade Socket.IO | Estratégia de distribuição entre instâncias |
| Estratégia de migrations | Processo de evolução do schema do banco |
| CI/CD | Fluxo definitivo de validação e publicação |

## 12. Atualização do documento

Novas decisões devem ser adicionadas quando uma escolha técnica relevante for realizada.

Decisões substituídas devem permanecer registradas, indicando o motivo da mudança e suas consequências.