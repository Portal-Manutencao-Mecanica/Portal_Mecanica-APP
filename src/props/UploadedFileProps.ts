import { InputEvent, InputHTMLAttributes } from "react";

export interface UploadedFileProps {
    fileObject : File,
    fileContent : string | ArrayBuffer | null,
    id? : string
}