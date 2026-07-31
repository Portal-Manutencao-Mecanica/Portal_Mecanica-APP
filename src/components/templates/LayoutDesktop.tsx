'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "../organisms/Header";
import { SideBar } from "../organisms/SideBar";
import Footer from "../organisms/Footer";
import { Breadcrumbs } from "../molecules/Breadcrumbs";
import { LayoutProps } from "@/props/LayoutProps";
import { useAuth } from "@/hooks/useAuth";

export default function Layout({ children }: LayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isLoading, user } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
            return;
        }
        if (user.passwordChangeRequired) {
            router.replace("/primeiro-acesso");
        }
    }, [isLoading, pathname, router, user]);

    if (isLoading || !user || user.passwordChangeRequired) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-500">Validando sua sessão...</p>
            </main>
        );
    }

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">

            {/* Header conectado ao estado do menu mobile */}
            <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar conectada ao estado do menu mobile */}
                <SideBar 
                    isMobileMenuOpen={isMobileMenuOpen}
                    closeMobileMenu={() => setIsMobileMenuOpen(false)}
                />
                
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 relative">
                    <div className="max-w-7xl mx-auto">
                        <Breadcrumbs />
                        {children}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
