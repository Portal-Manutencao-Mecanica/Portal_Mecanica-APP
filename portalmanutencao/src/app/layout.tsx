import type { Metadata } from "next";
import { Roboto_Flex, Roboto} from 'next/font/google';
import "./globals.css";
import { Toaster } from "sonner";

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
  title: {
    default: "Portal da Manutenção",
    template: "%s | Portal da Manutenção",
  },
  description: "Portal de manutenção para alunos, professores e coordenadores.",
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
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
