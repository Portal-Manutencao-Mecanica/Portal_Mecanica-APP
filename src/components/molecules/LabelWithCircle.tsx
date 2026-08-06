"use client";

import { LabelProps } from "@/props/LabelProps";

const statusStyles = {
  positive: {
    bg: "bg-weg-positive/10",
    circleBg: "bg-weg-positive",
    text: "text-weg-positive",
  },
  info: {
    bg: "bg-weg-blue/10",
    circleBg: "bg-weg-blue",
    text: "text-weg-blue",
  },
  warning: {
    bg: "bg-weg-warning/25",
    circleBg: "bg-weg-warning",
    text: "text-gray-800",
  },
  negative: {
    bg: "bg-weg-negative/10",
    circleBg: "bg-weg-negative",
    text: "text-weg-negative",
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
