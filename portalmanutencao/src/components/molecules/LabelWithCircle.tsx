'use client'
import { LabelProps, LabelStatus } from "../../props/LabelProps";

const statusStyles: Record<
  LabelStatus,
  { bg: string; circleBg: string; text: string }
> = {
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


const sizeStyles = {
  sm: { badge: "px-2 py-0.5 text-xs gap-1.5", circle: "w-1.5 h-1.5 min-w-[6px] min-h-[6px]" },
  md: { badge: "px-3 py-1 text-sm gap-2", circle: "w-2.5 h-2.5 min-w-[10px] min-h-[10px]" },
  lg: { badge: "px-4 py-1.5 text-base gap-2.5", circle: "w-3.5 h-3.5 min-w-[14px] min-h-[14px]" },
};

export default function LabelWithCircle({ status, text, size = "md" }: LabelProps) {
  const config = statusStyles[status] || statusStyles.default;
  const sizeConfig = sizeStyles[size] || sizeStyles.md;

  return (
    <div
      className={`inline-flex w-fit items-center rounded-full font-medium ${config.bg} ${config.text} ${sizeConfig.badge}`}
    >
      {/* 💡 Mudamos para inline-block para o browser renderizar as dimensões físicas da div/span vazia */}
      <span
        className={`inline-block rounded-full shrink-0 ${config.circleBg} ${sizeConfig.circle}`}
      />
      <span>{text}</span>
    </div>
  );
}