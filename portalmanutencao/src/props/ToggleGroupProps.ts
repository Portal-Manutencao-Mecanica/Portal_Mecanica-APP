export interface ToggleGroupOption {
    value: string;
    label: string;
}

export interface ToggleGroupProps {
    options: ToggleGroupOption[];
    value: string;
    onChange: (value: string) => void;
}