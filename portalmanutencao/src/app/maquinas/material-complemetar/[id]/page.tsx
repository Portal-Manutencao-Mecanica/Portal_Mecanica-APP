import LayoutDesktop from "@/components/templates/LayoutDesktop";

interface MaterialPageProps {
    params: {
        id: string;
    };
}

export default function MaterialDetailsPage({
    params,
}: MaterialPageProps) {

    // MOCK
    // Depois buscar da API usando params.id

    const material = {
        id: params.id,
        title: "TORNO NARDINI MS 175/205",
        description:
            "Máquina utilizada para operações de torneamento e usinagem de peças cilíndricas.",
        manufacturer: "Nardini",
        model: "MS 175/205",
    };

    return (
        <LayoutDesktop>
            <div className="mx-auto max-w-5xl p-8">

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                    <div className="flex h-80 items-center justify-center bg-gray-100">
                        <span className="text-gray-400">
                            Imagem do material
                        </span>
                    </div>

                    <div className="space-y-6 p-8">

                        <div>
                            <h1 className="text-3xl font-bold">
                                {material.title}
                            </h1>
                        </div>

                        <div>
                            <h2 className="font-semibold">
                                Descrição
                            </h2>

                            <p className="mt-2 text-gray-600">
                                {material.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Fabricante
                                </p>

                                <p className="font-medium">
                                    {material.manufacturer}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Modelo
                                </p>

                                <p className="font-medium">
                                    {material.model}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </LayoutDesktop>
    );
}