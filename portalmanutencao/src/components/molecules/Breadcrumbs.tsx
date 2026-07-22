'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
    const pathname = usePathname();
    
    const pathSegments = pathname.split('/').filter((segment) => segment !== '');

    if (pathSegments.length === 0) return null;

    const formatPathName = (segment: string) => {
        const dictionary: Record<string, string> = {
            'maquinas': 'Máquinas',
            'ocorrencias': 'Ocorrências',
            'compras': 'Compras',
            'alunos': 'Alunos'
        };
        
        return dictionary[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    };

    return (
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-sm text-gray-500 select-none">
            <Link href="/" className="hover:text-weg-blue transition-colors flex items-center gap-1" aria-label="Página Inicial">
                <Home className="w-4 h-4" />
                <p>Página Inicial</p>
            </Link>
            
            {pathSegments.map((segment, index) => {
                const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                const isLast = index === pathSegments.length - 1;

                return (
                    <div key={href} className="flex items-center">
                        <ChevronRight className="w-4 h-4 mx-2 text-gray-400 shrink-0" />
                        
                        {isLast ? (
                            <span className="font-semibold text-weg-blue" aria-current="page">
                                {formatPathName(segment)}
                            </span>
                        ) : (
                            <Link href={href} className="hover:text-weg-blue transition-colors">
                                {formatPathName(segment)}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}