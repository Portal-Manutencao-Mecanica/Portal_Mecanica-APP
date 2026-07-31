'use client'

import { LoginTemplateProps } from "@/props/LoginTemplateProps";
import Image from "next/image";

export function LoginTemplate({ form }: LoginTemplateProps) {
    return (
        <main className="flex min-h-screen w-full flex-col md:flex-row overflow-hidden bg-slate-50">

            {/* SEÇÃO DA ESQUERDA - 65% da largura da tela */}
            <section className="relative hidden md:flex md:w-[65%] bg-[url('/centroweg-noticia-com-filtro.jpg')] bg-cover bg-center items-center justify-center p-12">
                {/* Overlay para harmonizar a iluminação da imagem */}
                <div className="absolute inset-0 bg-blue-950/20 backdrop-blur-[1px]" />
            </section>

            {/* SEÇÃO DA DIREITA - 35% da largura da tela */}
            <section className="flex flex-1 md:w-[35%] items-center justify-center p-6 md:p-8 lg:p-12 bg-white">
                <div className="w-full max-w-sm bg-white p-6 md:p-8 rounded-2xl md:shadow-none border-0 flex flex-col items-center">

                    {/* Logos Superiores */}
                    <div className="flex w-full items-center justify-center gap-4 pb-6 border-b border-gray-100 mb-6">
                        <div className="flex justify-center flex-1">
                            <Image
                                src="/brand/logo-portal-manutencao.png"
                                alt="Portal Manutenção"
                                width={160}
                                height={64}
                                className="w-32 md:w-36 h-auto object-contain"
                                priority
                            />
                        </div>

                        <div className="flex justify-center flex-1">
                            <Image
                                src="/brand/logo-ctw.svg"
                                alt="CTW Logo"
                                width={160}
                                height={64}
                                className="w-28 md:w-32 h-auto object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Cabeçalho do Login */}
                    <div className="w-full text-left mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Entrar</h1>
                        <p className="text-sm text-gray-500">Acesse com suas credenciais do portal</p>
                    </div>

                    {/* Formulário de Login */}
                    <div className="w-full">
                        {form}
                    </div>

                </div>
            </section>

        </main>
    );
}