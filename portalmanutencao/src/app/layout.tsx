import type { Metadata } from "next";
import { Roboto_Flex, Roboto_Mono} from 'next/font/google';
import "./globals.css";

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-flex',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
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
      className={`${robotoFlex.variable} ${robotoMono.variable}`}
      
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
