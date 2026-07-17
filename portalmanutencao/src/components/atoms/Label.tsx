import { LabelProps } from "@/props/LabelProps";
import { Span } from "next/dist/trace";


export default function label({type, placeholder, height, width} : LabelProps){
    let className : string;
    if (type === "positive") {
    className = "bg-weg-info text-white "; 
  } else if (type === "negative") {
    className = "bg-weg-negative text-white";
  } else {
    className = "bg-gray-300 text-white"; 
  }

  return (
    <span className={`${className} w-${width} h-${height} p-1.5 flex  justify-center rounded-lg`}>{placeholder}</span>
  );
}