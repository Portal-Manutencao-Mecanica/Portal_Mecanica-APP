import Link from "next/link";

import Button from "@/components/atoms/Button";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { MachineTable } from "@/components/organisms/MachineTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

const machines = [
    {
        id: 1,
        patrimony: "100001",
        name: "Torno CNC",
        place: "Laboratório A",
        condition: "ATIVA",
        tag: "CNC",
    },
    {
        id: 2,
        patrimony: "100002",
        name: "Impressora 3D",
        place: "Laboratório B",
        condition: "MANUTENCAO",
        tag: "3D",
    },
    {
        id: 3,
        patrimony: "100003",
        name: "Fresadora",
        place: "Laboratório C",
        condition: "ATIVA",
        tag: "FRESA",
    },
];

export default function MachinesPage() {
    return (
        <LayoutDesktop>
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

                <Breadcrumbs />

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            Máquinas
                        </h1>

                        <p className="text-gray-500">
                            Visualize todas as máquinas cadastradas.
                        </p>
                    </div>

                    <Link href="/maquinas/criar">
                        <Button>
                            Nova Máquina
                        </Button>
                    </Link>

                </div>

                <MachineTable machines={machines} />

            </div>
        </LayoutDesktop>
    );
}