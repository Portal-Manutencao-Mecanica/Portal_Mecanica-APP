import { LabelProps } from "@/props/LabelProps";

export default function Label({type, placeholder, height, width, children} : LabelProps){
    let className : string;
    if (type === "positive") {
    className = "bg-weg-info/75 text-white "; 
  } else if (type === "negative") {
    className = "bg-weg-warning/75 text-white";
  } else {
    className = "bg-gray-300 text-white"; 
  }

  return (
    <div className={`${className} ${width} ${height} p-1.5 flex items-center gap-2 justify-center rounded-lg`}>
        {children}
        <span>{placeholder}</span>
    </div>
  );
}