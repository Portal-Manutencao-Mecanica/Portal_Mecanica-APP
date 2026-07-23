'use client';

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const currentUser = {
        name: "Alexandre Santos" // Gerará a sigla "AS"
    };

    return (
        <footer className="bg-weg-blue text-white/80 text-xs py-3 px-6 w-full relative z-30 shadow-t-lg shrink-0">
            <div className="max-w-full mx-auto flex flex-col sm:flex-row items-center justify-center gap-2">
                
                <div className="flex items-center gap-2">
                    <Image
                        src="/brand/logo-icon.svg"
                        alt="WEG logo"
                        width={31}
                        height={20}
                        priority
                    />
                    <Image
                        src="/brand/senai-logo.svg"
                        alt="WEG logo"
                        width={58}
                        height={30}
                        priority
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span>|</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-white/80">&copy; {currentYear} Portal da Manutenção. Todos os direitos reservados.</span>
                </div>

                <div className="flex items-center gap-2">
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