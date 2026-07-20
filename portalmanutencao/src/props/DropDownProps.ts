export interface DropDownProps<T extends Record<string , string>>{
    defaultSelection : string,
    qty : number,
    enumData : T

    onSelect: (value: T[keyof T]) => void
}