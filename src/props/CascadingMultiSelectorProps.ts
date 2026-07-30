import { CascadingGroupProps } from "./CascadingGroupProps";
import { CascadingItemProps } from "./CascadingItemProps";

export interface CascadingMultiSelectorProps<T extends CascadingItemProps> {
  groups: CascadingGroupProps<T>[];
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  label?: string;
  placeholder?: string;
  groupHeader?: string;
  itemHeader?: string;
  error?: string;
  badgeIcon?: React.ElementType;
}