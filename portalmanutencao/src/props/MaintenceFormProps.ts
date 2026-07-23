interface MaintenanceFormProps {
    machineId: number; // Ex: A máquina já vem via Prop da página de detalhes
    onSuccessCallback?: () => void;
}