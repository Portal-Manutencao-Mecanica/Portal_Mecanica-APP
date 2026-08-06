

import MaintenceForm from "@/components/organisms/MaintenceForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

export default function Page() {
    return (
        <LayoutDesktop>
            <main className="mx-auto max-w-7xl p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Cadastro de Manutenção
                </h1>
                <MaintenceForm />
            </main>
        </LayoutDesktop>
    );
}
