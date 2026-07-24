import { StaticImageData } from "next/image";

export interface EquipmentProps {
  id: string;
  name: string;
  numberCard: string;
  sap?: string;
  tag?: string;
  patrimony?: string;
  image?: string | StaticImageData;
}