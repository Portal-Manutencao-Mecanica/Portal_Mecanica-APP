'use client'
import { LoginTemplateProps } from "@/props/LoginTemplateProps";
import Image from "next/image";

export function LoginTemplate({ form }: LoginTemplateProps) {
    return (
        // Troca justify-between por justify-center
        <main className="relative flex min-h-screen w-full flex-col justify-center items-center md:overflow-hidden md:bg-cover  bg-white md:bg-[url(/centroweg-noticia-com-filtro.jpg)]  p-6 gap-8">

            <div className=" md:bg-gray-100 md:p-24   md:rounded-lg md:shadow-lg ">
                
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
                    
                    <h1 className=" text-3xl font-black text-[#004780]">PORTAL MANUTENÇÃO</h1>
                    <Image
                        src="/brand/logo-ctw.svg"
                        alt="Portal Manutenção"
                        width={160}
                        height={64}
                        className="w-80 h-auto pb-12"
                    />
                    

                    {form}
                </div>

            </div>



        </main>
    );
}