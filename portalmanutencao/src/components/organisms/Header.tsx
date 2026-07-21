import { CircleQuestionMark } from "lucide-react";
import { Bell } from 'lucide-react';
import { Settings } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";

export default function Header () {
    return (
        <header className="bg-weg-blue w-full py-7 px-8 shadow-md">
            <nav className="max-full mx-auto flex items-center justify-between">
                <Link href="/" aria-label="Ir para a página inicial" className="flex items-center">
                    <Image 
                     src="/brand/logo-icon.svg"
                     alt="WEG logo"
                     width={39}
                     height={25}
                     priority
                    />
                </Link>
                <h1 className="text-3xl text-white font-semibold">
                    Portal da Manutenção
                </h1>
                <div>
                    <ul className="flex items-center gap-4">
                        <li>
                            <button aria-label="Ajuda">
                                <CircleQuestionMark color="white" size={24} />
                            </button>
                        </li>
                        <li>
                            <button aria-label="Notificações">
                                <Bell color="white" size={24} />
                            </button>
                        </li>
                        <li>
                            <button aria-label="Configurações">
                                <Settings color="white" size={24} />
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}