"use client"
import CircleLabel from "@/components/atoms/CircleLabel";
import DropDown from "@/components/atoms/DropDown";
import Label from "@/components/atoms/Label";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import { DesignaçãoEnum } from "@/types/DesignacaoEnum";

export default function Home() {
  return (
    <>
    <Label
        type={"positive"}
        placeholder={"Conforme"}
         width={"28"}
          height={"13"}/>
          <CircleLabel color={"bg-weg-negative"} height={"w-5"} width={"h-5"} />
          <LabelWithCircle
          
          />
    </>

    
  );
}
