"use client";

import { LabelProps } from "@/props/LabelProps";

const statusStyles = {
  positive: {
    bg: "bg-weg-info/60",
    circleBg: "bg-weg-info",
    text: "text-white",
  },
  warning: {
    bg: "bg-weg-label-warning/60",
    circleBg: "bg-weg-label-warning",
    text: "text-white",
  },
  negative: {
    bg: "bg-weg-negative/60",
    circleBg: "bg-weg-negative",
    text: "text-white",
  },
  default: {
    bg: "bg-gray-200",
    circleBg: "bg-gray-400",
    text: "text-gray-800",
  },
};

export default function LabelWithCircle({
  status,
  text,
}: LabelProps) {
  const config = statusStyles[status];

  return (
    <div
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${config.circleBg}`}
      />
      <span>{text}</span>
    </div>
  );
}