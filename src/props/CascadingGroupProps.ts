import { CascadingItemProps } from "./CascadingItemProps";

export interface CascadingGroupProps<T extends CascadingItemProps = CascadingItemProps> {
  id: string | number;
  name: string;
  items: T[];
}