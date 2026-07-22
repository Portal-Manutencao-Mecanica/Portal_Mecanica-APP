
export interface FilePayloadProps{
    name : string,
    fileContent : string | ArrayBuffer | null,
    type : string
    size : number
}