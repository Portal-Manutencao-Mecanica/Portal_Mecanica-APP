'use client';

import { useState } from "react";
import Header from "../organisms/Header";
import { SideBar } from "../organisms/SideBar";
import Footer from "../organisms/Footer";
import { Breadcrumbs } from "../molecules/Breadcrumbs";
import { LayoutProps } from "@/props/LayoutProps";

export default function Layout({ children }: LayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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