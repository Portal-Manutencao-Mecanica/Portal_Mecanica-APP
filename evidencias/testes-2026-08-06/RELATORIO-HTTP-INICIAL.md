# Evidências de testes — 2026-08-06

- Projeto: Portal da Manutenção
- Commit testado: `11a6b10`
- Execução: `2026-08-06T08:36:42-03:00`
- Ambiente: Next.js 16.2.12, servidor local em `http://127.0.0.1:3000`

## Resultado geral

| Verificação | Resultado |
| --- | --- |
| `npm run lint` | Aprovado |
| `npm run build` | Aprovado |
| Rotas públicas | Aprovado |
| Proteção de rotas sem sessão | Aprovado |
| Login administrativo | Aprovado |
| Consulta de sessão autenticada | Aprovado |
| Páginas autenticadas principais | Aprovado |
| Integrações de leitura com a API | Aprovado |
| Logout e invalidação local da sessão | Aprovado |
| Teste visual por navegador | Não executado: navegador integrado indisponível na sessão |

## Escopo executado

Foram validados:

- carregamento das telas públicas de login e recuperação de senha;
- redirecionamento de rotas protegidas para `/login`, preservando `returnTo`;
- autenticação com a conta administrativa de desenvolvimento apresentada pelo frontend;
- criação de dois cookies de sessão e consulta autenticada em `/api/auth/session`;
- renderização HTML das páginas principais autenticadas;
- comunicação do proxy `/backend` com oito endpoints de leitura da API;
- logout com resposta `204` e sessão posterior respondendo `401`;
- lint, TypeScript, compilação e geração das 40 páginas do App Router.

## Arquivos de evidência

- [`lint.txt`](./lint.txt): resultado do ESLint.
- [`build.txt`](./build.txt): resumo verificável da compilação.
- [`http-smoke.txt`](./http-smoke.txt): resultados dos testes HTTP, autenticação, páginas e API.

## Observações

O primeiro build dentro do sandbox não conseguiu acessar o Google Fonts para obter a Roboto. A repetição autorizada com acesso de rede compilou normalmente, demonstrando que não era uma falha de código.

O navegador integrado retornou uma lista vazia de navegadores disponíveis. Por isso, não foram produzidas capturas de tela nem executadas verificações manuais de viewport, teclado e foco. Nenhuma ferramenta de navegador alternativa foi usada, para preservar a confiabilidade e as regras do ambiente de teste.

O teste de credencial inválida via `curl.exe` retornou `502`, mas o corpo enviado por esse comando no PowerShell não pôde ser garantido. Ele não foi considerado um defeito. O login válido feito por `Invoke-WebRequest` retornou `200` e comprovou a integração ativa.
