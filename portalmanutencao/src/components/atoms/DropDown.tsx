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
            aria-label={defaultSelection}
            className="ui-control"
            defaultValue={""}
            data-option-count={qty}
            onChange={(e) => onSelect(e.target.value as unknown as T[keyof T])}
        >
            <option className="bg-white text-slate-400" value="" disabled>{defaultSelection}</option>
            {keys.map((key) => (
                <option
                key={key} value={enumData[key]}>
                    {enumData[key]}
                </option>
            ))}
        </select>
    );
}
