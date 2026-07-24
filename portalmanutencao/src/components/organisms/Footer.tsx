'use client';

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-weg-blue text-white/80 text-xs py-2.5 px-4 w-full relative z-30 shrink-0 mt-auto">
            <div className="max-w-full mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
                
                {/* Logos */}
                <div className="flex items-center gap-2">
                    <Image
                        src="/brand/logo-icon.svg"
                        alt="WEG logo"
                        width={28}
                        height={18}
                        priority
                    />
                    <Image
                        src="/brand/senai-logo.svg"
                        alt="SENAI logo"
                        width={50}
                        height={26}
                        priority
                    />
                </div>

                {/* Separador - Visível apenas em telas 'sm' ou maiores */}
                <span className="hidden sm:inline text-white/40">|</span>

                {/* Direitos Autorais */}
                <div>
                    <span className="text-white/80">&copy; {currentYear} Portal da Manutenção. Todos os direitos reservados.</span>
                </div>

                {/* Separador - Visível apenas em telas 'sm' ou maiores */}
                <span className="hidden sm:inline text-white/40">|</span>

                {/* Links */}
                <div>
                    <Link 
                        href="/termos" 
                        className="hover:text-white transition-colors no-underline hover:underline"
                    >
                        Termos de Uso
                    </Link>
                </div>

            </div>
        </footer>
    );
}