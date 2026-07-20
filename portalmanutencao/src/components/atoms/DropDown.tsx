"use client";
import { DropDownProps } from "@/props/DropDownProps";

export default function DropDown<T extends Record <string , string >>({
    defaultSelection,
    qty,
    enumData,
    onSelect,
} : DropDownProps<T>){

    const keys = Object.keys(enumData).filter((key) => isNaN(Number(key)));

    return (
        <select 
            className=" bg-white text-slate-800 border border-slate-300 rounded-md px-3 py-2 shadow-md focus:outline-none "
            defaultValue={""}
            onChange={(e) => onSelect(e.target.value as unknown as T[keyof T])}
        >
            <option className="bg-white text-slate-400" value="" disabled>{defaultSelection}</option>
            {keys.map((key) => (
                <option className="bg-gray-200 text-slate-600"
                key={key} value={enumData[key]}>
                    {enumData[key]}
                </option>
            ))}
        </select>
    );
}