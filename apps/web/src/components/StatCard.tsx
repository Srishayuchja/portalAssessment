import clsx from 'clsx';
import { ArrowDown, ArrowUp } from 'lucide-react';

type StatColumn = {
  label: string;
  value: string;
  sub?: string;
  delta?: string;
  positive?: boolean;
};

function Delta({ positive, delta }: { positive?: boolean; delta?: string }) {
  const Arrow = positive ? ArrowUp : ArrowDown;
  return (
    <span className={clsx('flex items-center gap-0.5 text-xs font-medium', positive ? 'text-success' : 'text-error')}>
      <Arrow size={12} strokeWidth={2.5} />
      {delta}
    </span>
  );
}

export function StatCard({
  title,
  subtitle,
  value,
  valueLabel,
  delta,
  positive = true,
  footnote,
  footnoteValue,
  columns,
}: {
  title: string;
  subtitle: string;
  value?: string;
  valueLabel?: string;
  delta?: string;
  positive?: boolean;
  footnote?: string;
  footnoteValue?: string;
  columns?: StatColumn[];
}) {
  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white pt-5 pr-5 pb-[16px] pl-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="card-title text-gray-900">{title}</p>
          <p className="card-subtitle mt-[3px] text-gray-500">{subtitle}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/icons/DotsHorizontal.svg" alt="More options" className="h-4 w-4" />
      </div>

      {columns ? (
        <div className="mt-4 flex">
          {columns.map((col, i) => (
            <div key={col.label} className={clsx(i > 0 && 'ml-[47px] border-l border-gray-200 pl-[25px]')}>
              <p className="text-xs text-secondary">{col.label}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className={clsx('card-value card-value--sm', col.positive === false ? 'text-error' : 'text-secondary')}>
                  {col.value}
                </span>
                {col.sub && <span className="text-xs text-success">{col.sub}</span>}
                {col.delta && <Delta positive={col.positive} delta={col.delta} />}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex items-baseline gap-2">
          <span className="card-value text-secondary">{value}</span>
          {valueLabel && <span className="text-xs text-secondary">{valueLabel}</span>}
          <Delta positive={positive} delta={delta} />
        </div>
      )}

      {footnote && (
        <p className="mt-2 text-xs text-gray-500">
          {footnote} {footnoteValue && <span className="font-semibold text-accent">{footnoteValue}</span>}
        </p>
      )}

      <div className="mt-[11px] flex justify-end">
        <button className="w-fit rounded-full border border-accent/60 px-[18px] py-[2.5px] text-xs font-medium text-accent hover:bg-accent/10">
          Details
        </button>
      </div>
    </div>
  );
}
