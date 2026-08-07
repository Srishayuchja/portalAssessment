import { MoreVertical } from 'lucide-react';

// Static placeholder data — there is no analytics/traffic API in scope for this
// assessment, so this widget mirrors the reference screenshot visually only.
const SPARKLINE = [40, 65, 30, 80, 50, 90, 35, 70, 45, 85, 55, 95, 40, 75, 60, 100, 50, 80, 65, 90];

const COUNTRIES = [
  { flag: '🇺🇸', code: 'US', name: 'United States', sales: '30k', change: '25.8%', positive: true, bar: 70 },
  { flag: '🇧🇷', code: 'BR', name: 'Brazil', sales: '30k', change: '15.8%', positive: false, bar: 55 },
  { flag: '🇦🇺', code: 'AU', name: 'Australia', sales: '25k', change: '35.8%', positive: true, bar: 45 },
];

export function UsersInsightCard() {
  return (
    <div className="flex h-[460px] flex-col rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-emerald-600">Users in last 30 minutes</p>
        <MoreVertical size={16} className="text-gray-300" />
      </div>
      <p className="mt-1 text-2xl font-semibold text-gray-900">21.5K</p>
      <p className="text-xs text-gray-400">Users per minute</p>

      <div className="mt-3 flex h-16 items-end gap-1">
        {SPARKLINE.map((h, i) => (
          <div key={i} className="flex-1 rounded-sm bg-emerald-500" style={{ height: `${h}%` }} />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-xs font-medium text-gray-400 uppercase">
        <span>Sales by Country</span>
        <span>Sales</span>
      </div>

      <ul className="mt-2 space-y-3">
        {COUNTRIES.map((c) => (
          <li key={c.code} className="flex items-center gap-2">
            <span className="text-lg leading-none">{c.flag}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900">{c.sales}</span>
                <span className={c.positive ? 'text-xs text-emerald-600' : 'text-xs text-red-500'}>
                  {c.positive ? '▲' : '▼'} {c.change}
                </span>
              </div>
              <p className="text-xs text-gray-400">{c.name}</p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                <div className="h-1.5 rounded-full bg-indigo-400" style={{ width: `${c.bar}%` }} />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button className="mt-auto w-full rounded-lg border border-emerald-200 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50">
        View Insight
      </button>
    </div>
  );
}
