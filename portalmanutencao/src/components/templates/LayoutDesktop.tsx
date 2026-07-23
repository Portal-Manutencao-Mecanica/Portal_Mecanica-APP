import Header from "../organisms/Header";
import { SideBar } from "../organisms/SideBar";
import { Breadcrumbs } from "../molecules/Breadcrumbs";
import { LayoutProps } from "@/props/LayoutProps";

export default function LayoutDesktop({ children }: LayoutProps) {
    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <SideBar />
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 relative">
                    <div className="max-w-7xl mx-auto">
                        <Breadcrumbs />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );


}