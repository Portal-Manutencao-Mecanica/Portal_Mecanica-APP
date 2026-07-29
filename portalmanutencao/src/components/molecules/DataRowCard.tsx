import { DataRowCardProps } from "@/props/DataRowCardProps";

export function DataRowCard({ children, actions }: DataRowCardProps) {
  return (
    <div className="ui-surface flex w-full flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-6">
        {children}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {actions}
      </div>
    </div>
  );
}
