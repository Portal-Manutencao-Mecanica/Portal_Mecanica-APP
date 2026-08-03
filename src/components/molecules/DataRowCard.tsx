import { DataRowCardProps } from "@/props/DataRowCardProps";

export function DataRowCard({ children, actions }: DataRowCardProps) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-gray-200 bg-weg-card-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-4">{children}</div>
      <div className="flex flex-wrap items-center gap-3 sm:justify-end">{actions}</div>
    </div>
  );
}
