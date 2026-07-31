import DashboardStatCardProps from "@/props/DashboardStatCard";

export function DashboardStatCard({
  title,
  value,
  helper,
  badgeLabel,
  badgeColorClass,
  accentClass,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
              {title}
            </p>
            {badgeLabel ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${badgeColorClass}`}
              >
                {badgeLabel}
              </span>
            ) : null}
          </div>
          <p className="mt-4 text-3xl font-semibold text-gray-900">{value}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${accentClass} text-white`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {helper ? (
        <p className="mt-4 text-sm text-gray-500">{helper}</p>
      ) : null}
    </div>
  );
}