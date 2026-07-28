

import MaintenceForm from "@/components/organisms/MaintenceForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

export default function Page() {
    return (
        <LayoutDesktop children={
            <main className="container mx-auto p-6 max-w-4xl">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Cadastro de Manutenção
                </h1>
                <MaintenceForm />
            </main>}>
        </LayoutDesktop>
    );
}