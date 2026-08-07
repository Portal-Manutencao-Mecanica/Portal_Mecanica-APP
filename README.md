Portal da Manutenção — Frontend

Aplicação web do Portal da Manutenção Mecânica, utilizada para acessar os módulos de manutenção, ativos, usuários, compras, 5S, calendário e materiais em um ambiente integrado entre WEG e SENAI.

Status: projeto concluído — release 1.0.0.

Sobre o projeto

O frontend foi desenvolvido com Next.js 15, React 19 e TypeScript, utilizando App Router, componentes reutilizáveis e uma camada de proxy em /api/** para comunicação com a API Spring Boot.

Frontend: https://github.com/Portal-Manutencao-Mecanica/Portal_Mecanica-APP

Backend: https://github.com/Portal-Manutencao-Mecanica/Manutencao-API

Funcionalidades

Autenticação e acesso

login;

refresh de sessão;

logout;

primeiro acesso;

definição de senha definitiva;

recuperação de senha;

proteção de páginas;

controle de funcionalidades por perfil.

Perfis suportados:

ADMIN;

COORDENADOR;

PROFESSOR;

ALUNO.

Os tokens são tratados por cookies protegidos no servidor Next.js.

Usuários e turmas

listagem de usuários;

cadastro e edição;

exclusão;

ativação e inativação;

associação com organizações;

gerenciamento de turmas;

associação de professores e alunos;

importação em massa;

feedback de erros de importação.

Ocorrências e manutenção

solicitações de manutenção;

manutenção corretiva;

manutenção preventiva;

manutenção preditiva;

manutenção autônoma;

aprovação e acompanhamento;

detalhes das solicitações;

prioridades e status;

anexos e evidências.

Máquinas e equipamentos

listagem, pesquisa e paginação;

cadastro e edição;

visualização de detalhes;

patrimônio;

TAG;

local;

condição;

equipamentos e materiais;

código SAP;

estoque;

valores;

imagens e anexos.

Demais módulos

Livro de Máquina;

solicitações de compra;

inconvenientes 5S;

calendário;

eventos;

materiais de apoio;

notificações;

dashboards e visualizações;

formulários e fluxos de aprovação.

Tecnologias

Tecnologia

Uso

Next.js 15.3.6

Framework e App Router

React 19

Interface

TypeScript 5

Tipagem

Tailwind CSS 4

Estilização

Lucide React

Ícones

Recharts

Gráficos

date-fns

Datas

xlsx

Planilhas

ESLint 9

Qualidade

Vercel Analytics

Métricas

Node.js 20

Runtime recomendado

Arquitetura

src/
├── app/                # Rotas, layouts e handlers /api
├── components/         # Componentes reutilizáveis
├── context/            # Contextos
├── lib/                # Tipos, helpers e regras auxiliares
├── services/           # Comunicação com os endpoints
└── ...

O projeto utiliza componentes reutilizáveis em níveis como atoms, molecules, organisms e templates.

Comunicação com a API

O navegador utiliza a camada /api/** do próprio Next.js.

Browser
   │
   │ /api/*
   ▼
Next.js
   │
   │ MAINTENANCE_API_URL
   ▼
Spring Boot
   │
   ├── PostgreSQL
   └── Redis

Essa abordagem permite centralizar:

autenticação;

cookies HTTP-only;

tratamento de erros;

regras de acesso;

comunicação com o backend sem expor diretamente sua URL interna ao navegador.

Pré-requisitos

Node.js 20;

npm;

backend Manutencao-API em execução.

Instalação

git clone https://github.com/Portal-Manutencao-Mecanica/Portal_Mecanica-APP.git
cd Portal_Mecanica-APP
npm install

Configuração

Configure a URL interna da API Spring Boot:

MAINTENANCE_API_URL=http://127.0.0.1:8080/api

Em produção, utilize a URL interna correspondente ao ambiente implantado.

MAINTENANCE_API_URL é utilizada no servidor Next.js. Evite substituir essa configuração por uma variável pública do navegador sem necessidade.

Desenvolvimento

npm run dev

A aplicação é iniciada em:

http://localhost:3333

Build de produção

npm run build
npm run start

Testes e qualidade

Lint:

npm run lint

Smoke tests:

npm run test:smoke

Build:

npm run build

Na validação final arquivada em 06/08/2026, o repositório registrou:

lint aprovado;

7/7 smoke tests aprovados;

build aprovado;

código de saída 0.

As evidências estão em:

evidencias/testes-2026-08-06/

Scripts

Comando

Função

npm run dev

Desenvolvimento na porta 3333

npm run build

Build de produção

npm run start

Execução do build

npm run lint

ESLint sem warnings

npm run test:smoke

Smoke tests

Padrões do projeto

Requisições

As requisições do cliente devem passar pela camada /api/** do Next.js, em vez de acessar diretamente o backend.

Autorização

As regras de acesso por perfil são centralizadas em helpers e guards próprios.

Componentização

A interface reutiliza componentes para:

navbar;

cabeçalhos;

pesquisa;

selects;

botões;

tabelas;

paginação;

diálogos;

feedback de página;

guards;

toasts.

TypeScript

O projeto utiliza TypeScript em modo estrito e alias interno:

@/*

Segurança

O frontend complementa as regras da API com:

cookies httpOnly;

SameSite=Lax;

cookie Secure em produção;

proxy same-origin;

proteção de rotas;

guards por perfil;

controle de ações exibidas na interface;

tratamento de erros HTTP;

políticas e cabeçalhos de segurança;

URL da API mantida no ambiente do servidor.

A autorização do frontend não substitui as validações de segurança do backend.

Estrutura geral

Portal_Mecanica-APP/
├── .github/
├── docs/
├── evidencias/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── lib/
│   └── services/
├── tests/
├── AGENTS.md
├── CONTRIBUTING.md
├── SECURITY.md
├── Dockerfile
├── docker-compose.yml
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md

Backend

A API utilizada pelo frontend está em:

https://github.com/Portal-Manutencao-Mecanica/Manutencao-API

Principais tecnologias da API:

Java 21;

Spring Boot;

Spring Security;

PostgreSQL;

Redis;

Flyway;

JWT.

Status final

A release 1.0.0 marca a conclusão do frontend. A etapa final incluiu hardening de segurança, revisão de rotas protegidas, ajustes de interface, melhoria da comunicação com a API e validação por lint, smoke tests e build.

Desenvolvido como parte do Portal da Manutenção Mecânica — WEG / SENAI.
