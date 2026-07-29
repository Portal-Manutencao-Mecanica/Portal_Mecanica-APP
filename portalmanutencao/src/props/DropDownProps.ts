export interface DropDownProps<T extends Record<string , string>>{
    defaultSelection : string,
    qty? : number,
    enumData : T,
    value : string

    onSelect: (value: T[keyof T]) => void
}