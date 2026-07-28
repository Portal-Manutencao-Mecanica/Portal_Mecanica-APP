import type { Metadata } from "next";
import { Roboto_Flex, Roboto} from 'next/font/google';
import "./globals.css";

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-flex',
});

const roboto = Roboto({
  weight: ['600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});


export const metadata: Metadata = {
  title: "Portal Manutenção",
  description: "Portal feito para Alunos, Professores e Cordenadores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${robotoFlex.variable} ${roboto.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
