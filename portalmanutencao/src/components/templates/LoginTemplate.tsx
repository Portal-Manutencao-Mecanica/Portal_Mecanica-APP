'use client'
import { LoginTemplateProps } from "@/props/LoginTemplateProps";
import Image from "next/image";

export function LoginTemplate({ form }: LoginTemplateProps) {
    return (
        // Troca justify-between por justify-center
        <main className="relative flex min-h-screen w-full flex-col justify-center items-center md:overflow-hidden md:bg-cover  bg-white md:bg-[url(/centroweg-noticia-com-filtro.jpg)]  p-6 gap-8">

            <div className=" md:bg-gray-100 md:p-24   md:rounded-lg md:shadow-2xl ">

                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden md:hidden">
                    <Image
                        src="/wrench-gray.svg"
                        alt="Desenho Chave de Boca"
                        width={600}
                        height={600}
                        priority
                        className="absolute top-1/2 left-1/2 w-[100%] max-w-none -translate-x-[45%] -translate-y-[55%] rotate-[0deg] fill-black"
                    />
                </div>

                <div className="relative z-10 flex w-full max-w-sm flex-col items-center my-auto">
                    <div className="flex w-full items-center justify-center gap-4 md:flex-row pb-7">
                        
                        <div className="flex justify-center flex-1">
                            <Image
                                src="/brand/logo-portal-manutencao.png"
                                alt="Portal Manutenção"
                                width={160}
                                height={64}
                                className="w-32 md:w-44 h-auto object-contain"
                            />
                        </div>

                       
                        <div className="flex justify-center flex-1">
                            <Image
                                src="/brand/logo-ctw.svg"
                                alt="CTW Logo"
                                width={160}
                                height={64}
                                className="w-28 md:w-40 h-auto object-contain"
                            />
                        </div>
                    </div>

                    {form}
                </div>

            </div>

        </main>
    );
}