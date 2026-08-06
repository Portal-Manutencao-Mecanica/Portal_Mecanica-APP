# Evidências atualizadas de testes — 2026-08-06

- Projeto: Portal da Manutenção
- Commit testado: `11a6b10`
- Execução: `2026-08-06T09:08:41-03:00`
- Frontend: `npm run dev:local`, em `http://localhost:3000`
- Navegador: Chromium controlado pelo Playwright CLI

## Resultado geral

| Verificação | Resultado |
| --- | --- |
| `npm run lint` | Aprovado |
| `npm run build` | Aprovado após liberação de rede para o Google Fonts |
| Login administrativo documentado no README | Aprovado |
| Redirecionamento de rota protegida | Aprovado |
| Dashboard e integração de leitura | Aprovado |
| Listagem e filtro de máquinas | Aprovado |
| Layout desktop e mobile | Aprovado por renderização e árvore semântica |
| Navegação inicial por teclado no login | Aprovado |
| Validação de campos obrigatórios | Aprovado |
| Acessibilidade estrutural | Aprovado com ressalvas registradas |

## Fluxos comprovados no navegador

- `/maquinas`, sem cookie, redirecionou para `/login?returnTo=%2Fmaquinas`.
- A ordem inicial de foco do login foi: e-mail, senha e botão de conta `Administrador`.
- O envio do formulário vazio marcou os dois campos como inválidos e moveu o foco para o e-mail.
- A credencial documentada `admin@teste.local` autenticou o usuário `Administrador de Teste` com perfil `ADMIN`.
- O dashboard carregou os indicadores `25/30`, `5`, `27` e `10`, além de cinco ocorrências recentes.
- `/maquinas` carregou 30 registros em três páginas.
- A busca por `Robô` retornou exatamente `Robô Industrial ABB`, com um registro e uma página.
- Em `390 × 844`, a listagem trocou a tabela por card e preservou menu, busca e paginação.
- `/equipamentos`, `/turmas`, `/ocorrencias` e `/alunos` abriram com sessão válida.

## Arquivos

- [`lint.txt`](./lint.txt): resultado do ESLint.
- [`build.txt`](./build.txt): resultado do build de produção.
- [`http-smoke.txt`](./http-smoke.txt): smoke HTTP, sessão, páginas e proxy da API.
- [`browser-smoke.txt`](./browser-smoke.txt): automação no navegador.
- [`achados.md`](./achados.md): ressalvas encontradas.
- [`capturas/`](./capturas): imagens desktop/mobile.

## Capturas

- [`login-desktop.png`](./capturas/login-desktop.png)
- [`login-mobile.png`](./capturas/login-mobile.png)
- [`rota-protegida-sem-sessao.png`](./capturas/rota-protegida-sem-sessao.png)
- [`dashboard-admin.png`](./capturas/dashboard-admin.png)
- [`maquinas-desktop.png`](./capturas/maquinas-desktop.png)
- [`maquinas-filtro-robo.png`](./capturas/maquinas-filtro-robo.png)
- [`maquinas-mobile.png`](./capturas/maquinas-mobile.png)

## Limitação

As capturas foram produzidas pelo Chromium e os estados foram verificados pela árvore de acessibilidade. O visualizador local de imagens recusou acesso pelo sandbox do Windows, portanto não houve uma segunda inspeção pixel a pixel fora do navegador automatizado.
