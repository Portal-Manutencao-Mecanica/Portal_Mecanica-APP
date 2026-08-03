export interface DropDownProps {
  defaultSelection: string;
  enumData: Record<string, string>;
  onSelect: (value: string) => void;
  value?: string;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}
