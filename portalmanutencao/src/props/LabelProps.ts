import { LabelStatus } from "@/types/LabelStatus";

export interface LabelProps {
  status: LabelStatus;
  text: string;
  size?: "sm";
}