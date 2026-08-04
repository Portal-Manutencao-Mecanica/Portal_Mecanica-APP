'use client';

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-weg-blue text-white/80 text-xs py-3 px-6 w-full relative z-30 shadow-t-lg shrink-0">
            {/* Mantido o flex original, apenas permitindo flex-col em mobile e flex-row em telas sm: */}
            <div className="max-w-full mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2">
                
                <div className="flex items-center gap-2">
                    <Image
                        src="/brand/logo-icon.svg"
                        alt="WEG logo"
                        width={30}
                        height={20}
                        priority
                    />
                    <Image
                        src="/brand/senai-logo.svg"
                        alt="SENAI logo"
                        width={75}
                        height={20}
                        priority
                    />
                </div>

                {/* Divisor oculto em telas muito pequenas para não quebrar linha sozinho */}
                <div className="hidden sm:flex items-center gap-2">
                    <span>|</span>
                </div>

                <div className="flex items-center gap-2 text-center">
                    <span className="text-white/80">&copy; {currentYear} Portal da Manutenção. Todos os direitos reservados.</span>
                </div>

                {/* Divisor oculto em telas muito pequenas */}
                <div className="hidden sm:flex items-center gap-2">
                    <span>|</span>
                </div>

                <div className="flex items-center gap-6">
                    <nav className="flex items-center gap-4">
                        <Link 
                            href="/termos" 
                            className="hover:text-white transition-colors no-underline hover:underline"
                        >
                            Termos de Uso
                        </Link>
                    </nav>
                </div>

            </div>
        </footer>
    );
}
