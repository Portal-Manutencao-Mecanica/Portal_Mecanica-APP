import { EquipmentProps } from "./EquipmentProps";

export interface EquipmentComboboxProps {
  options: EquipmentProps[];
  value?: string; 
  selectedName?: string; 
  onChange: (selected: EquipmentProps | { isNew: true; name: string }) => void;
  error?: string;
  allowCreate?: boolean;
}
