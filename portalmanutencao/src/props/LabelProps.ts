import React from "react"
import { CircleLabelProps } from "./CircleLabelProps"
import { LabelStatus } from "@/types/LabelStatus";

export interface LabelProps{
    status: LabelStatus;
    text: string;
    size?: "sm" | "md" | "lg";
}

export type { LabelStatus };
