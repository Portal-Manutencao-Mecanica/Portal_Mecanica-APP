import Link from "next/link";

import Button from "@/components/atoms/Button";
import Pagination from "@/components/molecules/Pagination";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { MachineTable } from "@/components/organisms/MachineTable";

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
            <div className="max-w-7xl mx-auto p-8 space-y-6">

                <Breadcrumbs />

                <div className="flex items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold">
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

                <Pagination
                    page={1}
                    limit={10}
                    total={50}
                    onPageChange={() => { }}
                />

            </div>
        </LayoutDesktop>
    );
}