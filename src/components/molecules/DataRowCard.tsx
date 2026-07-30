import { DataRowCardProps } from "@/props/DataRowCardProps";

export function DataRowCard({ children, actions }: DataRowCardProps) {
  return (
    <div className="flex items-center justify-between py-5 px-6 w-340 max-w-7xl bg-weg-card-white rounded-lg shadow-md ">
      
      <div className="flex items-center gap-10">
        {children}
      </div>

      
      <div className="flex items-center gap-5">
        {actions}
      </div>
    </div>
  );
}