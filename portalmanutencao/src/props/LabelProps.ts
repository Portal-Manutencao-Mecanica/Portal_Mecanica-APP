import React from "react"
import { CircleLabelProps } from "./CircleLabelProps"

export interface LabelProps{
    type : "positive" |  "negative" | "default"
    placeholder : string
    children ? : React.ReactNode
    width : string
    height : string
}