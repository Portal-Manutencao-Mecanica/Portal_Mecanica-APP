import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ApiErrorRedirects } from "@/components/providers/ApiErrorRedirects";
import { Roboto } from 'next/font/google';
import "./globals.css";


const roboto = Roboto({
  weight: ['600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "Portal de Manutencao",
  description: "Portal para alunos, professores e coordenadores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${roboto.variable}`}>
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <ApiErrorRedirects>{children}</ApiErrorRedirects>
        </AuthProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
