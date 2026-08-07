import clsx from 'clsx';
import { MoreVertical } from 'lucide-react';

export function StatCard({
  title,
  subtitle,
  value,
  valueLabel,
  delta,
  positive = true,
  footnote,
}: {
  title: string;
  subtitle: string;
  value: string;
  valueLabel?: string;
  delta: string;
  positive?: boolean;
  footnote?: string;
}) {
  return (
    <div className="flex h-[222px] flex-col rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
        <MoreVertical size={16} className="text-gray-300" />
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        {valueLabel && <span className="text-xs text-gray-400">{valueLabel}</span>}
        <span className={clsx('ml-auto text-xs font-medium', positive ? 'text-emerald-600' : 'text-red-500')}>
          {positive ? '▲' : '▼'} {delta}
        </span>
      </div>

      {footnote && <p className="mt-1 text-xs text-gray-400">{footnote}</p>}

      <button className="mt-auto w-fit rounded-full border border-emerald-200 px-4 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50">
        Details
      </button>
    </div>
  );
}
