import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Static placeholder data — there is no analytics/traffic API in scope for this
// assessment, so this widget mirrors the reference screenshot visually only.
const SPARKLINE = [40, 65, 30, 80, 50, 90, 35, 70, 45, 85, 55, 95, 40, 75, 60, 100, 50, 80, 65, 90];

const COUNTRIES = [
  { code: 'us', name: 'US', sales: '30k', change: '25.8%', positive: true, bar: 70 },
  { code: 'br', name: 'Brazil', sales: '30k', change: '15.8%', positive: false, bar: 55 },
  { code: 'au', name: 'Australia', sales: '25k', change: '35.8%', positive: true, bar: 45 },
];

export function UsersInsightCard() {
  return (
    <div className="flex h-[420px] flex-col rounded-lg border border-gray-200 bg-white pt-5 pr-5 pb-[15px] pl-5">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-accent">Users in last 30 minutes</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/icons/DotsHorizontal.svg" alt="More options" className="h-4 w-4" />
      </div>
      <p className="card-value mt-1 text-gray-900">21.5K</p>
      <p className="card-subtitle mt-4 text-gray-400">Users per minute</p>

      <div className="mt-1 flex h-[40px] items-end gap-[5px]">
        {SPARKLINE.map((h, i) => (
          <div key={i} className="flex-1 rounded-sm bg-primary" style={{ height: `${h}%` }} />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-sm font-semibold text-gray-900">
        <span>Sales by Country</span>
        <span>Sales</span>
      </div>

      <ul className="mt-2 space-y-3">
        {COUNTRIES.map((c) => (
          <li key={c.code} className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://cdn.jsdelivr.net/gh/hatscripts/circle-flags@gh-pages/flags/${c.code}.svg`}
              alt={c.name}
              className="h-[36px] w-[36px] shrink-0 rounded-full"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900">{c.sales}</span>
                <span
                  className={clsx(
                    'flex items-center gap-0.5 text-xs font-medium',
                    c.positive ? 'text-success' : 'text-error',
                  )}
                >
                  {c.positive ? <ChevronUp size={12} strokeWidth={2.5} /> : <ChevronDown size={12} strokeWidth={2.5} />}
                  {c.change}
                </span>
              </div>
              <p className="text-xs text-gray-400">{c.name}</p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                <div className="h-1.5 rounded-full bg-accent" style={{ width: `${c.bar}%` }} />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button className="mt-auto w-full rounded-full border border-accent/60 py-[3.5px] text-xs font-medium text-accent hover:bg-accent/10">
        View Insight
      </button>
    </div>
  );
}
