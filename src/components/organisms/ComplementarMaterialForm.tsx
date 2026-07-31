"use client";

import MaterialCard from "../molecules/MaterialCard";

export default function ComplementarMaterialForm() {
  // MOCK
  // Depois substituir pela chamada da API

  const materials = [
    {
      id: 1,
      title: "TORNO NARDINI MS 175/205",
    },
    {
      id: 2,
      title: "FRESADORA FERRAMENTEIRA DIPLOMAT",
    },
    {
      id: 3,
      title: "RETIFICADORA CILÍNDRICA UNIVERSAL",
    },
    {
      id: 4,
      title: "FURADEIRA DE COLUNA",
    },
    {
      id: 5,
      title: "RETIFICADORA PLANA MELLO",
    },
    {
      id: 6,
      title: "PALETEIRA TM2200/TM3020",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Material de Apoio</h1>

        <p className="mt-2 text-gray-500">
          Consulte os materiais disponíveis para estudo e utilização dos
          equipamentos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => (
          <MaterialCard
            key={material.id}
            id={material.id}
            title={material.title}
          />
        ))}
      </div>
    </div>
  );
}
