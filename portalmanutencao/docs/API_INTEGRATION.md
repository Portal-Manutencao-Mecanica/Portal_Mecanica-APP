# Integração do Portal da Manutenção com a API

Este documento descreve todas as alterações feitas para integrar o site Next.js
com o projeto
[`Portal-Manutencao-Mecanica/Manutencao-API`](https://github.com/Portal-Manutencao-Mecanica/Manutencao-API).

## 1. Visão geral

A integração foi organizada em quatro camadas:

1. **Componentes e páginas:** exibem dados, estados de carregamento e mensagens de erro.
2. **Services:** concentram as operações de autenticação, turmas e notificações usando Axios.
3. **Route Handlers do Next.js:** funcionam como Backend for Frontend (BFF), mantendo os tokens fora do JavaScript do navegador.
4. **API Spring Boot:** permanece como fonte oficial dos dados e das regras de negócio.

Fluxo simplificado:

```text
Página/componente → service Axios → Route Handler Next.js → API Spring Boot
                                      ↕
                              cookies HttpOnly
```

As páginas Server Components de turmas usam um service Axios executado no
servidor, pois isso evita uma chamada HTTP adicional ao próprio Next.js.

## 2. Configuração

Foi criado o arquivo `.env.example`:

```env
MAINTENANCE_API_URL=http://localhost:8080/api
```

Para desenvolvimento local, copie o arquivo para `.env.local` e altere o valor
caso a API esteja em outro endereço. A URL deve incluir o contexto `/api`.

## 3. Dependência adicionada

### Axios

O pacote `axios` foi incluído em `package.json` e `package-lock.json`.

Ele é usado em todos os services criados para esta integração. As instâncias
possuem timeout de 15 segundos para impedir que a interface espere
indefinidamente quando a API estiver indisponível.

## 4. Services

### `src/services/httpService.ts`

- Cria `browserApi`, com base `/api/backend`, para chamadas autenticadas feitas
  no navegador.
- Cria `authApi`, com base `/api/auth`, para login, sessão e logout.
- Centraliza a leitura das mensagens de erro padronizadas enviadas pela API.
- Define timeout de 15 segundos.

### `src/services/authService.ts`

Disponibiliza:

- `login({ email, password })`;
- `getSession()`;
- `logout()`.

Os componentes não conhecem URLs, headers ou formato interno do transporte.

### `src/services/classGroupService.ts`

Disponibiliza:

- `list()` para `GET /api/turma`;
- `getById(id)` para `GET /api/turma/{id}`.

É um service exclusivo do servidor. Ele lê o access token do cookie `HttpOnly`
e o envia como Bearer token para a API.

### `src/services/notificationService.ts`

Disponibiliza:

- `list()` para `GET /api/notification`;
- `markAllAsRead()` para `PATCH /api/notification/read-all`;
- `toggleRead(id)` para
  `PATCH /api/notification/{id}/toggle-read`, preparado para as telas de
  detalhe.

### `src/services/upstreamApiService.ts`

Cria a instância Axios usada pelos Route Handlers para conversar com a API
Spring Boot. Ela aceita todas as respostas HTTP para que o BFF possa repassar
corretamente status como `400`, `401`, `403` e `404` ao frontend.

### `src/services/sessionService.ts`

Rotaciona o refresh token através de `POST /api/auth/refresh`. O novo par de
tokens é devolvido aos Route Handlers e gravado novamente nos cookies seguros.

## 5. Sessão e segurança

### Cookies utilizados

- `maintenance_access_token`;
- `maintenance_refresh_token`.

Ambos são:

- `HttpOnly`, impedindo leitura por JavaScript;
- `SameSite=Lax`, reduzindo risco de CSRF;
- `Secure` em produção;
- válidos para todo o site.

O access token usa o tempo `expiresIn` retornado pela API. O refresh token usa
prazo máximo de 30 dias no navegador; a expiração efetiva continua sendo
validada pela API.

### Login

1. O formulário chama `authService.login`.
2. O service envia os dados a `POST /api/auth/login` do Next.js.
3. O Route Handler chama `POST /api/auth/login` da API Spring Boot.
4. Tokens são removidos da resposta visível ao restante da aplicação e
   armazenados em cookies `HttpOnly`.
5. O usuário é redirecionado para `/configuracao` quando
   `passwordChangeRequired=true`; nos demais casos, vai para `/`.

### Renovação automática

Quando uma chamada autenticada retorna `401`, o BFF tenta uma única renovação
com o refresh token. Se funcionar:

1. os cookies são atualizados;
2. a solicitação original é repetida com o novo access token;
3. a resposta final é devolvida ao componente.

Isso evita interrupções frequentes da sessão sem criar ciclos infinitos de
tentativas.

### Logout

O logout informa o refresh token à API para revogação. Mesmo se a API estiver
temporariamente indisponível, os cookies locais são apagados e o usuário volta
à tela de login.

## 6. Route Handlers

### `src/app/api/auth/login/route.ts`

Encaminha credenciais à API, preserva o status HTTP e grava a sessão em cookies.

### `src/app/api/auth/session/route.ts`

Consulta `GET /api/auth/me`. Também recupera uma sessão cujo access token tenha
expirado, desde que o refresh token ainda seja válido.

### `src/app/api/auth/logout/route.ts`

Revoga a sessão na API e remove os cookies.

### `src/app/api/backend/[...path]/route.ts`

Proxy autenticado para os services do navegador:

- aceita apenas `GET`, `POST`, `PUT`, `PATCH` e `DELETE`;
- anexa o Bearer token no servidor;
- preserva query strings;
- encaminha JSON e `FormData`;
- repassa status e `Content-Type`;
- renova a sessão e repete a chamada uma vez após `401`;
- nunca expõe o refresh token aos componentes.

## 7. Telas e componentes alterados

### Login

`src/components/organisms/LoginForm.tsx`:

- passou a enviar e-mail e senha reais;
- adicionou nomes, tipos, obrigatoriedade e autocomplete corretos aos campos;
- exibe estado `Entrando...`;
- bloqueia submissões duplicadas;
- apresenta a mensagem enviada pela API;
- respeita o primeiro acesso com troca obrigatória de senha.

### Hook de autenticação

`src/hooks/useAuth.ts`:

- removeu usuário mock e `localStorage`;
- consulta a sessão real por `authService`;
- expõe `user` e `isLoading`;
- trata sessão ausente sem quebrar a interface.

### Perfil

`src/app/perfil/page.tsx`:

- removeu os dados fixos;
- exibe nome, e-mail, username, role e organização vindos da API;
- adicionou estados de carregamento e sessão expirada;
- implementou logout real.

### Lista de turmas

`src/app/turmas/page.tsx`:

- removeu URL `localhost` fixa;
- usa `classGroupService.list()`;
- adotou IDs UUID como `string`;
- adicionou estado vazio;
- apresenta uma tela de erro útil quando sessão/API falham;
- removeu logs de depuração.

### Detalhe da turma

`src/app/turmas/[id]/page.tsx`:

- usa `classGroupService.getById(id)`;
- usa o `params` assíncrono exigido pelo App Router atual;
- adotou UUID para turma e alunos;
- apresenta fallback com navegação em caso de falha.

### Cartão de aluno

`src/components/molecules/StudentCard.tsx` e
`src/props/StudentCardProps.ts`:

- os IDs deixaram de ser `number` e passaram a ser `string`, acompanhando a
  migração da API para UUID.

### Notificações

`src/app/notificacoes/page.tsx`:

- removeu toda a lista mock;
- carrega notificações reais;
- exibe loading e erros;
- implementa “marcar todas como lidas”;
- usa atualização otimista e restaura os dados se a API rejeitar a operação.

`src/components/organisms/Header.tsx`:

- removeu as três notificações fixas;
- carrega até cinco notificações recentes;
- calcula o indicador de não lidas usando `statusRead`;
- usa o UUID correto nos links de detalhe;
- falha silenciosamente no cabeçalho para não bloquear a navegação.

`src/props/NotificationDetailProps.ts`:

- passou a aceitar UUID textual.

### Tipos da API

`src/lib/api/types.ts` documenta os contratos usados pelo frontend:

- usuário;
- role;
- organização;
- login;
- erro;
- notificação;
- turma;
- professor e aluno resumidos.

### Configuração da API

`src/lib/api/config.ts` centraliza:

- URL padrão da API;
- nomes dos cookies;
- atributos de segurança dos cookies.

`src/lib/api/session.ts` centraliza a criação e remoção dos cookies, evitando
configurações divergentes entre login, refresh e logout.

`src/props/UserProfileProps.ts` foi alinhado com UUID para não manter contratos
numéricos incompatíveis.

## 8. Otimizações

### `next.config.ts`

- removeu a exportação CommonJS duplicada;
- ativou compressão;
- removeu o header `X-Powered-By`;
- habilitou saída `standalone`, reduzindo os arquivos necessários em
  implantação containerizada;
- preservou a otimização de imports do `lucide-react`.

### Layout e metadados

`src/app/layout.tsx`:

- corrigiu nome e descrição do portal;
- adicionou template reutilizável de títulos;
- mantém fontes carregadas com `next/font` e `display: swap`.

### Carregamento

`src/app/loading.tsx` adiciona feedback imediato durante transições e
carregamento de segmentos do App Router, com marcação acessível.

### Página inicial

`src/app/page.tsx`:

- corrigiu o antipadrão de passar `children` como propriedade;
- adicionou conteúdo inicial útil em vez de uma tela vazia.

## 9. Consistência visual

### Tokens e padrões globais

`src/app/globals.css` passou a definir uma base visual única:

- fundo e cor de texto padrão;
- raios, sombras e cores de foco;
- foco visível consistente para teclado;
- remoção do highlight irregular em dispositivos touch;
- classes reutilizáveis `ui-page`, `ui-surface`, `ui-field-label` e
  `ui-control`;
- títulos com espaçamento tipográfico uniforme.

### Botões

`src/components/atoms/Button.tsx` agora garante:

- altura mínima de 40 px;
- tipografia, borda, raio e sombra iguais entre variantes;
- estados hover, active, focus e disabled;
- correção da cor warning, que apontava para um token inexistente;
- ícones decorativos ocultos de leitores de tela.

### Campos de formulário

`Input.tsx`, `TextArea.tsx` e `DropDown.tsx` receberam:

- mesma altura, borda, raio, sombra e foco;
- labels associadas aos controles por `htmlFor` e IDs estáveis;
- `aria-invalid`, `aria-describedby` e alertas de erro;
- estados disabled consistentes;
- placeholders sem itálico para melhorar legibilidade;
- textarea redimensionável verticalmente;
- label acessível no dropdown.

### Alternadores e indicadores

- `ToggleButton.tsx` usa a cor institucional e os mesmos estados de interação
  dos botões.
- `MachineConditionBadge.tsx` usa tipografia, padding e borda consistentes para
  todos os status.

### Cards de dados

`DataRowCard.tsx`:

- removeu a largura fixa inválida;
- usa a superfície visual compartilhada;
- tornou ações responsivas e com espaçamento uniforme;
- passa de coluna no mobile para linha em telas maiores.

## 10. Arquivos removidos durante a reorganização

Os arquivos abaixo foram criados na primeira etapa da integração e depois
substituídos pela camada solicitada de services com Axios:

- `src/lib/api/client.ts`;
- `src/lib/api/server.ts`;
- `src/lib/api/response.ts`.

Nenhuma funcionalidade foi perdida. Suas responsabilidades agora estão nos
arquivos de `src/services`.

## 11. Endpoints integrados

| Funcionalidade | Método | Endpoint da API |
|---|---:|---|
| Login | POST | `/api/auth/login` |
| Renovar sessão | POST | `/api/auth/refresh` |
| Usuário atual | GET | `/api/auth/me` |
| Logout | POST | `/api/auth/logout` |
| Listar turmas | GET | `/api/turma` |
| Detalhar turma | GET | `/api/turma/{id}` |
| Listar notificações | GET | `/api/notification` |
| Marcar todas como lidas | PATCH | `/api/notification/read-all` |
| Alternar leitura | PATCH | `/api/notification/{id}/toggle-read` |

## 12. Como executar

1. Inicie a API na porta configurada.
2. Crie `.env.local` a partir de `.env.example`.
3. Instale dependências com `npm install`.
4. Inicie o site com `npm run dev`.
5. Acesse `http://localhost:3000/login`.

## 13. Validação

As verificações usadas nesta alteração são:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

O projeto já possuía erros de lint anteriores à integração. Eles são
documentados no resumo final quando não pertencem aos arquivos modificados.
