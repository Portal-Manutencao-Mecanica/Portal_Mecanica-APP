export interface MachineProps {
    patrimony: string;
    name: string;
    place: string;
    condition: "ATIVA" | "MANUTENCAO" | "INATIVA";
    tag: string;
    description: string;
}