import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";

export default function EquipmentDetailsPage() {
  const equipment = {
    id: 1,
    name: "Motor WEG 2CV",
    sap: "123456",
    numberCard: "EQ-0001",
    image: "/images/default-equipment.png",
  };

  return (
    <LayoutDesktop>
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{equipment.name}</h1>

            <p className="text-gray-500 mt-2">Informações do equipamento</p>
          </div>

          <Button>Editar</Button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6">
          <LabelWithCircle
            title="Número do Card"
            value={equipment.numberCard}
          />

          <LabelWithCircle title="Código SAP" value={equipment.sap} />
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Imagem</h2>

          <div className="h-72 rounded-xl border bg-gray-100 flex items-center justify-center">
            Imagem do equipamento
          </div>
        </div>
      </div>
    </LayoutDesktop>
  );
}
