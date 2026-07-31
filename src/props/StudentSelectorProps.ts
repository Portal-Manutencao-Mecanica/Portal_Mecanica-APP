import { CascadingGroupProps } from "./CascadingGroupProps";

export interface StudentSelectorProps {
  groups: CascadingGroupProps[]; 
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  error?: string;
}