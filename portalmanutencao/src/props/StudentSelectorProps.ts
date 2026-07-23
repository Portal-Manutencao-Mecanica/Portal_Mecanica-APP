
interface StudentSelectorProps {
    value?: number[]; 
    onChange?: (selectedIds: number[]) => void;
    error?: string;
}