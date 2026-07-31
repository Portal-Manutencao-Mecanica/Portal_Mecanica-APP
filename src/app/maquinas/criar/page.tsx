"use client";


import MachineForm from "@/components/organisms/MachineForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";



export default function CreateMachinePage() {
    
    return (
        <LayoutDesktop>
            <main>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                        Cadastro de Máquina
                </h1>
                <MachineForm/>
            </main>
            
        </LayoutDesktop>
    );
}