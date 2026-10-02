## Quiz Arena

## Estrutura do Projeto

Projeto estruturado em POO com typescript

- `frontend` — Interface da aplicação 
- `backend` — API, regras de negócio e acesso ao banco


## Arquitetura do Backend

O backend é organizado em diferentes responsabilidades:

- `app/` — configuração e inicialização da aplicação.
- `containers/` — instanciação de classes e composições(dependencias) 
- `middlewares/` — funções executadas durante o processamento das requisições.
- `config` — configurações e integração com serviços externos utilizados pela aplicação.
- `modules/` — módulos que representam as principais funcionalidades do sistema. Separadas em routes, controller, service, repository, cada modulo tem o contrato de cada classe
- `shared/` — recursos compartilhados entre diferentes partes da aplicação.
- `types` — tipagens globais e genéricos
