# Estratégia de Testes — QuizArena

## 1. Objetivo

A estratégia de testes do QuizArena busca verificar o comportamento das regras de negócio, a integração entre os componentes do backend e a confiabilidade das funcionalidades da aplicação.

Os testes automatizados ajudam a identificar regressões, validar comportamentos esperados e reduzir o risco de alterações no sistema.

## 2. Ferramentas

| Ferramenta | Finalidade |
|---|---|
| Vitest | Execução dos testes automatizados |
| TypeScript | Verificação estática de tipos |
| Supertest | Testes HTTP de integração, quando configurado |
| Prisma | Acesso ao banco utilizado nos testes |

## 3. Pirâmide de testes

A estratégia proposta utiliza três níveis:

```text
              /\
             /  \
            / E2E\
           /------\
          /        \
         /Integration\
        /--------------\
       /                \
      /      Unitários   \
     /____________________\
```

### 3.1. Testes unitários

Verificam unidades isoladas da aplicação, principalmente regras de negócio implementadas nos services e estratégias.

Exemplos:
- Autenticação.
- Criação e gerenciamento de salas.
- Registro de respostas.
- Cálculo de pontuação.
- Execução de power-ups.
- Gerenciamento de rodadas.

Os testes unitários existentes estão organizados em `src/tests/unit/`.

Estrutura identificada:

```text
src/tests/unit/
├── answer/
├── auth/
├── players/
├── power/
├── question/
├── room/
└── round/
```

### 3.2. Testes de integração

Verificam a interação entre componentes reais da aplicação.

No backend, podem validar:
- Integração entre rotas e controllers.
- Execução de services e repositories.
- Comunicação com PostgreSQL.
- Persistência e consulta de dados.
- Middlewares e autenticação.

A proposta é utilizar Supertest para realizar requisições HTTP e um banco PostgreSQL separado para os testes.

O banco de testes não deve compartilhar os dados do ambiente de desenvolvimento ou produção.

### 3.3. Testes end-to-end

Verificam fluxos completos da aplicação, simulando a utilização por um usuário.

Fluxos candidatos:
- Cadastro e login.
- Criação de uma sala.
- Entrada de jogadores.
- Inicialização de uma partida.
- Envio de respostas.
- Atualização da classificação.
- Encerramento de uma rodada.

A implementação de testes E2E deve ser registrada quando houver uma ferramenta e uma suíte efetivamente configuradas.

## 4. Organização dos testes

Os testes unitários ficam organizados por módulo funcional.

Exemplo:

```text
src/
└── tests/
    └── unit/
        ├── auth/
        ├── room/
        ├── players/
        ├── answer/
        └── round/
```

Essa organização facilita localizar os testes correspondentes às regras de negócio.

## 5. Configuração do Vitest

O projeto utiliza uma configuração semelhante a:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        include: [
            "src/**/*.test.ts",
            "src/**/*.spec.ts",
        ],
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
        },
    },
});
```

## 6. Execução

Executar os testes em modo de observação:

```bash
npm test
```

Executar uma vez:

```bash
npm run test:run
```

Gerar relatório de cobertura:

```bash
npx vitest run --coverage
```

## 7. Banco de dados de testes

Os testes de integração devem utilizar um banco isolado.

O projeto utiliza Supabase para persistência, e a estratégia de testes prevê um projeto separado para evitar alterações nos dados do ambiente principal.

A variável `DATABASE_URL` do ambiente de testes deve apontar exclusivamente para o banco de testes.

A sincronização inicial do schema pode ser realizada com:

```bash
npx prisma db push
```

Esse comando deve ser executado somente com a configuração de ambiente de teste carregada e conferida.

Não executar comandos de sincronização ou limpeza apontando acidentalmente para o banco de desenvolvimento ou produção.

## 8. Integração com CI/CD

A pipeline deve executar verificações antes da publicação de novas versões.

Fluxo recomendado:

```text
Push / Pull Request
        |
        v
Instalação de dependências
        |
        v
Verificação de tipos
        |
        v
Lint
        |
        v
Testes automatizados
        |
        v
Build
        |
        v
Deploy
```

O deploy deve depender da aprovação das verificações obrigatórias.

A configuração efetivamente implementada deve ser conferida no workflow do GitHub Actions.

## 9. Estado de implementação

| Item | Estado conhecido |
|---|---|
| Vitest | Configurado |
| Testes unitários | Existem |
| Cobertura com V8 | Configurada |
| Testes HTTP com Supertest | Em preparação |
| Banco isolado para integração | Projeto separado criado |
| Testes E2E | Não confirmados |
| Pipeline de testes | Implementação a confirmar |

## 10. Melhorias futuras

- Aumentar a cobertura das regras de negócio.
- Implementar testes de integração para todos os módulos HTTP.
- Adicionar testes E2E para os principais fluxos.
- Testar cenários de concorrência em salas.
- Testar eventos e reconexões do Socket.IO.
- Garantir execução dos testes antes do deploy.

## 11. Critério de qualidade

Os testes devem validar comportamentos relevantes, incluindo cenários de sucesso, falhas esperadas, entradas inválidas e limites das regras de negócio.

A cobertura de código deve ser utilizada como indicador auxiliar, não como único critério de qualidade.