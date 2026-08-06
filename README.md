This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Integração com a API

O frontend usa a API
[`Manutencao-API`](https://github.com/Portal-Manutencao-Mecanica/Manutencao-API)
por meio de rotas server-side do Next.js. Os tokens de acesso e renovação ficam em
cookies `httpOnly`; eles não são expostos ao JavaScript do navegador.

Copie `.env.example` para `.env.local` caso a API não esteja disponível em
`http://127.0.0.1:8080/api`:

```env
MAINTENANCE_API_URL=http://127.0.0.1:8080/api
```

No perfil `dev`, o Flyway da API disponibiliza as contas abaixo. Todas usam a
senha `Senha@123`:

| Perfil | E-mail |
| --- | --- |
| Administrador | `admin@teste.local` |
| Coordenador | `coordenador@teste.local` |
| Professor | `professor@teste.local` |
| Aluno | `aluno@teste.local` |

Durante o desenvolvimento, a tela de login oferece atalhos para preencher essas
credenciais.

## Getting Started

Para iniciar o frontend com um link público temporário, execute:

```bash
npm run dev
```

O terminal imprime `Link público: https://...trycloudflare.com` após o frontend
ficar disponível. A URL muda a cada inicialização e funciona enquanto o comando
permanecer em execução. A API também precisa estar em execução em
`http://127.0.0.1:8080/api`.

Para iniciar somente localmente, sem criar um túnel:

```bash
npm run dev:local
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
