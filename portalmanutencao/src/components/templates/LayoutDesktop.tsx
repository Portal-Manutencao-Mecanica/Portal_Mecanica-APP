"use client";

import { useState } from "react";
import Header from "../organisms/Header";
import { SideBar } from "../organisms/SideBar";
import Footer from "../organisms/Footer";


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      <div className="flex flex-1 w-full">
        
        <SideBar
          isMobileMenuOpen={isMobileMenuOpen}
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 md:p-6 w-full">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}